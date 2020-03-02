import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-id-type-setup',
  templateUrl: './id-type-setup.component.html',
  styleUrls: ['./id-type-setup.component.css']
})
export class IdTypeSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingIdType = new BehaviorSubject(false);
  isUpdatingIdType = new BehaviorSubject(false);
  isVisible = false;
  idTypeId = null;
  data = [];
  list = [];
  error = '';
  modalError = '';
  idType = '';
  componentLabel = 'id type';
  updateForm: FormGroup;

  submitForm(): void {
    if (this.idType == null || this.idType === '') {
      this.error = `Please enter ${this.componentLabel} name`;
    } else {
      this.error = '';
      this.isCreatingIdType.next(true);
      this.setup
        .createIdType(this.idType)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingIdType.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getIdTypes();
              this.idType = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingIdType.next(false);
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
  getIdTypes() {
    this.setup
      .getIdTypes()
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
    this.getIdTypes();
  }

  toggleItem($event: any, type: any) {
    this.setup.toggleActive(`setups/idtypes/${type.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(t => t.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(t => t.id === type.id);
        this.list[index].isActivated = !type.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }

  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Name is required';
    } else {
      this.modalError = '';
      this.isUpdatingIdType.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/idtypes/${this.idTypeId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingIdType.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getIdTypes();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingIdType.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteIdType(idtype: any) {
    this.setup.deleteSetup(`setups/idtypes/${idtype.id}`).pipe(first()).subscribe(
      res => {
        this.getIdTypes();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.idTypeId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingIdType.next(false);
  }
  showModal(idtype: any) {
    this.isVisible = true;
    const { name } = idtype;
    this.idTypeId = idtype.id as number;
    console.log(this.idTypeId);
    this.updateForm.get('name').setValue(name);

  }
}
