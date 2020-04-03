import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-icd10groupings',
  templateUrl: './icd10groupings.component.html',
  styleUrls: ['./icd10groupings.component.css']
})
export class Icd10groupingsComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  modalError = '';
  isVisible = false;
  isCreatingItem = new BehaviorSubject(false);
  isUpdatingItem = new BehaviorSubject(false);
  updateForm: FormGroup;
  itemId = null;
  data = [];
  list = [];
  error = '';
  setupItem = '';
  componentLabel = 'ICD 10 Grouping';

  submitForm(): void {
    if (this.setupItem == null || this.setupItem === '') {
      this.error = `Please enter ${this.componentLabel} name`;
    } else {
      this.error = '';
      this.isCreatingItem.next(true);
      this.setup
        .genericPost('setups/icd10groupings', { name: this.setupItem, status: 'ACTIVE' })
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingItem.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getItems();
              this.setupItem = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingItem.next(false);
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
  getItems() {
    this.setup
      .genericGet('setups/icd10groupings')
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
    this.getItems();
    this.updateForm = this.fb.group({
      name: [null, Validators.required]
    });
  }

  toggleItem($event: any, setupItem: any) {
    this.setup.toggleActive(`setups/icd10groupings/${setupItem.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === setupItem.id);
        this.list[index].isActivated = !setupItem.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Name is required';
    } else {
      this.modalError = '';
      this.isUpdatingItem.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/icd10groupings/${this.itemId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingItem.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getItems();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingItem.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteItem(setupItem: any) {
    this.setup.deleteSetup(`setups/icd10groupings/${setupItem.id}`).pipe(first()).subscribe(
      res => {
        this.getItems();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.itemId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingItem.next(false);
  }
  showModal(setupItem: any) {
    this.isVisible = true;
    const { name } = setupItem;
    this.itemId = setupItem.id as number;
    console.log(this.itemId);
    this.updateForm.get('name').setValue(name);

  }
}

