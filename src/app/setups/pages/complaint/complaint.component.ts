import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isVisible = false;
  isCreatingComplaint = new BehaviorSubject(false);
  complaintTypesLoading = new BehaviorSubject(false);
  isUpdatingComplaint = new BehaviorSubject(false);
  modalError = '';
  complaintId = null;



  data = [];
  list = [];
  error = '';
  name = '';
  updateForm: FormGroup;
  complaintType = null;

  complaintTypes = null;

  componentLabel = 'complaint';

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.complaintType == null ||
      this.complaintType === ''
    ) {
      this.error = 'All Fields are required!';
    } else {
      this.error = '';
      this.isCreatingComplaint.next(true);
      this.setup
        .genericPost('setups/complaints', { name: this.name, status: 'ACTIVE', complaint_type_id: this.complaintType })
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingComplaint.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getComplaints();
              this.name = '';
              this.complaintType = null;
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingComplaint.next(false);
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

  getComplaints() {
    this.setup
      .genericGet('setups/complaints')
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

  getComplaintTypes() {
    this.complaintTypesLoading.next(true);
    this.setup
      .genericGet('setups/complainttypes')
      .pipe(first())
      .subscribe(
        data => {
          this.complaintTypesLoading.next(false);
          this.complaintTypes = data;
        },
        error => {
          this.complaintTypesLoading.next(false);
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.updateForm = this.fb.group({
      name: [null, Validators.required],
      complaint_type_id: [null, Validators.required]
    });
    this.getComplaints();
    this.getComplaintTypes();
  }

  toggleItem($event: any, item: any) {
    this.setup.toggleActive(`setups/complaints/${item.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === item.id);
        this.list[index].isActivated = !item.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Please fill required fields';
    } else {
      this.modalError = '';
      this.isUpdatingComplaint.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/complaints/${this.complaintId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingComplaint.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getComplaints();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingComplaint.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteComplaint(item: any) {
    this.setup.deleteSetup(`setups/complaints/${item.id}`).pipe(first()).subscribe(
      res => {
        this.getComplaints();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.complaintId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingComplaint.next(false);
  }
  showModal(item: any) {
    this.isVisible = true;
    const {
      name,
      complaint_type_id
    } = item;
    this.complaintId = item.id as number;
    console.log(this.complaintId);
    this.updateForm.get('name').setValue(name);
    this.updateForm.get('complaint_type_id').setValue(complaint_type_id);

  }
}





