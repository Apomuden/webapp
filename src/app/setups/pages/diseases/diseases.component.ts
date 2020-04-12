import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-diseases',
  templateUrl: './diseases.component.html',
  styleUrls: ['./diseases.component.css']
})
export class DiseasesComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  modalError = '';
  categories = null;
  ageGroups = null;
  illnessTypes = null;
  mohGhsGroupings = null;
  icd10Groupings = null;
  isVisible = false;
  isCreatingItem = new BehaviorSubject(false);
  isUpdatingItem = new BehaviorSubject(false);
  icd10CategoriesLoading = new BehaviorSubject(false);
  icd10GroupingsLoading = new BehaviorSubject(false);
  mohGhsGroupingsLoading = new BehaviorSubject(false);
  illnessTypesLoading = new BehaviorSubject(false);
  ageGroupsLoading = new BehaviorSubject(false);
  updateForm: FormGroup;
  createForm: FormGroup;
  itemId = null;
  data = [];
  list = [];
  error = '';
  setupItem = '';
  componentLabel = 'disease';

  submitForm(): void {
    if (this.createForm.invalid) {
      this.error = `All fields are required`;
    } else {
      this.error = '';
      this.isCreatingItem.next(true);
      this.setup
        .genericPost('setups/diseases', {
          ...this.createForm.value, status: 'ACTIVE',
          gender: this.createForm.get('gender').value.join(',')
        })
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingItem.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getItems();
              this.createForm.reset();
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingItem.next(false);
            this.notification.blank(
              'Error',
              `Could not create ${this.componentLabel}`
            );
          }
        );
    }
  }

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService,
    private fb: FormBuilder
  ) { }
  getItems() {
    this.setup
      .genericGet('setups/diseases')
      .pipe(first())
      .subscribe(
        data => {
          this.data = data;
          this.list = data;
          this.initLoading = false;
          console.log(this.data);
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.getItems();
    this.getIcd10Categories();
    this.getIllnessTypes();
    this.getAgeGroups();
    this.getMohGhsGroupings();

    this.updateForm = this.fb.group({
      name: [null],
      icd10_category_id: [null],
      icd10_grouping_code: [null],
      disease_code: [null],
      icd10_code: [null],
      adult_gdrg: [null],
      adult_tariff: [null],
      child_gdrg: [null],
      child_tariff: [null],
      icd10_grouping_id: [null],
      moh_ghs_grouping_id: [null],
      moh_grouping_code: [null],
      illness_type_id: [null],
      age_group_id: [null],
      gender: [null]
    });
    this.createForm = this.fb.group({
      name: [null],
      icd10_category_id: [null],
      icd10_grouping_code: [null],
      disease_code: [null],
      icd10_code: [null],
      adult_gdrg: [null],
      adult_tariff: [null],
      child_gdrg: [null],
      child_tariff: [null],
      icd10_grouping_id: [null],
      moh_ghs_grouping_id: [null],
      moh_grouping_code: [null],
      illness_type_id: [null],
      age_group_id: [null],
      gender: [null]
    });
    this.createForm.get('icd10_category_id').valueChanges.subscribe(categoryId => {
      if (categoryId) {
        this.createForm.get('icd10_grouping_id').reset();
        this.getIcd10Groupings(categoryId);
      }
    });
    this.updateForm.get('icd10_category_id').valueChanges.subscribe(categoryId => {
      if (categoryId) {
        this.updateForm.get('icd10_grouping_id').reset();
        this.getIcd10Groupings(categoryId);
      }
    });
  }

  toggleItem($event: any, setupItem: any) {
    this.setup.toggleActive(`setups/diseases/${setupItem.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === setupItem.id);
        this.list[index].isActivated = !setupItem.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Please fill all required fields';
    } else {
      this.modalError = '';
      this.isUpdatingItem.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value,
        gender: this.updateForm.get('gender').value.join(',')
      }, `setups/diseases/${this.itemId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingItem.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getItems();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingItem.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteItem(setupItem: any) {
    this.setup.deleteSetup(`setups/diseases/${setupItem.id}`).pipe(first()).subscribe(
      res => {
        this.getItems();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.itemId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingItem.next(false);
  }
  showModal(setupItem: any) {
    this.isVisible = true;

    const { name,
      icd10_category_id,
      icd10_grouping_code,
      disease_code,
      icd10_code,
      adult_gdrg,
      adult_tariff,
      child_gdrg,
      child_tariff,
      icd10_grouping_id,
      moh_ghs_grouping_id,
      moh_grouping_code,
      illness_type_id,
      age_group_id,
      gender,
    } = setupItem;
    this.itemId = setupItem.id as number;
    console.log(this.itemId);
    this.updateForm.get('name').setValue(name);
    this.updateForm.get('icd10_category_id').setValue(icd10_category_id);
    this.updateForm.get('icd10_grouping_code').setValue(icd10_grouping_code);
    this.updateForm.get('disease_code').setValue(disease_code);
    this.updateForm.get('icd10_code').setValue(icd10_code);
    this.updateForm.get('adult_gdrg').setValue(adult_gdrg);
    this.updateForm.get('adult_tariff').setValue(adult_tariff);
    this.updateForm.get('child_gdrg').setValue(child_gdrg);
    this.updateForm.get('child_tariff').setValue(child_tariff);
    this.updateForm.get('icd10_grouping_id').setValue(icd10_grouping_id);
    this.updateForm.get('moh_ghs_grouping_id').setValue(moh_ghs_grouping_id);
    this.updateForm.get('moh_grouping_code').setValue(moh_grouping_code);
    this.updateForm.get('illness_type_id').setValue(illness_type_id);
    this.updateForm.get('age_group_id').setValue(age_group_id);
    this.updateForm.get('gender').setValue(gender.split(','));

  }



  getIcd10Groupings(icd10category_id) {
    this.icd10GroupingsLoading.next(true);
    this.setup.genericGet(`setups/icd10groupings?icd10_category_id=${icd10category_id}`).pipe(first()).subscribe(
      res => {
        this.icd10GroupingsLoading.next(false);
        this.icd10Groupings = res;
      },
      err => {
        this.icd10GroupingsLoading.next(false);
        console.log(err);
      }
    );
  }
  getIcd10Categories() {
    this.icd10CategoriesLoading.next(true);
    this.setup.genericGet('setups/icd10categories').pipe(first()).subscribe(
      res => {
        this.icd10CategoriesLoading.next(false);
        this.categories = res;
      },
      err => {
        this.icd10CategoriesLoading.next(false);
        console.log(err);
      }
    );
  }
  getMohGhsGroupings() {
    this.mohGhsGroupingsLoading.next(true);
    this.setup.genericGet('setups/mohghsgroupings').pipe(first()).subscribe(
      res => {
        this.mohGhsGroupingsLoading.next(false);
        this.mohGhsGroupings = res;
      },
      err => {
        this.mohGhsGroupingsLoading.next(false);
        console.log(err);
      }
    );
  }
  getIllnessTypes() {
    this.illnessTypesLoading.next(true);
    this.setup.genericGet('setups/illnesstypes').pipe(first()).subscribe(
      res => {
        this.illnessTypesLoading.next(false);
        this.illnessTypes = res;
      },
      err => {
        this.illnessTypesLoading.next(false);
        console.log(err);
      }
    );
  }
  getAgeGroups() {
    this.ageGroupsLoading.next(true);
    this.setup.genericGet('setups/agegroups').pipe(first()).subscribe(
      res => {
        this.ageGroupsLoading.next(false);
        this.ageGroups = res;
      },
      err => {
        this.ageGroupsLoading.next(false);
        console.log(err);
      }
    );
  }
}

