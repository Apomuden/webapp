import { NzNotificationService } from 'ng-zorro-antd';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { SetupService } from 'src/app/shared/services/setup.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-allowed-installment-type-setup',
  templateUrl: './allowed-installment-type-setup.component.html',
  styleUrls: ['./allowed-installment-type-setup.component.css']
})
export class AllowedInstallmentTypeSetupComponent implements OnInit {
  facility: any;
  updateFacilityDetailsForm: FormGroup;
  isUpdatingFacility = new BehaviorSubject(false);


  constructor(private fb: FormBuilder, private setup: SetupService, private notification: NzNotificationService) { }

  ngOnInit() {
    this.updateFacilityDetailsForm = this.fb.group({
      allowed_installment_type: [null, Validators.required]
    });
    this.getFacilityDetails();
  }

  getFacilityDetails() {
    this.setup.getFacilities().pipe(first()).subscribe(
      res => {
        if (res) {
          this.facility = res.data;
          console.log(this.facility);
          this.updateFacilityDetailsForm.get('allowed_installment_type').setValue(this.facility.allowed_installment_type.split(','));
        }
      }
    );
  }


  submitForm() {

    if (this.updateFacilityDetailsForm.valid) {
      const payload = {
        ...this.updateFacilityDetailsForm.value,
        allowed_installment_type: this.updateFacilityDetailsForm.get('allowed_installment_type').value.join()
      };
      console.log(payload);
      this.isUpdatingFacility.next(true);
      this.setup.updateFacility(payload).pipe(first()).subscribe(
        res => {
          if (res) {
            this.notification.success('Success', 'Updated');
            this.getFacilityDetails();
            this.isUpdatingFacility.next(false);
          } else {
            this.notification.error('Error', 'Could not update');
            this.isUpdatingFacility.next(false);
          }
        },
        err => {
          this.notification.error('Error', 'Could not update');
          this.isUpdatingFacility.next(false);
        }
      );
    } else {
      this.notification.error('Error', 'You need to select at-least one installment type');
    }

  }
}
