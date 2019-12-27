import { NzNotificationService } from "ng-zorro-antd";
import { SetupService } from "./../../../shared/services/setup.service";
import { first } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-title-setup",
  templateUrl: "./title-setup.component.html",
  styleUrls: ["./title-setup.component.css"]
})
export class TitleSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingTitle = new BehaviorSubject(false);

  data = [];
  list = [];
  error = "";
  name = "";

  gender = null;

  componentLabel = "title";

  submitForm(): void {
    if (
      this.name == null ||
      this.name == "" ||
      this.gender == null ||
      this.gender == ""
    ) {
      this.error = "All Fields are required!";
    } else {
      this.error = "";
      this.isCreatingTitle.next(true);
      this.setup
        .createTitle(this.name, this.gender)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingTitle.next(false);
            if (success) {
              this.notification.blank(
                "Success",
                `Successfully created ${this.componentLabel}`
              );
              this.getTitles();
              this.name = "";
            } else {
              this.notification.blank(
                "Error",
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingTitle.next(false);
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

  getTitles() {
    this.setup
      .getTitles()
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
    this.getTitles();
  }
  log(input: any) {
    console.log(input.toString());
  }
}
