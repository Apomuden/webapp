import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-language-setup',
  templateUrl: './language-setup.component.html',
  styleUrls: ['./language-setup.component.css']
})
export class LanguageSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingLanguage = new BehaviorSubject(false);
  isUpdatingLanguage = new BehaviorSubject(false);
  data = [];
  list = [];
  isVisible = false;
  languageId = null;
  updateForm: FormGroup;
  modalError = '';
  error = '';
  language = '';
  componentLabel = 'language';

  submitForm(): void {
    if (this.language == null || this.language === '') {
      this.error = `Please enter ${this.componentLabel} name`;
    } else {
      this.error = '';
      this.isCreatingLanguage.next(true);
      this.setup
        .createLanguage(this.language)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingLanguage.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getLanguages();
              this.language = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingLanguage.next(false);
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
  getLanguages() {
    this.setup
      .getLanguages()
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
      name: [null, Validators.required]
    });
    this.getLanguages();
  }

  toggleItem($event: any, language: any) {
    this.setup.toggleActive(`setups/languages/${language.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(l => l.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(l => l.id === language.id);
        this.list[index].isActivated = !language.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Name is required';
    } else {
      this.modalError = '';
      this.isUpdatingLanguage.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/languages/${this.languageId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingLanguage.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getLanguages();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingLanguage.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteLanguage(language: any) {
    this.setup.deleteSetup(`setups/languages/${language.id}`).pipe(first()).subscribe(
      res => {
        this.getLanguages();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.languageId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingLanguage.next(false);
  }
  showModal(language: any) {
    this.isVisible = true;
    const { name } = language;
    this.languageId = language.id as number;
    console.log(this.languageId);
    this.updateForm.get('name').setValue(name);
  }
}
