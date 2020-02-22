import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-bank-setup',
  templateUrl: './bank-setup.component.html',
  styleUrls: ['./bank-setup.component.css']
})
export class BankSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingBank = new BehaviorSubject(false);

  data = [];
  list = [];
  error = '';
  name = '';
  sortCode = '';
  email = '';
  phone = '';

  componentLabel = 'bank';

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.sortCode == null ||
      this.sortCode === '' ||
      this.email == null ||
      this.email === '' ||
      this.phone == null ||
      this.phone === ''
    ) {
      this.error = 'All Fields are required!';
    } else {
      this.error = '';
      this.isCreatingBank.next(true);
      this.setup
        .createBank(this.name, this.sortCode, this.email, this.phone)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingBank.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getBanks();
              this.name = '';
              this.sortCode = '';
              this.email = '';
              this.phone = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingBank.next(false);
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
  ) { }

  getBanks() {
    this.setup
      .getBanks()
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
    this.getBanks();
  }

  toggleItem($event: any, bank: any) {
    this.setup.toggleActive(`setups/banks/${bank.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(b => b.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(b => b.id === bank.id);
        this.list[index].isActivated = !bank.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
