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
const EQUAL = { value: '=', name: 'Equal To' };
const GREATEREQUAL = { value: '>=', name: 'Greater or Equal to' };
const LESSEQUAL = { value: '<=', name: 'Less or Equal to' };
const LESS = { value: '>', name: 'Less Than' };
const GREATER = { value: '>', name: 'Greater Than' };

@Component({
  selector: 'app-age-category-setup',
  templateUrl: './age-category-setup.component.html',
  styleUrls: ['./age-category-setup.component.css']
})
export class AgeCategorySetupComponent implements OnInit, AfterViewInit, OnDestroy {
  initLoading = true;
  loadingMore = false;
  loadingClasses = false;
  isVisible = false;
  modalError = '';
  isUpdatingAgeCat = new BehaviorSubject(false);
  isCreatingAgeCat = new BehaviorSubject(false);
  ageCategories = [];
  ageGroups = [];
  ageClassifications = [];
  units = [DAY, WEEK, MONTH, YEAR];
  comparators = [EQUAL, GREATER, LESS, GREATEREQUAL, LESSEQUAL];
  componentLabel = 'age category';
  ageCatId: number;
  updateForm = this.fb.group({
    description: [null, Validators.required],
    age_classification_id: [null, Validators.required],
    age_group_id: [null, Validators.required],
    min_age: [null, [Validators.required]],
    min_unit: [YEAR, Validators.required],
    min_comparator: [GREATEREQUAL.value, [Validators.required]],
    max_comparator: [LESSEQUAL.value, [Validators.required]],
    max_age: [null],
    max_unit: [YEAR],
  });
  ageCategoryForm = this.fb.group({
    description: [null, Validators.required],
    age_classification_id: [null, Validators.required],
    age_group_id: [null, Validators.required],
    min_age: [null, [Validators.required]],
    min_comparator: [GREATEREQUAL.value, [Validators.required]],
    min_unit: [YEAR, Validators.required],
    max_age: [null],
    max_comparator: [LESSEQUAL.value, [Validators.required]],
    max_unit: [YEAR],
  });

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getAgeCategories();
    this.getAgeClassifications();
    this.getAgeGroups();
  }

  ngAfterViewInit() {
    this.ageCategoryForm.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe(value => this.validateAge(value, this.ageCategoryForm));

    this.updateForm.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe(value => this.validateAge(value, this.updateForm));
  }

  ngOnDestroy() {
  }

  private validateAge(value: any, form: FormGroup): void {
    const minAge: number = value.min_age;
    const maxAge: number = value.max_age;
    const maxAgeUnit: string = value.max_unit;
    const minAgeUnit: string = value.min_unit;
    if (maxAge && !maxAgeUnit) {
      form.get('max_unit').setValidators(Validators.required);
    }
    if (!maxAge && maxAgeUnit) {
      form.get('max_age').setValidators(Validators.required);
    }
    if (minAgeUnit === YEAR &&
      ((maxAgeUnit === DAY && maxAge < 365 * minAge)
        || (maxAgeUnit === MONTH && maxAge < 12 * minAge)
        || (maxAgeUnit === WEEK && maxAge < 52 * minAge))) {
      form.get('max_age').setErrors({ invalid: true });
    } else if (minAgeUnit === MONTH &&
      ((maxAgeUnit === DAY && maxAge < 31 * minAge) || (maxAgeUnit === WEEK && maxAge < 4 * minAge))) {
      form.get('max_age').setErrors({ invalid: true });
    } else if (minAgeUnit === WEEK && (maxAgeUnit === DAY && maxAge < 31 * minAge)) {
      form.get('max_age').setErrors({ invalid: true });
    } else if (minAgeUnit === DAY && (maxAgeUnit === WEEK || maxAgeUnit === MONTH || maxAgeUnit === YEAR)) {
      form.get('max_age').setErrors(null);
    } else if (minAgeUnit === WEEK && (maxAgeUnit === MONTH || maxAgeUnit === YEAR)) {
      form.get('max_age').setErrors(null);
    } else if (minAgeUnit === MONTH && (maxAgeUnit === YEAR)) {
      form.get('max_age').setErrors(null);
    } else {
      if (minAge >= maxAge) {
        form.get('max_age').setErrors({ invalid: true });
      } else {
        form.get('max_age').setErrors(null);
      }
    }
  }

  submitForm(): void {
    if (!this.validateForm()) {
      this.notification.error(`Please fill the form correctly!`,
        `Check and make sure you've provided all fields and min age is not greater than max age`);
    } else {
      this.isCreatingAgeCat.next(true);
      this.setup
        .createAgeCategory(this.ageCategoryForm.value)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingAgeCat.next(false);
            if (success) {
              this.notification.success(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getAgeCategories();
              this.ageCategoryForm.reset();
              this.ageCategoryForm.get('max_unit').setValue(YEAR);
              this.ageCategoryForm.get('min_unit').setValue(YEAR);
              this.ageCategoryForm.get('min_comparator').setValue(GREATEREQUAL);
              this.ageCategoryForm.get('max_comparator').setValue(LESSEQUAL);
            } else {
              this.notification.error(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingAgeCat.next(false);
            this.notification.error(
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
      this.isUpdatingAgeCat.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/agecategories/${this.ageCatId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingAgeCat.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.updateForm.reset();
            this.closeModal();
            this.getAgeCategories();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingAgeCat.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }
  }

  showModal(ageCat: any) {
    this.isVisible = true;
    const {
      age_classification_id, min_age, max_age,
      min_unit, max_unit, max_comparator,
      min_comparator, description, age_group_id
    } = ageCat;
    this.ageCatId = ageCat.id as number;
    this.updateForm.get('description').setValue(description);
    this.updateForm.get('age_group_id').setValue(age_group_id);
    this.updateForm.get('age_classification_id').setValue(age_classification_id);
    this.updateForm.get('min_age').setValue(min_age);
    this.updateForm.get('min_comparator').setValue(min_comparator);
    this.updateForm.get('max_age').setValue(max_age);
    this.updateForm.get('max_comparator').setValue(max_comparator);
    this.updateForm.get('min_unit').setValue(min_unit || YEAR);
    this.updateForm.get('max_unit').setValue(max_unit || YEAR);
  }

  closeModal() {
    this.ageCatId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingAgeCat.next(false);
  }


  deleteAgeCat(agecat: any) {
    this.setup.deleteSetup(`setups/agecategories/${agecat.id}`).pipe(first()).subscribe(
      res => {
        this.getAgeCategories();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  validateForm() {
    return this.ageCategoryForm.valid;
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

  getAgeCategories() {
    this.setup
      .getAgeCategories()
      .pipe(first())
      .subscribe(
        data => {
          console.log(data.data);
          this.ageCategories = data.data;
          this.initLoading = false;
        },
        error => {
        }
      );
  }

  getAgeClassifications() {
    this.setup
      .getAgeClassifications()
      .pipe(first())
      .subscribe(
        data => {
          this.ageClassifications = data.data;
          this.initLoading = false;
        },
        error => {
        }
      );
  }

  toggleItem($event: any, ageCategory: any) {
    this.setup.toggleActive(`setups/agecategories/${ageCategory.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.ageCategories.findIndex(category => category.id === toggled.id);
        this.ageCategories[index].isActivated = toggled.isActivated;
      }, error => {
        const index = this.ageCategories.findIndex(category => category.id === ageCategory.id);
        this.ageCategories[index].isActivated = !ageCategory.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
