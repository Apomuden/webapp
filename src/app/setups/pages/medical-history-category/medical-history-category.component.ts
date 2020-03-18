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
  isCreatingCategory = false;
  loadingCategories = false;
  isLoadingCategories = false;
  createCategoryForm: FormGroup;
  createModalError = '';
  categories = [];
  data = [
    'Red Eye',
    'Blurred Vision',
    'Pain in Eye'
  ]
  constructor(private setup: SetupService,
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) { }

  ngOnInit() {
    this.createCategoryForm = this.fb.group({
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
          }

        }, err => {
          this.isLoadingCategories = false;
        }
      );
  }

  closeCreateModal() {
    this.createCategoryModalVisible = false;
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
}
