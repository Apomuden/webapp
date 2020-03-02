import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-hospital-service-setup',
  templateUrl: './hospital-service-setup.component.html',
  styleUrls: ['./hospital-service-setup.component.css']
})
export class HospitalServiceSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  modalError = '';
  updateForm: FormGroup;
  isVisible = false;
  isCreatingHospitalService = new BehaviorSubject(false);
  isUpdatingHospitalService = new BehaviorSubject(false);
  data = [];
  hospitalServiceId = null;
  list = [];
  error = '';
  hospitalService = '';
  componentLabel = 'hospital service';

  submitForm(): void {
    if (this.hospitalService == null || this.hospitalService === '') {
      this.error = `Please enter ${this.componentLabel} name`;
    } else {
      this.error = '';
      this.isCreatingHospitalService.next(true);
      this.setup
        .createHospitalService(this.hospitalService)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingHospitalService.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getHospitalServices();
              this.hospitalService = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingHospitalService.next(false);
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
  getHospitalServices() {
    this.setup
      .getHospitalServices()
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
  ngOnInit() {
    this.updateForm = this.fb.group({
      name: [null, Validators.required]
    });
    this.getHospitalServices();
  }

  toggleItem($event: any, service: any) {
    this.setup.toggleActive(`setups/hospitalservices/${service.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(s => s.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(s => s.id === service.id);
        this.list[index].isActivated = !service.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }

  deleteHospitalService(hospitalService: any) {
    this.setup.deleteSetup(`setups/hospitalservices/${hospitalService.id}`).pipe(first()).subscribe(
      res => {
        this.getHospitalServices();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.hospitalServiceId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingHospitalService.next(false);
  }
  showModal(hospitalService: any) {
    this.isVisible = true;
    const { name } = hospitalService;
    this.hospitalServiceId = hospitalService.id as number;
    console.log(this.hospitalServiceId);
    this.updateForm.get('name').setValue(name);
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Name is required';
    } else {
      this.modalError = '';
      this.isUpdatingHospitalService.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/hospitalservices/${this.hospitalServiceId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingHospitalService.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getHospitalServices();
          } else {
            this.notification.error('Error', 'Update failed');
          }
        },
        error => {
          this.isUpdatingHospitalService.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }
  }
}
