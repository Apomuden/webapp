import { SetupService } from "./../../../shared/services/setup.service";
import { first } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { NzNotificationService } from "ng-zorro-antd";

@Component({
  selector: "app-sponsership-type-setup",
  templateUrl: "./sponsership-type-setup.component.html",
  styleUrls: ["./sponsership-type-setup.component.css"]
})
export class SponsershipTypeSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingSponsorshipType = new BehaviorSubject(false);
  data = [];
  list = [];
  error = "";
  sponsorshipType = "";

  submitForm(): void {
    if (this.sponsorshipType == null || this.sponsorshipType == "") {
      this.error = "Please enter sponsorship type name";
    } else {
      this.error = "";
      this.isCreatingSponsorshipType.next(true);
      this.setup
        .createSponsorshipType(this.sponsorshipType)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingSponsorshipType.next(false);
            if (success) {
              this.notification.blank(
                "Success",
                "Successfully created sponsorship type"
              );
              this.getSponsorshipTypes();
              this.sponsorshipType = "";
            } else {
              this.notification.blank(
                "Error",
                "Could not create sponsorship type"
              );
            }
          },
          error => {
            this.isCreatingSponsorshipType.next(false);
            this.notification.blank(
              "Error",
              "Could not create sponsorship type"
            );
          }
        );
    }
  }

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService
  ) {}
  getSponsorshipTypes() {
    this.setup
      .getSponsorshipTypes()
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
    this.getSponsorshipTypes();
  }
}
