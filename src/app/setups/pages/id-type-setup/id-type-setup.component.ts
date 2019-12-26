import { NzNotificationService } from "ng-zorro-antd";
import { SetupService } from "./../../../shared/services/setup.service";
import { first } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-id-type-setup",
  templateUrl: "./id-type-setup.component.html",
  styleUrls: ["./id-type-setup.component.css"]
})
export class IdTypeSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingIdType = new BehaviorSubject(false);
  data = [];
  list = [];
  error = "";
  idType = "";
  componentLabel = "id type";

  submitForm(): void {
    if (this.idType == null || this.idType == "") {
      this.error = `Please enter ${this.componentLabel} name`;
    } else {
      this.error = "";
      this.isCreatingIdType.next(true);
      this.setup
        .createIdType(this.idType)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingIdType.next(false);
            if (success) {
              this.notification.blank(
                "Success",
                `Successfully created ${this.componentLabel}`
              );
              this.getIdTypes();
              this.idType = "";
            } else {
              this.notification.blank(
                "Error",
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingIdType.next(false);
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
  getIdTypes() {
    this.setup
      .getIdTypes()
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
    this.getIdTypes();
  }
}
