import { NzNotificationService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { SetupService } from 'src/app/shared/services/setup.service';

@Component({
  selector: 'app-medical-history-category',
  templateUrl: './medical-history-category.component.html',
  styleUrls: ['./medical-history-category.component.css']
})
export class MedicalHistoryCategoryComponent implements OnInit {
  createCategoryModalVisible = false;
  isLoadingItems = false;
  addItemModalVisible = false;
  isCreatingCategory = false;
  isCreatingItem = false;
  loadingCategories = false;
  isLoadingCategories = false;
  createCategoryForm: FormGroup;
  createItemForm: FormGroup;
  createModalError = '';
  addItemModalError = '';
  selectedCategory = null;
  categories = [];
  categoryList = [];
  constructor(private setup: SetupService,
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) { }

  ngOnInit() {
    this.createCategoryForm = this.fb.group({
      name: [null, Validators.required]
    });
    this.createItemForm = this.fb.group({
      name: [null, Validators.required]
    });

    this.getMedicalHistoryCategories();
  }


  getMedicalHistoryCategories() {
    this.isLoadingCategories = true;
    this.setup.getHistoryCategories('setups/medicalhistorycategories')
      .pipe(first())
      .subscribe(
        res => {
          this.isLoadingCategories = false;
          if (res) {
            this.categories = res;
            if ((this.selectedCategory == null) && (this.categories.length > 0)) {

              this.getHistoryItems(this.categories[0]);
            }
          }

        }, err => {
          this.isLoadingCategories = false;
        }
      );
  }



  getHistoryItems(selectedCategory: any) {
    this.selectedCategory = selectedCategory;
    this.isLoadingItems = true;
    this.setup.genericGet('setups/medicalhistories').pipe(first()).subscribe(
      res => {
        this.isLoadingItems = false;
        this.categoryList = res;
      },
      err => {
        this.isLoadingItems = false;
      }
    );
  }
  closeCreateModal() {
    this.createCategoryModalVisible = false;
  }
  closeAddItemModal() {
    this.addItemModalVisible = false;
  }
  createCategory() {
    if (this.createCategoryForm.valid) {
      this.isCreatingCategory = true;
      this.setup.createHistoryCategory('setups/medicalhistorycategories',
        { ...this.createCategoryForm.value, status: 'ACTIVE' }).pipe(first()).subscribe(
          res => {
            this.isCreatingCategory = false;
            this.notification.success('Success', 'Category Created');
            this.getMedicalHistoryCategories();
            this.createCategoryModalVisible = false;
          },
          err => {
            this.isCreatingCategory = false;
            this.notification.error('Error', 'Category could not be created');
          }
        )
    } else {
      this.createModalError = 'Name is required!';
    }
  }
  showCreateCategoryModal() {
    this.createCategoryModalVisible = true;
  }
  showAddItemModal(category: any) {
    this.getHistoryItems(category);
    this.addItemModalVisible = true;
  }
  createItem() {
    if (this.createItemForm.valid) {
      this.isCreatingItem = true;
      this.setup.genericPost('setups/medicalhistories',
        {
          ...this.createItemForm.value, status: 'ACTIVE',
          medical_history_category_id: this.selectedCategory.id
        }).pipe(first()).subscribe(
          res => {
            this.isCreatingItem = false;
            this.notification.success('Success', 'Item Created');
            this.getHistoryItems(this.selectedCategory.id);
            this.addItemModalVisible = false;
          },
          err => {
            this.isCreatingItem = false;
            this.notification.error('Error', 'Item could not be created');
          }
        )
    } else {
      this.addItemModalError = 'Name is required!';
    }
  }
  deleteCategory(category) {
    console.log(category);
  }
  deleteItem(item) {

  }
}
