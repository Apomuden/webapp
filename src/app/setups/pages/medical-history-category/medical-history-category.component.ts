import { NzNotificationService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first, filter } from 'rxjs/operators';
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
  updateModalVisible = false;
  isUpdating = false;
  isCreatingCategory = false;
  isCreatingItem = false;
  loadingCategories = false;
  isLoadingCategories = false;
  createCategoryForm: FormGroup;
  updateForm: FormGroup;
  createItemForm: FormGroup;
  createModalError = '';
  updateModalError = '';
  addItemModalError = '';
  selectedCategory = null;
  categories = [];
  categoryList = [];
  categoryId = null;


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
    this.updateForm = this.fb.group({
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
              this.selectedCategory = this.categories[0];
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
        this.categoryList = res.filter(item => item.medical_history_category_id === selectedCategory.id);
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
            this.createCategoryForm.reset();
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
            this.getHistoryItems(this.selectedCategory);
            this.addItemModalVisible = false;
            this.createItemForm.reset();
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
    if (category) {
      this.setup.deleteSetup(`setups/medicalhistorycategories/${category.id}`).pipe(first()).subscribe(
        res => {
          if (res) {
            this.notification.success('Success', 'Category deleted');
            this.selectedCategory = null;
            this.getMedicalHistoryCategories();
          } else {
            this.notification.error('Error', 'Category could not be deleted');
          }
        },
        err => {
          console.log(err);
          this.notification.error('Error', 'Category could not be deleted');
        }
      );
    }
  }
  deleteItem(item) {
    if (item) {
      this.setup.deleteSetup(`setups/medicalhistories/${item.id}`).pipe(first()).subscribe(
        res => {
          if (res) {
            this.notification.success('Success', 'Item deleted');
            this.getHistoryItems(this.selectedCategory);
          } else {
            this.notification.error('Error', 'Item could not be deleted');
          }
        },
        err => {
          console.log(err);
          this.notification.error('Error', 'Item could not be deleted');
        }
      );
    }
  }

  showEditModal(category) {
    if (category) {
      this.updateModalVisible = true;
      this.updateForm.get('name').setValue(category.name);
      this.categoryId = category.id;
    }

  }
  closeUpdateModal() {
    this.updateModalVisible = false;
  }

  update() {
    if (this.updateForm.valid) {
      this.isUpdating = true;
      this.setup.updateSetup(this.updateForm.value, `setups/medicalhistorycategories/${this.categoryId}`)
        .pipe(first()).subscribe(
          res => {
            this.isUpdating = false;
            this.updateModalVisible = false;
            if (res) {
              this.notification.success('Success', 'Successfully updated');
              this.getMedicalHistoryCategories();
              this.updateForm.reset();
            } else {
              this.notification.error('Error', 'Could not update');
            }
          },
          err => {
            this.updateModalVisible = false;
            this.isUpdating = false;
            this.notification.error('Error', 'Could not update');
          }
        );
    }
  }
}
