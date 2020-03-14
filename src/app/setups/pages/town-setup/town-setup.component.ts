import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-town-setup',
  templateUrl: './town-setup.component.html',
  styleUrls: ['./town-setup.component.css']
})
export class TownSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isVisible = false;
  isCreatingTown = new BehaviorSubject(false);
  districtsLoading = new BehaviorSubject(false);
  isUpdatingTown = new BehaviorSubject(false);
  modalError = '';
  townId = null;



  data = [];
  list = [];
  error = '';
  name = '';
  updateForm: FormGroup;
  district = null;

  districts = null;

  componentLabel = 'town';

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.district == null ||
      this.district === ''
    ) {
      this.error = 'All Fields are required!';
    } else {
      this.error = '';
      this.isCreatingTown.next(true);
      this.setup
        .createTown(this.name, this.district)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingTown.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getTowns();
              this.name = '';
              this.district = null;
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingTown.next(false);
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

  getTowns() {
    this.setup
      .getTowns()
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

  getDistricts() {
    this.districtsLoading.next(true);
    this.setup
      .getDistricts()
      .pipe(first())
      .subscribe(
        data => {
          this.districtsLoading.next(false);
          this.districts = data.data;
        },
        error => {
          this.districtsLoading.next(false);
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.updateForm = this.fb.group({
      name: [null, Validators.required],
      district_id: [null, Validators.required]
    })
    this.getTowns();
    this.getDistricts();
  }

  toggleItem($event: any, town: any) {
    this.setup.toggleActive(`setups/towns/${town.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === town.id);
        this.list[index].isActivated = !town.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Please fill required fields';
    } else {
      this.modalError = '';
      this.isUpdatingTown.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/towns/${this.townId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingTown.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getTowns();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingTown.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteTown(town: any) {
    this.setup.deleteSetup(`setups/towns/${town.id}`).pipe(first()).subscribe(
      res => {
        this.getTowns();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.townId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingTown.next(false);
  }
  showModal(town: any) {
    this.isVisible = true;
    const {
      name,
      district_id
    } = town;
    this.townId = town.id as number;
    console.log(this.townId);
    this.updateForm.get('name').setValue(name);
    this.updateForm.get('district_id').setValue(district_id);

  }
}





