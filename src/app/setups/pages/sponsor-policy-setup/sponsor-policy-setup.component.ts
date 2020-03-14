import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { first, retry } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SetupService } from 'src/app/shared/services/setup.service';

@Component({
  selector: 'app-sponsor-policy-setup',
  templateUrl: './sponsor-policy-setup.component.html',
  styleUrls: ['./sponsor-policy-setup.component.css']
})
export class SponsorPolicySetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingSponsorPolicy = new BehaviorSubject(false);
  isLoadingMedicalSponsors = new BehaviorSubject(false);
  isUpdatingSponsorPolicies = new BehaviorSubject(false);
  data = [];
  list = [];
  error = '';
  modalError = '';
  sponsorPolicy = '';
  medicalSponsor = null;
  sponsorPolicyId = null;
  isVisible = false;
  medicalSponsors = [];
  componentLabel = 'sponsor policy';
  updateForm: FormGroup;

  submitForm(): void {
    if (this.sponsorPolicy == null || this.sponsorPolicy === '') {
      this.error = `Please enter ${this.componentLabel} name`;
    } else if (this.medicalSponsor == null || this.medicalSponsor === '') {
      this.error = 'Please select medical sponsor';
    } else {
      this.error = '';
      this.isCreatingSponsorPolicy.next(true);
      this.setup.createSponsorPolicy(this.sponsorPolicy, this.medicalSponsor).pipe(first())
        .subscribe(
          success => {
            this.isCreatingSponsorPolicy.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getSponsorPolicies();
              this.sponsorPolicy = '';
              this.medicalSponsor = null;
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingSponsorPolicy.next(false);
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
  getSponsorPolicies() {
    this.setup
      .getAllSponsorPolicies()
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

  getMedicalSponsors() {
    this.isLoadingMedicalSponsors.next(true);
    this.setup.getMedicalSponsors().pipe(first()).subscribe(
      res => {
        this.isLoadingMedicalSponsors.next(false);
        this.medicalSponsors = res.data;
      },
      err => {
        this.isLoadingMedicalSponsors.next(false);
        retry(4);
      }
    );
  }

  ngOnInit() {
    this.updateForm = this.fb.group({
      name: [null, Validators.required],
      billing_sponsor_id: [null, Validators.required]
    });
    this.getSponsorPolicies();
    this.getMedicalSponsors();
  }

  toggleItem($event: any, policy: any) {
    this.setup.toggleActive(`setups/sponsorpolicies/${policy.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === policy.id);
        this.list[index].isActivated = !policy.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Please fill required fields';
    } else {
      this.modalError = '';
      this.isUpdatingSponsorPolicies.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/sponsorpolicies/${this.sponsorPolicyId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingSponsorPolicies.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getSponsorPolicies();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingSponsorPolicies.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteSponsorPolicy(sponsorPolicy: any) {
    this.setup.deleteSetup(`setups/sponsorpolicies/${sponsorPolicy.id}`).pipe(first()).subscribe(
      res => {
        this.getSponsorPolicies();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.sponsorPolicyId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingSponsorPolicies.next(false);
  }
  showModal(sponsorPolicy: any) {
    this.isVisible = true;
    const {
      name,
      billing_sponsor_id,
    } = sponsorPolicy;
    this.sponsorPolicyId = sponsorPolicy.id as number;
    console.log(this.sponsorPolicyId);
    this.updateForm.get('name').setValue(name);
    this.updateForm.get('billing_sponsor_id').setValue(billing_sponsor_id);

  }
}




