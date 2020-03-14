import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-sponsership-type-setup',
  templateUrl: './sponsership-type-setup.component.html',
  styleUrls: ['./sponsership-type-setup.component.css']
})
export class SponsershipTypeSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  sponsorshipTypeId = null;
  isCreatingSponsorshipType = new BehaviorSubject(false);
  isUpdatingSponsorshipType = new BehaviorSubject(false);
  data = [];
  list = [];
  updateForm: FormGroup;
  isVisible = false;
  error = '';
  sponsorshipType = '';
  modalError = '';

  submitForm(): void {
    if (this.sponsorshipType == null || this.sponsorshipType === '') {
      this.error = 'Please enter sponsorship type name';
    } else {
      this.error = '';
      this.isCreatingSponsorshipType.next(true);
      this.setup
        .createSponsorshipType(this.sponsorshipType)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingSponsorshipType.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                'Successfully created sponsorship type'
              );
              this.getSponsorshipTypes();
              this.sponsorshipType = '';
            } else {
              this.notification.blank(
                'Error',
                'Could not create sponsorship type'
              );
            }
          },
          error => {
            this.isCreatingSponsorshipType.next(false);
            this.notification.blank(
              'Error',
              'Could not create sponsorship type'
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
  getSponsorshipTypes() {
    this.setup
      .getSponsorshipTypes()
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
    this.getSponsorshipTypes();
  }

  toggleItem($event: any, type: any) {
    this.setup.toggleActive(`setups/sponsorshiptypes/${type.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === type.id);
        this.list[index].isActivated = !type.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Please fill required fields';
    } else {
      this.modalError = '';
      this.isUpdatingSponsorshipType.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/sponsorshiptypes/${this.sponsorshipTypeId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingSponsorshipType.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getSponsorshipTypes();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingSponsorshipType.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteSponsorshipType(specialty: any) {
    this.setup.deleteSetup(`setups/sponsorshiptypes/${specialty.id}`).pipe(first()).subscribe(
      res => {
        this.getSponsorshipTypes();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.sponsorshipTypeId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingSponsorshipType.next(false);
  }
  showModal(specialty: any) {
    this.isVisible = true;
    const {
      name
    } = specialty;
    this.sponsorshipTypeId = specialty.id as number;
    console.log(this.sponsorshipTypeId);
    this.updateForm.get('name').setValue(name);

  }
}



