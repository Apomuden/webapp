import { first } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SetupService } from 'src/app/shared/services/setup.service';

@Component({
  selector: 'app-facility-management-numbering-setting',
  templateUrl: './facility-management-numbering-setting.component.html',
  styleUrls: ['./facility-management-numbering-setting.component.css']
})
export class FacilityManagementNumberingSettingComponent implements OnInit {
  facility: any;
  updateFacilityDetailsForm: FormGroup;
  isUpdatingFacility = new BehaviorSubject(false);


  constructor(private fb: FormBuilder, private setup: SetupService, private notification: NzNotificationService) { }

  ngOnInit() {
    this.updateFacilityDetailsForm = this.fb.group({
      staff_id_prefix: [null, Validators.required],
      staff_id_seperator: [null, Validators.required],
      folder_id_prefix: [null, Validators.required],
      folder_id_seperator: [null, Validators.required],
      digits_after_staff_prefix: [null, Validators.required],
      digits_after_folder_prefix: [null, Validators.required],
      year_digits: [null, [Validators.required, Validators.min(2), Validators.max(4)]],
      allowed_folder_type: [null, Validators.required]
    });
    this.getFacilityDetails();
  }

  getFacilityDetails() {
    this.setup.getFacilities().pipe(first()).subscribe(
      res => {
        if (res) {
          this.facility = res.data;
          console.log(this.facility);
          this.updateFacilityDetailsForm.get('staff_id_prefix').setValue(this.facility.staff_id_prefix);
          this.updateFacilityDetailsForm.get('staff_id_seperator').setValue(this.facility.staff_id_seperator);
          this.updateFacilityDetailsForm.get('folder_id_prefix').setValue(this.facility.folder_id_prefix);
          this.updateFacilityDetailsForm.get('folder_id_seperator').setValue(this.facility.folder_id_seperator);
          this.updateFacilityDetailsForm.get('digits_after_staff_prefix').setValue(this.facility.digits_after_staff_prefix);
          this.updateFacilityDetailsForm.get('digits_after_folder_prefix').setValue(this.facility.digits_after_folder_prefix);
          this.updateFacilityDetailsForm.get('year_digits').setValue(this.facility.year_digits);
          this.updateFacilityDetailsForm.get('allowed_folder_type').setValue(this.facility.allowed_folder_type.split(','));
        }
      }
    );
  }


  submitForm() {

    if (this.updateFacilityDetailsForm.valid) {
      const payload = {
        ...this.updateFacilityDetailsForm.value,
        allowed_folder_type: this.updateFacilityDetailsForm.get('allowed_folder_type').value.join()
      };
      console.log(payload);
      this.isUpdatingFacility.next(true);
      this.setup.updateFacility(payload).pipe(first()).subscribe(
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
      this.notification.error('Error', 'All fields are required. Year digits should be between 2 and 4');
    }

  }
}
