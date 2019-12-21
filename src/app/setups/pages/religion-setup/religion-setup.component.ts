import { SetupService } from "./../../../shared/services/setup.service";
import { first } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { NzNotificationService } from "ng-zorro-antd";

@Component({
  selector: "app-religion-setup",
  templateUrl: "./religion-setup.component.html",
  styleUrls: ["./religion-setup.component.css"]
})
export class ReligionSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingReligion = new BehaviorSubject(false);
  data = [];
  list = [];
  error = "";
  religion = "";
  componentLabel = "religion";

  submitForm(): void {
    if (this.religion == null || this.religion == "") {
      this.error = `Please enter ${this.componentLabel} name`;
    } else {
      this.error = "";
      this.isCreatingReligion.next(true);
      this.setup
        .createReligion(this.religion)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingReligion.next(false);
            if (success) {
              this.notification.blank(
                "Success",
                `Successfully created ${this.componentLabel}`
              );
              this.getReligions();
              this.religion = "";
            } else {
              this.notification.blank(
                "Error",
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingReligion.next(false);
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
  getReligions() {
    this.setup
      .getReligions()
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
    this.getReligions();
  }
}
