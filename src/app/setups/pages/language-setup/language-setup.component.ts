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
  data = [];
  list = [];
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
    private notification: NzNotificationService
  ) {}
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
    this.getLanguages();
  }
}
