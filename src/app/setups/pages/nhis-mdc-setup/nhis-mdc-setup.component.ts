import { NzNotificationService } from 'ng-zorro-antd';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SetupService } from 'src/app/shared/services/setup.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-nhis-mdc-setup',
  templateUrl: './nhis-mdc-setup.component.html',
  styleUrls: ['./nhis-mdc-setup.component.css']
})
export class NhisMdcSetupComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private setup: SetupService, private notification: NzNotificationService) { }
  initLoading = true;
  loadingMore = false;
  nhisMdcForm: FormGroup;
  updateForm: FormGroup;
  error = '';
  data = [];
  list = [];
  services = [];
  ageGroups = [];
  fundingTypes = [];
  isVisible = false;
  modalError = null;
  nhisMdcId = null;

  isHospitalServicesLoading = new BehaviorSubject(false);
  isAgeGroupsLoading = new BehaviorSubject(false);
  isCreatingNhisMdc = new BehaviorSubject(false);
  isUpdating = new BehaviorSubject(false);


  ngOnInit() {
    this.nhisMdcForm = this.fb.group({
      description: [null, Validators.required],
      mdc_code: [null, Validators.required],
      hospital_service_id: [null, Validators.required],
      age_group_id: [null, Validators.required],
      patient_status: [null, Validators.required],
      gender: [null, Validators.required]
    });

    this.updateForm = this.fb.group({
      description: [null, Validators.required],
      mdc_code: [null, Validators.required],
      hospital_service_id: [null, Validators.required],
      age_group_id: [null, Validators.required],
      patient_status: [null, Validators.required],
      gender: [null, Validators.required]
    });

    this.getAgeGroups();
    this.getHospitalServices();
    this.getNhisMDCs();

  }

  ngOnDestroy() { }

  getAgeGroups() {
    this.isAgeGroupsLoading.next(true);
    this.setup.getAgeGroups()
      .pipe(first())
      .subscribe(
        data => {
          this.isAgeGroupsLoading.next(false);
          this.ageGroups = data.data;
        }, error => {
          this.isAgeGroupsLoading.next(false);
          console.log(error);
        }
      );
  }

  getNhisMDCs() {
    this.setup
      .genericGet('setups/majordiagnosticcategories')
      .pipe(first())
      .subscribe(
        data => {
          this.data = data;
          this.list = data;
          this.initLoading = false;

        },
        error => {
          this.initLoading = false;
          console.log(error);
        }
      );
  }


  getHospitalServices() {
    this.isHospitalServicesLoading.next(true);
    this.setup.getHospitalServices().pipe(first()).subscribe(
      res => {
        this.services = res.data;
        this.isHospitalServicesLoading.next(false);
      },
      error => {
        console.log(error);
        this.isHospitalServicesLoading.next(false);
      }
    );
  }

  createNhisMDC(fields: object) {
    this.isCreatingNhisMdc.next(true);
    if (this.nhisMdcForm.valid) {
      this.setup.genericPost('setups/majordiagnosticcategories', { ...fields, status: 'ACTIVE' }).pipe(first()).subscribe(
        res => {
          this.isCreatingNhisMdc.next(false);
          if (res) {
            this.nhisMdcForm.reset();
            this.notification.blank(
              'Success',
              `Successfully created NHIS MDC`
            );

            this.getNhisMDCs();

          } else {
            this.notification.blank(
              'Error',
              `Could not create NHIS MDC`
            );

          }
        }, error => {
          this.isCreatingNhisMdc.next(false);
          console.log(error);

          this.notification.blank(
            'Error',
            `Could not create NHIS MDC`
          );
        }
      );
    } else {
      this.error = 'Please fill required fields';
    }

  }

  submitForm() {
    const tempPatientStatus = this.nhisMdcForm.controls['patient_status'].value;
    const tempGender = this.nhisMdcForm.controls['gender'].value;
    const fields = this.nhisMdcForm.value;

    if (tempPatientStatus instanceof Array) {
      fields.patient_status = tempPatientStatus.join(',');
    }
    if (tempGender instanceof Array) {
      fields.gender = tempGender.join(',');
    }
    console.log(fields);
    this.createNhisMDC(fields);
  }

  toggleItem($event: any, nhisMDC: any) {
    this.setup.toggleActive(`setups/majordiagnosticcategories/${nhisMDC.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === nhisMDC.id);
        this.list[index].isActivated = !nhisMDC.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }

  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Please fill required fields';
    } else {
      this.modalError = '';
      this.isUpdating.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value,
        patient_status: this.updateForm.get('patient_status').value.join(','),
        gender: this.updateForm.get('gender').value.join(',')
      }, `setups/majordiagnosticcategories/${this.nhisMdcId}`).pipe(first()).subscribe(
        response => {
          this.isUpdating.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getNhisMDCs();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdating.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }
  deleteItem(nhisMDC: any) {
    this.setup.deleteSetup(`setups/majordiagnosticcategories/${nhisMDC.id}`).pipe(first()).subscribe(
      res => {
        this.getNhisMDCs();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.nhisMdcId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdating.next(false);
  }


  showModal(nhisMDC: any) {
    this.isVisible = true;
    const {
      description,
      desciption,
      mdc_code,
      hospital_service_id,
      age_group_id,
      patient_status,
      gender
    } = nhisMDC;
    this.nhisMdcId = nhisMDC.id as number;
    console.log(this.nhisMdcId);
    this.updateForm.get('description').setValue(description ? description : desciption);
    this.updateForm.get('mdc_code').setValue(mdc_code);
    this.updateForm.get('hospital_service_id').setValue(hospital_service_id);
    this.updateForm.get('age_group_id').setValue(age_group_id);
    this.updateForm.get('gender').setValue(gender.split(','));
    this.updateForm.get('patient_status').setValue(patient_status.split(','));
  }
}
