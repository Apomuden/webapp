import { NzNotificationService } from "ng-zorro-antd";
import { SetupService } from "./../../../shared/services/setup.service";
import { first } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-education-level-setup",
  templateUrl: "./education-level-setup.component.html",
  styleUrls: ["./education-level-setup.component.css"]
})
export class EducationLevelSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingEducationalLevel = new BehaviorSubject(false);
  data = [];
  list = [];
  error = "";
  educationalLevel = "";
  componentLabel = "educational level";

  submitForm(): void {
    if (this.educationalLevel == null || this.educationalLevel == "") {
      this.error = `Please enter ${this.componentLabel} name`;
    } else {
      this.error = "";
      this.isCreatingEducationalLevel.next(true);
      this.setup
        .createEducationalLevel(this.educationalLevel)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingEducationalLevel.next(false);
            if (success) {
              this.notification.blank(
                "Success",
                `Successfully created ${this.componentLabel}`
              );
              this.getEducationalLevels();
              this.educationalLevel = "";
            } else {
              this.notification.blank(
                "Error",
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingEducationalLevel.next(false);
            this.notification.blank(
              "Error",
              `Could not create ${this.componentLabel}`
            );
          }
        );
    }
  }

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService
  ) {}
  getEducationalLevels() {
    this.setup
      .getEducationalLevels()
      .pipe(first())
      .subscribe(
        data => {
          this.data = data.data;
          this.list = data.data;
          this.initLoading = false;
          console.log(this.data);
        },
        error => {
          console.log(error);
        }
      );
  }
  ngOnInit() {
    this.getEducationalLevels();
  }
}
