import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-title-setup',
  templateUrl: './title-setup.component.html',
  styleUrls: ['./title-setup.component.css']
})
export class TitleSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingTitle = new BehaviorSubject(false);
  isUpdatingTitle = new BehaviorSubject(false);
  isVisible = false;
  titleId = null;
  updateForm: FormGroup;
  data = [];
  list = [];
  error = '';
  modalError = '';
  name = '';

  gender = null;

  componentLabel = 'title';

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.gender == null ||
      this.gender === '' ||
      this.gender === []
    ) {
      this.error = 'All Fields are required!';
    } else {
      this.error = '';
      this.isCreatingTitle.next(true);
      this.setup
        .createTitle(this.name, this.gender.join(','))
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingTitle.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getTitles();
              this.name = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingTitle.next(false);
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

  getTitles() {
    this.setup
      .getTitles()
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
      name: [null, Validators.required],
      gender: [null, Validators.required]
    });
    this.getTitles();
  }
  log(input: any) {
    console.log(input.toString());
  }

  toggleItem($event: any, title: any) {
    this.setup.toggleActive(`setups/titles/${title.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === title.id);
        this.list[index].isActivated = !title.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Please fill required fields';
    } else {
      this.modalError = '';
      this.isUpdatingTitle.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value,
        gender: this.updateForm.get('gender').value.join(',')
      }, `setups/titles/${this.titleId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingTitle.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getTitles();
          } else {
            this.notification.error('Error', 'Update failed');
          }
        },
        error => {
          this.isUpdatingTitle.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteTitle(title: any) {
    this.setup.deleteSetup(`setups/titles/${title.id}`).pipe(first()).subscribe(
      res => {
        this.getTitles();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.titleId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingTitle.next(false);
  }
  showModal(title: any) {
    this.isVisible = true;
    const {
      name,
      gender
    } = title;
    this.titleId = title.id as number;
    console.log(this.titleId);
    this.updateForm.get('name').setValue(name);
    this.updateForm.get('gender').setValue(gender.split(','));

  }
}





