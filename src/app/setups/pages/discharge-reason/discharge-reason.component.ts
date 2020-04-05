import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-discharge-reason',
  templateUrl: './discharge-reason.component.html',
  styleUrls: ['./discharge-reason.component.css']
})
export class DischargeReasonComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingSetup = new BehaviorSubject(false);
  isUpdating = new BehaviorSubject(false);
  data = [];
  list = [];
  isVisible = false;
  updateForm: FormGroup;
  modalError = '';
  error = '';
  dischargeReason = '';
  seletedSetupId = null;
  componentLabel = 'discharge reason';

  submitForm(): void {
    if (this.dischargeReason == null || this.dischargeReason === '') {
      this.error = `Please enter ${this.componentLabel} name`;
    } else {
      this.error = '';
      this.isCreatingSetup.next(true);
      this.setup
        .genericPost('setups/dischargereasons', { name: this.dischargeReason, status: 'ACTIVE' })
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingSetup.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getList();
              this.dischargeReason = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingSetup.next(false);
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
  getList() {
    this.setup
      .genericGet('setups/dischargereasons')
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
    this.getList();
  }

  toggleItem($event: any, item: any) {
    this.setup.toggleActive(`setups/dischargereasons/${item.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(l => l.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(l => l.id === item.id);
        this.list[index].isActivated = !item.isActivated;
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
      }, `setups/dischargereasons/${this.seletedSetupId}`).pipe(first()).subscribe(
        response => {
          this.isUpdating.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getList();
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

  deleteSetup(item: any) {
    this.setup.deleteSetup(`setups/dischargereasons/${item.id}`).pipe(first()).subscribe(
      res => {
        this.getList();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.seletedSetupId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdating.next(false);
  }
  showModal(item: any) {
    this.isVisible = true;
    const { name } = item;
    this.seletedSetupId = item.id as number;
    console.log(this.seletedSetupId);
    this.updateForm.get('name').setValue(name);
  }
}
