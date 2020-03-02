import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { SetupService } from './../../../shared/services/setup.service';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-department-setup',
  templateUrl: './department-setup.component.html',
  styleUrls: ['./department-setup.component.css']
})
export class DepartmentSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingDepartment = new BehaviorSubject(false);
  data = [];
  list = [];
  error = '';
  updateForm: FormGroup;
  departmentId = null;
  modalError = '';
  isVisible = false;
  isUpdatingDepartment = new BehaviorSubject(false);
  department = '';

  submitForm(): void {
    if (this.department == null || this.department === '') {
      this.error = 'Please enter a department';
    } else {
      this.isCreatingDepartment.next(true);
      this.error = '';
      this.setup
        .createDepartment(this.department)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingDepartment.next(false);
            if (success) {
              this.error = '';
              this.notification.blank(
                'Success',
                'Successfully created department'
              );
              this.getDepartments();
              this.department = '';
            } else {
              this.error = '';
              this.notification.blank('Error', 'Could not create department');
            }
          },
          error => {
            this.isCreatingDepartment.next(false);
            this.error = '';
            this.notification.blank('Error', 'Could not create department');
          }
        );
    }
  }

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService,
    private fb: FormBuilder
  ) { }
  getDepartments() {
    this.setup
      .getDepartments()
      .pipe(first())
      .subscribe(
        data => {
          this.data = data.data;
          this.list = data.data;
          this.initLoading = false;
          console.log(this.data);
        },
        error => { }
      );
  }
  ngOnInit() {
    this.updateForm = this.fb.group({
      name: [null, Validators.required]
    })
    this.getDepartments();
  }

  toggleItem($event: any, department: any) {
    this.setup.toggleActive(`setups/departments/${department.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(d => d.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(d => d.id === department.id);
        this.list[index].isActivated = !department.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }

  deleteDepartment(department: any) {
    this.setup.deleteSetup(`setups/departments/${department.id}`).pipe(first()).subscribe(
      res => {
        this.getDepartments();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.departmentId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingDepartment.next(false);
  }
  showModal(department: any) {
    this.isVisible = true;
    const { name } = department;
    this.departmentId = department.id as number;
    this.updateForm.get('name').setValue(name);
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Name is required';
    } else {
      this.modalError = '';
      this.isUpdatingDepartment.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/departments/${this.departmentId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingDepartment.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getDepartments();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingDepartment.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }
}
