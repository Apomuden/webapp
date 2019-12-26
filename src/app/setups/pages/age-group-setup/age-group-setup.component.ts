import { NzNotificationService } from "ng-zorro-antd";
import { SetupService } from "./../../../shared/services/setup.service";
import { first } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-age-group-setup",
  templateUrl: "./age-group-setup.component.html",
  styleUrls: ["./age-group-setup.component.css"]
})
export class AgeGroupSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingAgeGroup = new BehaviorSubject(false);
  data = [];
  list = [];
  error = "";
  name = "";
  minAge = "";
  componentLabel = "age group";

  submitForm(): void {
    if (
      this.name == null ||
      this.name == "" ||
      this.minAge == null ||
      this.minAge == ""
    ) {
      this.error = `All fields are required!`;
    } else {
      this.error = "";
      this.isCreatingAgeGroup.next(true);
      this.setup
        .createAgeGroup(this.name, this.minAge)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingAgeGroup.next(false);
            if (success) {
              this.notification.blank(
                "Success",
                `Successfully created ${this.componentLabel}`
              );
              this.getAgeGroups();
              this.name = "";
              this.minAge = "";
            } else {
              this.notification.blank(
                "Error",
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingAgeGroup.next(false);
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
  getAgeGroups() {
    this.setup
      .getAgeGroups()
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
    this.getAgeGroups();
  }
}
