import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SetupService } from 'src/app/shared/services/setup.service';
import { LabSetupService } from 'src/app/shared/services/lab-setup.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { StoreService } from 'ng-chartjs/lib/store.service';
import { StoreSetupService } from 'src/app/shared/services/store-setup.service';

const DAY = 'DAY';
const WEEK = 'WEEK';
const MONTH = 'MONTH';
const YEAR = 'YEAR';

@Component({
  selector: 'app-product-type-and-category',
  templateUrl: './product-type-and-category.component.html',
  styles: []
})
export class ProductTypeAndCategoryComponent implements OnInit, AfterViewInit, OnDestroy {

  typeForm = this.fb.group({
    name: [null, Validators.required],
  });
  catForm = this.fb.group({
    name: [null, Validators.required],
    product_type_id: [null, Validators.required],
  });

  productTypes = [];
  categories = [];

  isTypesLoading = true;
  isCreatingType = false;
  isTypeModalVisible = false;
  isCatModalVisible = false;
  isEditingType = false;
  isEditingCat = false;
  isCatsLoading = false;
  isCreatingCat = false;

  editType: any;
  editCat: any;

  constructor(
    private fb: FormBuilder,
    private storeSetupService: StoreSetupService,
    private setupService: SetupService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit() {
    this.getTypes();
    this.getCats();
  }

  ngAfterViewInit() { }

  ngOnDestroy() { }

  async getTypes() {
    this.isTypesLoading = true;
    this.productTypes = await this.storeSetupService.getProductTypes().toPromise();
    this.isTypesLoading = false;
  }

  async getCats() {
    this.isCatsLoading = true;
    this.categories = await this.storeSetupService.getProductCategories().toPromise();
    this.isCatsLoading = false;
  }

  resetType() {
    this.typeForm.reset();
    this.isTypeModalVisible = false;
    this.editType = null;
    this.isEditingType = false;
  }

  resetCat() {
    this.catForm.reset();
    this.isCatModalVisible = false;
    this.editCat = null;
    this.isEditingCat = false;
  }

  async submitType() {
    this.isCreatingType = true;
    let observable: Observable<boolean>;
    observable = !this.isEditingType
      ? this.storeSetupService.createProductType(this.typeForm.value)
      : this.storeSetupService.editProductType(this.editType.id, this.typeForm.value);
    const success = await observable.toPromise();
    this.isCreatingType = false;
    this.showNotif(!success);
    if (success) {
      this.resetType();
      this.getTypes();
    }
  }

  async submitCat() {
    this.isCreatingCat = true;
    const observable = !this.isEditingCat
      ? this.storeSetupService.createProductCategory(this.catForm.value)
      : this.storeSetupService.editProductCategory(this.editCat.id, this.catForm.value);
    const success = await observable.toPromise();
    this.isCreatingCat = false;
    this.showNotif(!success);
    if (success) {
      this.resetCat();
      this.getCats();
    }
  }

  showNotif(isError = false) {
    if (isError) {
      this.notification.error('Error', 'Operation unsuccessful');
      return;
    }
    this.notification.success('Success', 'Proccessed Successfully');
  }

  showTypeModal(type?: any) {
    if (type) {
      this.editType = type;
      this.isEditingType = true;
      for (const i of Object.keys(this.typeForm.value)) {
        this.typeForm.controls[i].setValue(type[i]);
      }
    }
    this.isTypeModalVisible = true;
  }

  showCatModal(category?: any) {
    if (category) {
      this.editCat = category;
      this.isEditingCat = true;
      for (const i of Object.keys(this.catForm.value)) {
        this.catForm.controls[i].setValue(category[i]);
      }
    }
    this.isCatModalVisible = true;
  }

  closeTypeModal() {
    this.isEditingType = false;
    this.editType = null;
    this.resetType();
    this.isTypeModalVisible = false;
  }

  closeCatModal() {
    this.isEditingCat = false;
    this.editCat = null;
    this.resetCat();
    this.isCatModalVisible = false;
  }

  clearValidator(control: AbstractControl) {
    control.clearValidators();
    control.updateValueAndValidity();
  }

  deleteType(type: any) {
    this.isTypesLoading = true;
    this.storeSetupService.deleteProductType(type.id).subscribe(success => {
      this.isTypesLoading = false;
      this.showNotif(!success);
      if (success) {
        const index = this.productTypes.findIndex(p => p.id === type.id);
        this.productTypes.splice(index, 1);
      }
    });
  }

  deleteCat(category: any) {
    this.isCatsLoading = true;
    this.storeSetupService.deleteProductCategory(category.id).subscribe(success => {
      this.isCatsLoading = false;
      this.showNotif(!success);
      if (success) {
        const index = this.categories.findIndex(p => p.id === category.id);
        this.categories.splice(index, 1);
      }
    });
  }

  toggleItem($event: any, item: any, isType = false) {
    const path = isType ? 'producttypes' : 'productcategories';
    this.setupService.toggleActive(`pharmacy/${path}/${item.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe((toggled: any) => {
        const index = isType
          ? this.productTypes.findIndex(l => l.id === toggled.id)
          : this.categories.findIndex(l => l.id === toggled.id);
        if (isType) {
          this.productTypes[index].isActivated = toggled.isActivated;
        } else {
          this.categories[index].isActivated = toggled.isActivated;
        }
      }, error => {
        let index;
        if (isType) {
          index = this.productTypes.findIndex(l => l.id === item.id);
          this.productTypes[index].isActivated = !item.isActivated;
        } else {
          index = this.categories.findIndex(l => l.id === item.id);
          this.categories[index].isActivated = !item.isActivated;
        }
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
