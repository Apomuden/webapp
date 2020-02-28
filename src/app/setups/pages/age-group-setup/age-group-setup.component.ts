import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-age-group-setup',
  templateUrl: './age-group-setup.component.html',
  styleUrls: ['./age-group-setup.component.css']
})
export class AgeGroupSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isVisible = false;
  modalError = '';
  updateForm: FormGroup;
  isUpdatingAgeGroup = new BehaviorSubject(false);
  isCreatingAgeGroup = new BehaviorSubject(false);
  ageGroups = [];
  ageGroupId = null;
  name = '';
  minAge: number;
  maxAge: number;
  componentLabel = 'age group';

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.updateForm = this.fb.group({
      name: [null, Validators.required],
      min_age: [null, Validators.required],
      max_age: [null]
    });
    this.getAgeGroups();
  }

  submitForm(): void {
    if (this.validateForm()) {
      this.notification.error(`Please fill the form correctly!`,
        `Check and make sure you've provided all fields and min age is not greater than max age`);
    } else {
      this.isCreatingAgeGroup.next(true);
      this.setup
        .createAgeGroup(this.name, this.minAge, this.maxAge)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingAgeGroup.next(false);
            if (success) {
              this.notification.success(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getAgeGroups();
              this.name = '';
              this.minAge = null;
              this.maxAge = null;
            } else {
              this.notification.error(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingAgeGroup.next(false);
            this.notification.blank(
              'Error',
              `Could not create ${this.componentLabel}`
            );
          }
        );
    }
  }

  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'All fields are required';
    } else {
      this.modalError = '';
      this.isUpdatingAgeGroup.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/agegroups/${this.ageGroupId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingAgeGroup.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getAgeGroups();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingAgeGroup.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }

  }
  showModal(ageGroup: any) {
    this.isVisible = true;
    const { name, min_age, max_age } = ageGroup;
    this.ageGroupId = ageGroup.id as number;
    this.updateForm.get('name').setValue(name);
    this.updateForm.get('min_age').setValue(min_age);
    this.updateForm.get('max_age').setValue(max_age);
  }

  closeModal() {
    this.ageGroupId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingAgeGroup.next(false);
  }


  deleteAgeGroup(agegroup: any) {
    this.setup.deleteSetup(`setups/agegroups/${agegroup.id}`).pipe(first()).subscribe(
      res => {
        this.getAgeGroups();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  validateForm() {
    return (!this.name ||
      !this.minAge ||
      !this.maxAge || this.minAge > this.maxAge);
  }

  getAgeGroups() {
    this.setup
      .getAgeGroups()
      .pipe(first())
      .subscribe(
        data => {
          this.ageGroups = data.data;
          this.initLoading = false;
        },
        error => {
          console.log(error);
        }
      );
  }

  toggleItem($event: any, ageGroup: any) {
    this.setup.toggleActive(`setups/agegroups/${ageGroup.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        console.log(toggled);
        const index = this.ageGroups.findIndex(group => group.id === toggled.id);
        this.ageGroups[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.ageGroups.findIndex(group => group.id === ageGroup.id);
        this.ageGroups[index].isActivated = !ageGroup.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
