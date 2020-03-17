import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
const DAY = 'DAY';
const WEEK = 'WEEK';
const MONTH = 'MONTH';
const YEAR = 'YEAR';
@Component({
  selector: 'app-age-group-setup',
  templateUrl: './age-group-setup.component.html',
  styleUrls: ['./age-group-setup.component.css']
})
export class AgeGroupSetupComponent implements OnInit, AfterViewInit, OnDestroy {
  initLoading = true; // bug
  loadingMore = false;
  isVisible = false;
  modalError = '';
  isUpdatingAgeGroup = new BehaviorSubject(false);
  isCreatingAgeGroup = new BehaviorSubject(false);
  ageGroups = [];
  units = [DAY, WEEK, MONTH, YEAR];
  componentLabel = 'age group';
  ageGroupId: number;
  updateForm = this.fb.group({
    name: [null, Validators.required],
    min_age: [null, [Validators.required]],
    min_age_unit: [YEAR, Validators.required],
    max_age: [null],
    max_age_unit: [YEAR],
  });
  ageGroupForm = this.fb.group({
    name: [null, Validators.required],
    min_age: [null, [Validators.required]],
    min_age_unit: [YEAR, Validators.required],
    max_age: [null],
    max_age_unit: [YEAR],
  });

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getAgeGroups();
  }

  ngAfterViewInit() {
    this.ageGroupForm.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe(value => this.validateAge(value, this.ageGroupForm));

    this.updateForm.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe(value => this.validateAge(value, this.updateForm));
  }

  private validateAge(value: any, ageGroupForm: FormGroup): void {
    const minAge: number = value.min_age;
    const maxAge: number = value.max_age;
    const maxAgeUnit: string = value.max_age_unit;
    const minAgeUnit: string = value.min_age_unit;
    if (maxAge && !maxAgeUnit) {
      ageGroupForm.get('max_age_unit').setValidators(Validators.required);
    }
    if (!maxAge && maxAgeUnit) {
      ageGroupForm.get('max_age').setValidators(Validators.required);
    }
    if (minAgeUnit === YEAR &&
      ((maxAgeUnit === DAY && maxAge < 365 * minAge)
        || (maxAgeUnit === MONTH && maxAge < 12 * minAge)
        || (maxAgeUnit === WEEK && maxAge < 52 * minAge))) {
      ageGroupForm.get('max_age').setErrors({ invalid: true });
    } else if (minAgeUnit === MONTH &&
      ((maxAgeUnit === DAY && maxAge < 31 * minAge) || (maxAgeUnit === WEEK && maxAge < 4 * minAge))) {
      ageGroupForm.get('max_age').setErrors({ invalid: true });
    } else if (minAgeUnit === WEEK && (maxAgeUnit === DAY && maxAge < 31 * minAge)) {
      ageGroupForm.get('max_age').setErrors({ invalid: true });
    } else if (minAgeUnit === DAY && (maxAgeUnit === WEEK || maxAgeUnit === MONTH || maxAgeUnit === YEAR)) {
      ageGroupForm.get('max_age').setErrors(null);
    } else if (minAgeUnit === WEEK && (maxAgeUnit === MONTH || maxAgeUnit === YEAR)) {
      ageGroupForm.get('max_age').setErrors(null);
    } else if (minAgeUnit === MONTH && (maxAgeUnit === YEAR)) {
      ageGroupForm.get('max_age').setErrors(null);
    } else {
      if (minAge >= maxAge) {
        ageGroupForm.get('max_age').setErrors({ invalid: true });
      } else {
        ageGroupForm.get('max_age').setErrors(null);
      }
    }
  }

  ngOnDestroy() {
  }

  submitForm(): void {
    if (!this.validateForm()) {
      this.notification.error(`Please fill the form correctly!`,
        `Check and make sure you've provided all fields and min age is not greater than max age`);
    } else {
      this.isCreatingAgeGroup.next(true);
      this.setup
        .createAgeGroup(this.ageGroupForm.value)
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
              this.ageGroupForm.reset();
              this.ageGroupForm.get('max_age_unit').setValue(YEAR);
              this.ageGroupForm.get('min_age_unit').setValue(YEAR);
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
            this.updateForm.reset();
            this.closeModal();
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
    const { name, min_age, max_age, min_age_unit, max_age_unit } = ageGroup;
    this.ageGroupId = ageGroup.id as number;
    this.updateForm.get('name').setValue(name);
    this.updateForm.get('min_age').setValue(min_age);
    this.updateForm.get('max_age').setValue(max_age);
    this.updateForm.get('min_age_unit').setValue(min_age_unit || YEAR);
    this.updateForm.get('max_age_unit').setValue(max_age_unit || YEAR);
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
    return this.ageGroupForm.valid;
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
        }
      );
  }

  toggleItem($event: any, ageGroup: any) {
    this.setup.toggleActive(`setups/agegroups/${ageGroup.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.ageGroups.findIndex(group => group.id === toggled.id);
        this.ageGroups[index].isActivated = toggled.isActivated;
      }, error => {
        const index = this.ageGroups.findIndex(group => group.id === ageGroup.id);
        this.ageGroups[index].isActivated = !ageGroup.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
