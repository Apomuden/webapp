import { first } from 'rxjs/operators';
import { SetupService } from './../../../shared/services/setup.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-company-setup',
  templateUrl: './company-setup.component.html',
  styleUrls: ['./company-setup.component.css']
})
export class CompanySetupComponent implements OnInit {

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService
  ) { }
  @ViewChild('placesRef', { static: false }) placesRef: GooglePlaceDirective;
  initLoading = true; // bug
  loadingMore = false;
  isCreatingCompany = new BehaviorSubject(false);
  data = [];
  list = [];

  error = '';
  googleAddress = null;
  name = '';
  phone = '';
  email = '';
  componentLabel = 'company';
  public handleAddressChange(address: Address) {
    this.googleAddress = address.url;
  }

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.email == null ||
      this.email === '' ||
      this.googleAddress == null ||
      this.googleAddress === '' ||
      this.phone == null ||
      this.phone === ''
    ) {
      this.error = `All fields are required!`;
    } else {
      this.error = '';
      this.isCreatingCompany.next(true);
      this.setup
        .createCompany(this.name, this.phone, this.email, this.googleAddress)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingCompany.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getCompanies();
              this.email = '';
              this.name = '';
              this.phone = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingCompany.next(false);
            this.notification.blank(
              'Error',
              `Could not create ${this.componentLabel}`
            );
          }
        );
    }
  }
  getCompanies() {
    this.setup
      .getCompanies()
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
    this.getCompanies();
  }

  toggleItem($event: any, company: any) {
    this.setup.toggleActive(`setups/companies/${company.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(c => c.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(c => c.id === company.id);
        this.list[index].isActivated = !company.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
