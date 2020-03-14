import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-speciality-setup',
  templateUrl: './speciality-setup.component.html',
  styleUrls: ['./speciality-setup.component.css']
})
export class SpecialitySetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingSpecialty = new BehaviorSubject(false);
  isUpdatingSpecialty = new BehaviorSubject(false);
  specialtyId = null;
  data = [];
  list = [];
  error = '';
  modalError = '';
  isVisible = false;
  specialty = '';
  componentLabel = 'specialty';
  updateForm: FormGroup;

  submitForm(): void {
    if (this.specialty == null || this.specialty === '') {
      this.error = `Please enter ${this.componentLabel} name`;
    } else {
      this.error = '';
      this.isCreatingSpecialty.next(true);
      this.setup
        .createSpeciality(this.specialty)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingSpecialty.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getSpecialties();
              this.specialty = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingSpecialty.next(false);
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
  getSpecialties() {
    this.setup
      .getSpecialities()
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
    this.getSpecialties();
  }

  toggleItem($event: any, speciality: any) {
    this.setup.toggleActive(`setups/specialties/${speciality.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === speciality.id);
        this.list[index].isActivated = !speciality.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }

  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Please fill required fields';
    } else {
      this.modalError = '';
      this.isUpdatingSpecialty.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/specialties/${this.specialtyId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingSpecialty.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getSpecialties();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingSpecialty.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteSpecialty(specialty: any) {
    this.setup.deleteSetup(`setups/specialties/${specialty.id}`).pipe(first()).subscribe(
      res => {
        this.getSpecialties();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.specialtyId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingSpecialty.next(false);
  }
  showModal(specialty: any) {
    this.isVisible = true;
    const {
      name,
      service_category_id,
    } = specialty;
    this.specialtyId = specialty.id as number;
    console.log(this.specialtyId);
    this.updateForm.get('name').setValue(name);

  }
}


