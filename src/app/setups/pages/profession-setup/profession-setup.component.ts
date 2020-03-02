import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-profession-setup',
  templateUrl: './profession-setup.component.html',
  styleUrls: ['./profession-setup.component.css']
})
export class ProfessionSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  professionId = null;
  isVisible = false;
  isCreatingProfession = new BehaviorSubject(false);
  staffCategoriesLoading = new BehaviorSubject(false);
  isUpdatingProfession = new BehaviorSubject(false);
  updateForm: FormGroup;
  modalError = '';

  data = [];
  list = [];
  error = '';
  name = '';

  staffCategory = null;

  staffCategories = null;

  componentLabel = 'profession';

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.staffCategory == null ||
      this.staffCategory === ''
    ) {
      this.error = 'All Fields are required!';
    } else {
      this.error = '';
      this.isCreatingProfession.next(true);
      this.setup
        .createProfession(this.name, this.staffCategory)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingProfession.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getProfessions();
              this.name = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingProfession.next(false);
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

  getProfessions() {
    this.setup
      .getProfessions()
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

  getStaffCategories() {
    this.staffCategoriesLoading.next(true);
    this.setup
      .getStaffCategories()
      .pipe(first())
      .subscribe(
        data => {
          this.staffCategoriesLoading.next(false);
          this.staffCategories = data.data;
        },
        error => {
          this.staffCategoriesLoading.next(false);
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.getProfessions();
    this.getStaffCategories();
    this.updateForm = this.fb.group({
      name: [null, Validators.required],
      staff_category_id: [null, Validators.required]
    });
  }

  toggleItem($event: any, profession: any) {
    this.setup.toggleActive(`setups/professions/${profession.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(p => p.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(p => p.id === profession.id);
        this.list[index].isActivated = !profession.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }

  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Name is required';
    } else {
      this.modalError = '';
      this.isUpdatingProfession.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/professions/${this.professionId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingProfession.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getProfessions();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingProfession.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteProfession(profession: any) {
    this.setup.deleteSetup(`setups/professions/${profession.id}`).pipe(first()).subscribe(
      res => {
        this.getProfessions();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.professionId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingProfession.next(false);
  }
  showModal(profession: any) {
    this.isVisible = true;
    const { name, staff_category_id } = profession;
    this.professionId = profession.id as number;
    console.log(this.professionId);
    this.updateForm.get('name').setValue(name);
    this.updateForm.get('staff_category_id').setValue(staff_category_id);

  }
}
