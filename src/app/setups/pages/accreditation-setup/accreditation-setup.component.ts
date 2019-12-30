import { NzNotificationService } from "ng-zorro-antd";
import { SetupService } from "./../../../shared/services/setup.service";
import { first } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-accreditation-setup",
  templateUrl: "./accreditation-setup.component.html",
  styleUrls: ["./accreditation-setup.component.css"]
})
export class AccreditationSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingAccreditation = new BehaviorSubject(false);
  data = [];
  list = [];
  error = "";
  regBody = "";
  regNumber = "";
  tin = "";
  expDate = null;
  registrationDate = null;
  componentLabel = "accreditation";

  submitForm(): void {
    if (
      this.regBody === null ||
      this.regBody === "" ||
      this.tin === null ||
      this.tin === "" ||
      this.registrationDate === null ||
      this.registrationDate === "" ||
      this.expDate === null ||
      this.expDate === "" ||
      this.regNumber === null ||
      this.regNumber === ""
    ) {
      this.error = `All fields are required!`;
    } else {
      this.error = "";
      this.isCreatingAccreditation.next(true);
      this.setup
        .createAccreditation(
          this.regBody,
          this.regNumber,
          this.registrationDate,
          this.tin,
          this.expDate
        )
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingAccreditation.next(false);
            if (success) {
              this.notification.blank(
                "Success",
                `Successfully created ${this.componentLabel}`
              );
              this.getAccreditations();
              this.tin = "";
              this.regBody = "";
              this.regNumber = "";
              this.expDate = null;
              this.registrationDate = null;
            } else {
              this.notification.blank(
                "Error",
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingAccreditation.next(false);
            this.notification.blank(
              "Error",
              `Could not create ${this.componentLabel}`
            );
          }
        );
    }
  }

  onRegistrationDateChanged(result: Date): void {
    this.registrationDate = result;
  }
  onExpiryDateChanged(result: Date): void {
    this.expDate = result;
  }

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService
  ) {}
  getAccreditations() {
    this.setup
      .getAccreditations()
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
    this.getAccreditations();
  }
}
