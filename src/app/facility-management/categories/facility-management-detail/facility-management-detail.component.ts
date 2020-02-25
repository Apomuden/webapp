import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadFile, NzNotificationService } from 'ng-zorro-antd';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SetupService } from 'src/app/shared/services/setup.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-facility-management-detail',
  templateUrl: './facility-management-detail.component.html',
  styleUrls: ['./facility-management-detail.component.css']
})
export class FacilityManagementDetailComponent implements OnInit, AfterViewInit {
  facility: any;
  logo: String;
  updateFacilityDetailsForm: FormGroup;
  isLoadingCountries = new BehaviorSubject(false);
  isLoadingRegions = new BehaviorSubject(false);
  isUpdatingFacility = new BehaviorSubject(false);
  regions = [];
  countries = [];
  regionFirstTime = true;


  constructor(private fb: FormBuilder, private setup: SetupService, private notification: NzNotificationService) { }
  // "id": 1,
  //       "name": "Apomuden Dev. Hospital",
  //       "staff_id_prefix": "ADH",
  //       "staff_id_seperator": "/",
  //       "folder_id_prefix": "A",
  //       "folder_id_seperator": "/",
  //       "digits_after_staff_prefix": 4,
  //       "digits_after_folder_prefix": 7,
  //       "year_digits": 7,
  //       "allowed_folder_type": "INDIVIDUAL,FAMILY",
  //       "allowed_installment_type": "INDIVIDUAL,FAMILY",
  //       "active_cell": null,
  //       "alternate_cell": null,
  //       "email1": "oconnell.alverta@example.net",
  //       "email2": null,
  //       "postal_address": null,
  //       "physical_address": null,
  //       "country_name": "Ghana",
  //       "country_id": 83,
  //       "region_name": "Ashanti",
  //       "region_id": 1793,
  //       "gps_location": null,
  //       "ownership_type": "PRIVATE",
  //       "logo": null,
  //       "created_at": "2019-12-19 19:09:19",
  //       "updated_at": "2020-01-02 14:46:20"
  ngOnInit() {
    this.updateFacilityDetailsForm = this.fb.group({
      name: [null, Validators.required],
      active_cell: [null, Validators.required],
      alternate_cell: [null],
      email1: [null],
      email2: [null],
      postal_address: [null],
      physical_address: [null],
      country_id: [null],
      region_id: [null],
      gps_location: [null],
      ownership_type: [null]
    });
    this.getFacilityDetails();
    this.getCountries();

  }

  ngAfterViewInit() {
    this.updateFacilityDetailsForm.get('country_id').valueChanges.subscribe(
      val => {
        console.log(val);
        this.getRegionsByCountryId(val);
        if (this.regionFirstTime) {
          this.regionFirstTime = false;
        } else {
          this.updateFacilityDetailsForm.get('region_id').reset();
        }

      }
    );
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result.toString()));
    reader.readAsDataURL(img);
  }
  getFacilityDetails() {
    this.setup.getFacilities().pipe(first()).subscribe(
      res => {
        if (res) {
          this.facility = res.data;
          console.log(this.facility.logo);
          this.logo = this.facility.logo;
          this.updateFacilityDetailsForm.get('name').setValue(this.facility.name);
          this.updateFacilityDetailsForm.get('active_cell').setValue(this.facility.active_cell);
          this.updateFacilityDetailsForm.get('alternate_cell').setValue(this.facility.alternate_cell);
          this.updateFacilityDetailsForm.get('email1').setValue(this.facility.email1);
          this.updateFacilityDetailsForm.get('email2').setValue(this.facility.email2);
          this.updateFacilityDetailsForm.get('postal_address').setValue(this.facility.postal_address);
          this.updateFacilityDetailsForm.get('physical_address').setValue(this.facility.physical_address);
          this.updateFacilityDetailsForm.get('country_id').setValue(this.facility.country_id);
          this.updateFacilityDetailsForm.get('region_id').setValue(this.facility.region_id);
          this.updateFacilityDetailsForm.get('gps_location').setValue(this.facility.gps_location);
          this.updateFacilityDetailsForm.get('ownership_type').setValue(this.facility.ownership_type);
        }
      }
    );
  }

  getCountries() {
    this.isLoadingCountries.next(true);
    this.setup.getCountries().pipe(first()).subscribe(
      res => {
        this.isLoadingCountries.next(false);
        this.countries = res.data;
      },
      err => {
        this.isLoadingCountries.next(false);
        console.error(err);
      }
    );
  }

  getRegionsByCountryId(countryId: string) {
    this.isLoadingRegions.next(true);
    this.setup.getRegionsByCountryId(countryId).pipe(first()).subscribe(
      res => {
        if (res) {
          this.regions = res.data;
          this.isLoadingRegions.next(false);
        }
      },
      err => {
        this.isLoadingRegions.next(false);
      }
    );
  }


  handleUpload = (item: any) => {

    console.log('uploading image...');
    console.log(item);

    this.toBase64(item.file).then(result => {
      console.log(result);
      this.setup.updateFacility({ logo: result }).pipe(first()).subscribe(
        res => {
          if (res) {
            this.notification.success('Success', 'Logo updated');
            this.getFacilityDetails();
          } else {
            this.notification.error('Error', 'Could not update logo');
          }
        }
      );
    });

  }
  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })

  submitForm() {
    if (this.updateFacilityDetailsForm.valid) {
      this.isUpdatingFacility.next(true);
      this.setup.updateFacility(this.updateFacilityDetailsForm.value).pipe(first()).subscribe(
        res => {
          if (res) {
            this.notification.success('Success', 'Facility updated');
            this.getFacilityDetails();
            this.isUpdatingFacility.next(false);
          } else {
            this.notification.error('Error', 'Could not update facility');
            this.isUpdatingFacility.next(false);
          }
        },
        err => {
          this.notification.error('Error', 'Could not update facility');
          this.isUpdatingFacility.next(false);
        }
      );
    } else {
      this.notification.error('Error', 'Name and Active cell are required');
    }

  }
}
