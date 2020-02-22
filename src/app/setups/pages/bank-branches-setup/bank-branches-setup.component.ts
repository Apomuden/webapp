import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-bank-branches-setup',
  templateUrl: './bank-branches-setup.component.html',
  styleUrls: ['./bank-branches-setup.component.css']
})
export class BankBranchesSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingBankBranch = new BehaviorSubject(false);
  banksLoading = new BehaviorSubject(false);

  data = [];
  list = [];
  error = '';
  name = '';
  sortCode = '';
  email = '';
  phone = '';
  bank = null;
  banks = null;

  componentLabel = 'bank branch';

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.bank == null ||
      this.bank === '' ||
      this.phone == null ||
      this.phone === '' ||
      this.email == null ||
      this.email === '' ||
      this.sortCode == null ||
      this.sortCode === ''
    ) {
      this.error = 'All Fields are required!';
    } else {
      this.error = '';
      this.isCreatingBankBranch.next(true);
      this.setup
        .createBankBranch(
          this.name,
          this.sortCode,
          this.bank,
          this.email,
          this.phone
        )
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingBankBranch.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getBankBranches();
              this.name = '';
              this.error = '';
              this.name = '';
              this.sortCode = '';
              this.email = '';
              this.phone = '';
              this.bank = null;
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingBankBranch.next(false);
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

  getBankBranches() {
    this.setup
      .getBankBranches()
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

  getBanks() {
    this.banksLoading.next(true);
    this.setup
      .getBanks()
      .pipe(first())
      .subscribe(
        data => {
          this.banksLoading.next(false);
          this.banks = data.data;
        },
        error => {
          this.banksLoading.next(false);
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.getBankBranches();
    this.getBanks();
  }

  toggleItem($event: any, branch: any) {
    this.setup.toggleActive(`setups/bankbranches/${branch.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        console.log(toggled);
        const index = this.list.findIndex(b => b.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(b => b.id === branch.id);
        this.list[index].isActivated = !branch.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
