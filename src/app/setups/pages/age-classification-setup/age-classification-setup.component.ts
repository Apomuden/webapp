import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-age-classification-setup',
  templateUrl: './age-classification-setup.component.html',
  styleUrls: ['./age-classification-setup.component.css']
})
export class AgeClassificationSetupComponent implements OnInit, AfterViewInit, OnDestroy {
  initLoading = true;
  loadingMore = false;
  loadingClasses = false;
  isVisible = false;
  modalError = '';
  isUpdatingAgeClass = new BehaviorSubject(false);
  isCreatingAgeClass = new BehaviorSubject(false);
  ageClassifications = [];
  componentLabel = 'age classification';
  ageClassId: number;
  updateForm = this.fb.group({
    name: [null, Validators.required],
  });
  ageClassForm = this.fb.group({
    name: [null, Validators.required],
  });

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getAgeClassifications();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  submitForm(): void {
    if (!this.validateForm()) {
      this.notification.error(`Please fill the form correctly!`,
        `Check and make sure you've provided all fields and min age is not greater than max age`);
    } else {
      this.isCreatingAgeClass.next(true);
      this.setup
        .createAgeClassification(this.ageClassForm.value)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingAgeClass.next(false);
            if (success) {
              this.notification.success(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getAgeClassifications();
              this.ageClassForm.reset();
            } else {
              this.notification.error(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingAgeClass.next(false);
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
      this.isUpdatingAgeClass.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/ageclassifications/${this.ageClassId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingAgeClass.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.updateForm.reset();
            this.closeModal();
            this.getAgeClassifications();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingAgeClass.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }
  }

  showModal(ageCat: any) {
    this.isVisible = true;
    const { name } = ageCat;
    this.ageClassId = ageCat.id as number;
    this.updateForm.get('name').setValue(name);
  }

  closeModal() {
    this.ageClassId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingAgeClass.next(false);
  }


  deleteAgeCat(agecat: any) {
    this.setup.deleteSetup(`setups/ageclassifications/${agecat.id}`).pipe(first()).subscribe(
      res => {
        this.getAgeClassifications();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  validateForm() {
    return this.ageClassForm.valid;
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

  toggleItem($event: any, ageClass: any) {
    this.setup.toggleActive(`setups/ageclassifications/${ageClass.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.ageClassifications.findIndex(classification => classification.id === toggled.id);
        this.ageClassifications[index].isActivated = toggled.isActivated;
      }, error => {
        const index = this.ageClassifications.findIndex(classification => classification.id === ageClass.id);
        this.ageClassifications[index].isActivated = !ageClass.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
