import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-religion-setup',
  templateUrl: './religion-setup.component.html',
  styleUrls: ['./religion-setup.component.css']
})
export class ReligionSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  modalError = '';
  isVisible = false;
  isCreatingReligion = new BehaviorSubject(false);
  isUpdatingReligion = new BehaviorSubject(false);
  updateForm: FormGroup;
  religionId = null;
  data = [];
  list = [];
  error = '';
  religion = '';
  componentLabel = 'religion';

  submitForm(): void {
    if (this.religion == null || this.religion === '') {
      this.error = `Please enter ${this.componentLabel} name`;
    } else {
      this.error = '';
      this.isCreatingReligion.next(true);
      this.setup
        .createReligion(this.religion)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingReligion.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getReligions();
              this.religion = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingReligion.next(false);
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
  getReligions() {
    this.setup
      .getReligions()
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
    this.getReligions();
    this.updateForm = this.fb.group({
      name: [null, Validators.required]
    })
  }

  toggleItem($event: any, religion: any) {
    this.setup.toggleActive(`setups/religions/${religion.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === religion.id);
        this.list[index].isActivated = !religion.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Name is required';
    } else {
      this.modalError = '';
      this.isUpdatingReligion.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/religions/${this.religionId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingReligion.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getReligions();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingReligion.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteReligion(idtype: any) {
    this.setup.deleteSetup(`setups/religions/${idtype.id}`).pipe(first()).subscribe(
      res => {
        this.getReligions();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.religionId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingReligion.next(false);
  }
  showModal(religion: any) {
    this.isVisible = true;
    const { name } = religion;
    this.religionId = religion.id as number;
    console.log(this.religionId);
    this.updateForm.get('name').setValue(name);

  }
}

