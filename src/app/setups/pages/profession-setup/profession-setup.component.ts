import { NzNotificationService } from "ng-zorro-antd";
import { SetupService } from "./../../../shared/services/setup.service";
import { first } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-profession-setup",
  templateUrl: "./profession-setup.component.html",
  styleUrls: ["./profession-setup.component.css"]
})
export class ProfessionSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingProfession = new BehaviorSubject(false);
  staffCategoriesLoading = new BehaviorSubject(false);

  data = [];
  list = [];
  error = "";
  name = "";

  staffCategory = null;

  staffCategories = null;

  componentLabel = "profession";

  submitForm(): void {
    if (
      this.name == null ||
      this.name == "" ||
      this.staffCategory == null ||
      this.staffCategory == ""
    ) {
      this.error = "All Fields are required!";
    } else {
      this.error = "";
      this.isCreatingProfession.next(true);
      this.setup
        .createProfession(this.name, this.staffCategory)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingProfession.next(false);
            if (success) {
              this.notification.blank(
                "Success",
                `Successfully created ${this.componentLabel}`
              );
              this.getProfessions();
              this.name = "";
            } else {
              this.notification.blank(
                "Error",
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingProfession.next(false);
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

  getProfessions() {
    this.setup
      .getProfessions()
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

  getStaffCategories() {
    this.staffCategoriesLoading.next(true);
    this.setup
      .getStaffCategories()
      .pipe(first())
      .subscribe(
        data => {
          this.staffCategoriesLoading.next(false);
          this.staffCategories = data.data;
        },
        error => {
          this.staffCategoriesLoading.next(false);
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.getProfessions();
    this.getStaffCategories();
  }
}
