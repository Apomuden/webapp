import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-nhis-provider-levels-setup',
  templateUrl: './nhis-provider-levels-setup.component.html',
  styleUrls: ['./nhis-provider-levels-setup.component.css']
})
export class NhisProviderLevelsSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingNHISProviderLvl = new BehaviorSubject(false);
  isUpdating = new BehaviorSubject(false);
  data = [];
  list = [];
  isVisible = false;
  nhisProviderLevelId = null;
  updateForm: FormGroup;
  modalError = '';
  error = '';
  nhisProviderLevel = '';
  componentLabel = 'NHIS provider level';

  submitForm(): void {
    if (this.nhisProviderLevel == null || this.nhisProviderLevel === '') {
      this.error = `Please enter name`;
    } else {

      this.error = '';
      this.isCreatingNHISProviderLvl.next(true);
      this.setup
        .genericPost('setups/nhisproviderlevels', { name: this.nhisProviderLevel })
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingNHISProviderLvl.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getNHISProviderLevels();
              this.nhisProviderLevel = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingNHISProviderLvl.next(false);
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
  getNHISProviderLevels() {
    this.setup
      .genericGet('setups/nhisproviderlevels')
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
    this.updateForm = this.fb.group({
      name: [null, Validators.required]
    });
    this.getNHISProviderLevels();
  }

  toggleItem($event: any, nhisProviderLevel: any) {
    this.setup.toggleActive(`setups/nhisproviderlevels/${nhisProviderLevel.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(l => l.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(l => l.id === nhisProviderLevel.id);
        this.list[index].isActivated = !nhisProviderLevel.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Name is required';
    } else {
      this.modalError = '';
      this.isUpdating.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/nhisproviderlevels/${this.nhisProviderLevelId}`).pipe(first()).subscribe(
        response => {
          this.isUpdating.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getNHISProviderLevels();
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

  deleteItem(nhisProviderLevel: any) {
    this.setup.deleteSetup(`setups/nhisproviderlevels/${nhisProviderLevel.id}`).pipe(first()).subscribe(
      res => {
        this.getNHISProviderLevels();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.nhisProviderLevelId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdating.next(false);
  }
  showModal(nhisProviderLevel: any) {
    this.isVisible = true;
    const { name } = nhisProviderLevel;
    this.nhisProviderLevelId = nhisProviderLevel.id as number;
    console.log(this.nhisProviderLevelId);
    this.updateForm.get('name').setValue(name);
  }
}
