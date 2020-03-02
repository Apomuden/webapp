import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-district-setup',
  templateUrl: './district-setup.component.html',
  styleUrls: ['./district-setup.component.css']
})
export class DistrictSetupComponent implements OnInit, AfterViewInit {
  initLoading = true; // bug
  loadingMore = false;
  updateForm: FormGroup;
  modalError = '';
  countrySub = null;
  isCreatingDistrict = new BehaviorSubject(false);
  regionsLoading = new BehaviorSubject(false);
  regionsForModalLoading = new BehaviorSubject(false);
  countriesLoading = new BehaviorSubject(false);
  countriesForModalLoading = new BehaviorSubject(false);
  isUpdatingDistrict = new BehaviorSubject(false);

  data = [];
  list = [];
  error = '';
  name = '';

  region = null;
  country = null;
  isVisible = false;

  regionsForModal = null;
  regions = null;
  countries = null;
  districtId = null;

  componentLabel = 'district';

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.region == null ||
      this.region === ''
    ) {
      this.error = 'All Fields are required!';
    } else {
      this.error = '';
      this.isCreatingDistrict.next(true);
      this.setup
        .createDistrict(this.name, this.region)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingDistrict.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getDistricts();
              this.name = '';
              this.country = null;
              this.region = null;
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingDistrict.next(false);
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

  getDistricts() {
    this.setup
      .getDistricts()
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

  getRegionsByCountryId(countryId: string) {
    this.regionsLoading.next(true);
    this.setup
      .getRegionsByCountryId(countryId)
      .pipe(first())
      .subscribe(
        data => {
          this.regionsLoading.next(false);
          this.regions = data.data;
          this.region = null;
          console.log('regions by country id', this.regions);
        },
        error => {
          this.regionsLoading.next(false);
          console.log(error);
        }
      );
  }
  getRegionsByCountryIdForModal(countryId: string, isInitialId: Boolean = false) {
    this.regionsForModalLoading.next(true);
    this.setup
      .getRegionsByCountryId(countryId)
      .pipe(first())
      .subscribe(
        data => {
          this.regionsForModalLoading.next(false);
          this.regionsForModal = data.data;
          if (!isInitialId) {
            this.updateForm.get('region_id').reset();
          }

        },
        error => {
          this.regionsForModalLoading.next(false);
          console.log(error);
        }
      );
  }

  getCountries() {
    this.countriesLoading.next(true);
    this.setup
      .getCountries()
      .pipe(first())
      .subscribe(
        data => {
          this.countriesLoading.next(false);
          this.countries = data.data;
          this.region = null;
          console.log('countries', this.countries);
        },
        error => {
          this.countriesLoading.next(false);
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.updateForm = this.fb.group({
      name: [null, Validators.required],
      region_id: [null, Validators.required],
      country_id: [null, Validators.required]
    });
    this.getDistricts();
    this.getCountries();
  }

  ngAfterViewInit() {

  }

  toggleItem($event: any, district: any) {
    this.setup.toggleActive(`setups/districts/${district.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(d => d.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(d => d.id === district.id);
        this.list[index].isActivated = !district.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }

  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'All fields are required';
    } else {
      this.modalError = '';
      this.isUpdatingDistrict.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/districts/${this.districtId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingDistrict.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getDistricts();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingDistrict.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }
  }
  deleteDistrict(district: any) {
    this.setup.deleteSetup(`setups/districts/${district.id}`).pipe(first()).subscribe(
      res => {
        this.getDistricts();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.districtId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingDistrict.next(false);
    this.countrySub.unsubscribe();
  }
  showModal(district: any) {
    this.isVisible = true;
    const { name, region_id, country_id } = district;
    this.districtId = district.id as number;
    this.updateForm.get('name').setValue(name);
    this.updateForm.get('country_id').setValue(country_id);

    this.countrySub = this.updateForm.get('country_id').valueChanges.subscribe(val => {
      if (val) {
        this.getRegionsByCountryIdForModal(val);
      }
    });
    this.getRegionsByCountryIdForModal(country_id, true);
    this.updateForm.get('region_id').setValue(region_id);

  }
}
