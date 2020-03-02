import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-education-level-setup',
  templateUrl: './education-level-setup.component.html',
  styleUrls: ['./education-level-setup.component.css']
})
export class EducationLevelSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingEducationalLevel = new BehaviorSubject(false);
  data = [];
  list = [];
  educationLevelId = null;
  error = '';
  updateForm: FormGroup;
  educationLevel = null;
  modalError = '';
  isVisible = false;
  isUpdatingEducationLevel = new BehaviorSubject(false);
  educationalLevel = '';
  componentLabel = 'educational level';

  submitForm(): void {
    if (this.educationalLevel == null || this.educationalLevel === '') {
      this.error = `Please enter ${this.componentLabel} name`;
    } else {
      this.error = '';
      this.isCreatingEducationalLevel.next(true);
      this.setup
        .createEducationalLevel(this.educationalLevel)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingEducationalLevel.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getEducationalLevels();
              this.educationalLevel = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingEducationalLevel.next(false);
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
  getEducationalLevels() {
    this.setup
      .getEducationalLevels()
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
    this.getEducationalLevels();
  }

  toggleItem($event: any, level: any) {
    this.setup.toggleActive(`setups/educationallevels/${level.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(e => e.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(e => e.id === level.id);
        this.list[index].isActivated = !level.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Name is required';
    } else {
      this.modalError = '';
      this.isUpdatingEducationLevel.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/educationallevels/${this.educationLevelId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingEducationLevel.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getEducationalLevels();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingEducationLevel.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteEducationLevel(educationLevel: any) {
    this.setup.deleteSetup(`setups/educationallevels/${educationLevel.id}`).pipe(first()).subscribe(
      res => {
        this.getEducationalLevels();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.educationLevelId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingEducationLevel.next(false);
  }
  showModal(educationLevel: any) {
    this.isVisible = true;
    const { name } = educationLevel;
    this.educationLevelId = educationLevel.id as number;
    console.log(this.educationLevelId);
    this.updateForm.get('name').setValue(name);
  }

}
