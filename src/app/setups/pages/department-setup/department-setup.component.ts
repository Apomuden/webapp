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
    private notification: NzNotificationService
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
    this.getDepartments();
  }
}
