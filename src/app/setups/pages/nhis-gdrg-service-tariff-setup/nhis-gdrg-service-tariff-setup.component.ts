import { NzNotificationService } from 'ng-zorro-antd';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SetupService } from 'src/app/shared/services/setup.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
  selector: 'app-nhis-gdrg-service-tariff-setup',
  templateUrl: './nhis-gdrg-service-tariff-setup.component.html',
  styleUrls: ['./nhis-gdrg-service-tariff-setup.component.css']
})
export class NhisGdrgServiceTariffSetupComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private setup: SetupService, private notification: NzNotificationService) { }
  initLoading = true;
  loadingMore = false;
  nhisGdrgServiceTariffForm: FormGroup;
  updateForm: FormGroup;
  error = '';
  data = [];
  list = [];
  nhisMdcs = [];
  isVisible = false;
  modalError = null;
  nhisGSTId = null;
  isNhisMdcsLoading = new BehaviorSubject(false);
  isCreating = new BehaviorSubject(false);
  isUpdating = new BehaviorSubject(false);


  ngOnInit() {
    this.nhisGdrgServiceTariffForm = this.fb.group({
      gdrg_code: [null, Validators.required],
      gdrg_service_name: [null, Validators.required],
      primary_with_catering: [null, Validators.required],
      primary_no_catering: [null, Validators.required],
      secondary_with_catering: [null, Validators.required],
      secondary_no_catering: [null, Validators.required],
      tertiary_with_catering: [null, Validators.required],
      tertiary_no_catering: [null, Validators.required],
      major_diagnostic_category_id: [null, Validators.required]
    });

    this.updateForm = this.fb.group({
      gdrg_code: [null, Validators.required],
      gdrg_service_name: [null, Validators.required],
      primary_with_catering: [null, Validators.required],
      primary_no_catering: [null, Validators.required],
      secondary_with_catering: [null, Validators.required],
      secondary_no_catering: [null, Validators.required],
      tertiary_with_catering: [null, Validators.required],
      tertiary_no_catering: [null, Validators.required],
      major_diagnostic_category_id: [null, Validators.required]
    });

    this.getNhisGdrgServiceTariffs();
    this.getNhisMdcs();

  }

  ngOnDestroy() { }
  getNhisMdcs() {
    this.isNhisMdcsLoading.next(true);
    this.setup.genericGet('setups/majordiagnosticcategories')
      .pipe(first())
      .subscribe(
        data => {
          this.isNhisMdcsLoading.next(false);
          this.nhisMdcs = data;
        }, error => {
          this.isNhisMdcsLoading.next(false);
          console.log(error);
        }
      );
  }
  getNhisGdrgServiceTariffs() {
    this.setup
      .genericGet('setups/nhisgdrgservicetariff')
      .pipe(first())
      .subscribe(
        data => {
          this.data = data;
          this.list = data;
          this.initLoading = false;

        },
        error => {
          this.initLoading = false;
          console.log(error);
        }
      );
  }




  createNhisGdrgServiceTariff(fields: object) {
    this.isCreating.next(true);
    if (this.nhisGdrgServiceTariffForm.valid) {
      this.setup.genericPost('setups/nhisgdrgservicetariff', { ...fields, status: 'ACTIVE' }).pipe(first()).subscribe(
        res => {
          this.isCreating.next(false);
          if (res) {
            this.nhisGdrgServiceTariffForm.reset();
            this.notification.blank(
              'Success',
              `Successfully created`
            );

            this.getNhisGdrgServiceTariffs();

          } else {
            this.notification.blank(
              'Error',
              `Could not create`
            );

          }
        }, error => {
          this.isCreating.next(false);
          console.log(error);

          this.notification.blank(
            'Error',
            `Could not create`
          );
        }
      );
    } else {
      this.error = 'Please fill required fields';
    }

  }

  submitForm() {
    const fields = this.nhisGdrgServiceTariffForm.value;
    this.createNhisGdrgServiceTariff(fields);
  }

  toggleItem($event: any, nhisGST: any) {
    this.setup.toggleActive(`setups/nhisgdrgservicetariff/${nhisGST.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === nhisGST.id);
        this.list[index].isActivated = !nhisGST.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }

  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Please fill required fields';
    } else {
      this.modalError = '';
      this.isUpdating.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/nhisgdrgservicetariff/${this.nhisGSTId}`).pipe(first()).subscribe(
        response => {
          this.isUpdating.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getNhisGdrgServiceTariffs();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdating.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }
  deleteItem(nhisGST: any) {
    this.setup.deleteSetup(`setups/nhisgdrgservicetariff/${nhisGST.id}`).pipe(first()).subscribe(
      res => {
        this.getNhisGdrgServiceTariffs();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.nhisGSTId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdating.next(false);
  }


  showModal(nhisGST: any) {
    this.isVisible = true;
    const {
      gdrg_code,
      gdrg_service_name,
      primary_with_catering,
      primary_no_catering,
      secondary_with_catering,
      secondary_no_catering,
      tertiary_with_catering,
      tertiary_no_catering,
      major_diagnostic_category_id
    } = nhisGST;
    this.nhisGSTId = nhisGST.id as number;
    console.log(this.nhisGSTId);
    this.updateForm.get('gdrg_code').setValue(gdrg_code);
    this.updateForm.get('gdrg_service_name').setValue(gdrg_service_name);
    this.updateForm.get('primary_with_catering').setValue(primary_with_catering);
    this.updateForm.get('primary_no_catering').setValue(primary_no_catering);
    this.updateForm.get('secondary_with_catering').setValue(secondary_with_catering);
    this.updateForm.get('secondary_no_catering').setValue(secondary_no_catering);
    this.updateForm.get('tertiary_with_catering').setValue(tertiary_with_catering);
    this.updateForm.get('tertiary_no_catering').setValue(tertiary_no_catering);
    this.updateForm.get('major_diagnostic_category_id').setValue(major_diagnostic_category_id);
  }
}
