import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SetupService } from 'src/app/shared/services/setup.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StoreSetupService } from 'src/app/shared/services/store-setup.service';

@Component({
  selector: 'app-product-form-and-unit',
  templateUrl: './product-form-and-unit.component.html',
  styles: []
})
export class ProductFormAndUnitComponent implements OnInit, AfterViewInit, OnDestroy {

  unitForm = this.fb.group({
    name: [null, Validators.required],
  });
  productFormForm = this.fb.group({
    name: [null, Validators.required],
    product_category_id: [null, Validators.required],
  });

  productUnits = [];
  productForms = [];
  categories = [];

  isUnitsLoading = true;
  isCreatingUnit = false;
  isUnitModalVisible = false;
  isFormModalVisible = false;
  isEditingUnit = false;
  isEditingForm = false;
  isFormsLoading = false;
  isCreatingForm = false;
  isCatLoading = false;

  editUnit: any;
  editForm: any;

  constructor(
    private fb: FormBuilder,
    private storeSetupService: StoreSetupService,
    private setupService: SetupService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit() {
    this.getUnits();
    this.getCategories();
    this.getForms();
  }

  ngAfterViewInit() { }

  ngOnDestroy() { }

  async getUnits() {
    this.isUnitsLoading = true;
    this.productUnits = await this.storeSetupService.getProductFormUnits().toPromise();
    this.isUnitsLoading = false;
  }

  async getCategories() {
    this.isCatLoading = true;
    this.categories = await this.storeSetupService.getProductCategories().toPromise();
    this.isCatLoading = false;
  }

  async getForms() {
    this.isFormsLoading = true;
    this.productForms = await this.storeSetupService.getProductForms().toPromise();
    this.isFormsLoading = false;
  }

  resetUnit() {
    this.unitForm.reset();
    this.isUnitModalVisible = false;
    this.editUnit = null;
    this.isEditingUnit = false;
  }

  resetForm() {
    this.productFormForm.reset();
    this.isFormModalVisible = false;
    this.editForm = null;
    this.isEditingForm = false;
  }

  async submitUnit() {
    this.isCreatingUnit = true;
    let observable: Observable<boolean>;
    observable = !this.isEditingUnit
      ? this.storeSetupService.createProductFormUnit(this.unitForm.value)
      : this.storeSetupService.editProductFormUnit(this.editUnit.id, this.unitForm.value);
    const success = await observable.toPromise();
    this.isCreatingUnit = false;
    this.showNotif(!success);
    if (success) {
      this.resetUnit();
      this.getUnits();
    }
  }

  async submitForm() {
    this.isCreatingForm = true;
    const observable = !this.isEditingForm
      ? this.storeSetupService.createProductForm(this.productFormForm.value)
      : this.storeSetupService.editProductForm(this.editForm.id, this.productFormForm.value);
    const success = await observable.toPromise();
    this.isCreatingForm = false;
    this.showNotif(!success);
    if (success) {
      this.resetForm();
      this.getForms();
    }
  }

  showNotif(isError = false) {
    if (isError) {
      this.notification.error('Error', 'Operation unsuccessful');
      return;
    }
    this.notification.success('Success', 'Proccessed Successfully');
  }

  showUnitModal(unit?: any) {
    if (unit) {
      this.editUnit = unit;
      this.isEditingUnit = true;
      for (const i of Object.keys(this.unitForm.value)) {
        this.unitForm.controls[i].setValue(unit[i]);
      }
    }
    this.isUnitModalVisible = true;
  }

  showFormModal(form?: any) {
    if (form) {
      this.editForm = form;
      this.isEditingForm = true;
      for (const i of Object.keys(this.productFormForm.value)) {
        this.productFormForm.controls[i].setValue(form[i]);
      }
    }
    this.isFormModalVisible = true;
  }

  closeUnitModal() {
    this.isEditingUnit = false;
    this.editUnit = null;
    this.resetUnit();
    this.isUnitModalVisible = false;
  }

  closeFormModal() {
    this.isEditingForm = false;
    this.editForm = null;
    this.resetForm();
    this.isFormModalVisible = false;
  }

  clearValidator(control: AbstractControl) {
    control.clearValidators();
    control.updateValueAndValidity();
  }

  deleteUnit(unit: any) {
    this.isUnitsLoading = true;
    this.storeSetupService.deleteProductFormUnit(unit.id).subscribe(success => {
      this.isUnitsLoading = false;
      this.showNotif(!success);
      if (success) {
        const index = this.productUnits.findIndex(p => p.id === unit.id);
        this.productUnits.splice(index, 1);
      }
    });
  }

  deleteForm(form: any) {
    this.isFormsLoading = true;
    this.storeSetupService.deleteProductForm(form.id).subscribe(success => {
      this.isFormsLoading = false;
      this.showNotif(!success);
      if (success) {
        const index = this.productForms.findIndex(p => p.id === form.id);
        this.productForms.splice(index, 1);
      }
    });
  }

  toggleItem($event: any, item: any, isUnit = false) {
    const path = isUnit ? 'productformunits' : 'productforms';
    this.setupService.toggleActive(`pharmacy/${path}/${item.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe((toggled: any) => {
        const index = isUnit
          ? this.productUnits.findIndex(l => l.id === toggled.id)
          : this.productForms.findIndex(l => l.id === toggled.id);
        if (isUnit) {
          this.productUnits[index].isActivated = toggled.isActivated;
        } else {
          this.productForms[index].isActivated = toggled.isActivated;
        }
      }, error => {
        let index;
        if (isUnit) {
          index = this.productUnits.findIndex(l => l.id === item.id);
          this.productUnits[index].isActivated = !item.isActivated;
        } else {
          index = this.productForms.findIndex(l => l.id === item.id);
          this.productForms[index].isActivated = !item.isActivated;
        }
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
