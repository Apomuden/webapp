import { first, debounceTime } from 'rxjs/operators';
import { RecordService } from './../record.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { SetupService } from 'src/app/shared/services/setup.service';

@Component({
  selector: 'app-sponsorship-permit',
  templateUrl: './sponsorship-permit.component.html',
  styleUrls: ['./sponsorship-permit.component.css']
})
export class SponsorshipPermitComponent implements OnInit, OnDestroy, AfterViewInit {
  selected = false;
  isLoadingData = false;
  searchInitialized = false;
  isLoadingFundingTypes = false;
  filterBy = 'folder_no';
  pageIndex = 1;
  totalItems = 5;
  pageSize = 5;
  nextUrl = null;
  prevUrl = null;
  searchValue = this.fb.control(null);
  sponsorForm = this.fb.group({
    fundingType: [null, [Validators.required]],
    sponsorName: [null, [Validators.required]],
    company: [null, [Validators.required]],
    memberId: [null, [Validators.required]],
    cardSerialNumber: [null, [Validators.required]],
    staffId: [null, [Validators.required]],
    beneficiary: [null, [Validators.required]],
    relation: [null],
    policy: [null, [Validators.required]],
    issuedDate: [null, [Validators.required]],
    expiryDate: [null, [Validators.required]],
  });
  patient: any;

  listOfData = [];
  fundingTypes = [];

  constructor(
    private recordService: RecordService,
    private setupService: SetupService,
    private fb: FormBuilder) { }


  ngOnInit() {
    this.getFundingTypes();
  }

  private getFundingTypes() {
    this.setupService.getFundingTypes()
      .pipe(first())
      .subscribe(data => {
        this.isLoadingFundingTypes = false;
        this.fundingTypes = data.data;
      }, error => {
        this.isLoadingFundingTypes = false;
        console.log(error);
      });
  }

  ngAfterViewInit() {
    this.searchValue.valueChanges.pipe(debounceTime(1000), untilComponentDestroyed(this)).subscribe(value => {
      if (value) {
        console.log(value);
        this.search(value);
      }
    });
  }

  ngOnDestroy() { }

  get fundingTypeControl(): FormControl {
    return this.sponsorForm.get('fundingType') as FormControl;
  }

  get beneficiaryControl(): FormControl {
    return this.sponsorForm.get('beneficiary') as FormControl;
  }

  get isBeneficiaryDependant(): boolean {
    if (this.beneficiaryControl.value === 'Dependant') {
      this.relationControl.setValidators(Validators.required);
      return true;
    } else {
      this.relationControl.clearValidators();
      this.relationControl.reset();
      return false;
    }
  }

  get isCoporateSponsor(): boolean {
    const fundType = this.getSelectedFundingType(this.fundingTypeControl.value);
    if (!fundType) {
      return false;
    }
    return fundType.name.toLocaleLowerCase().includes('coporate');
  }

  get isInsurance(): boolean {
    const fundType = this.getSelectedFundingType(this.fundingTypeControl.value);
    if (!fundType) {
      return false;
    }
    if (fundType.name.toLocaleLowerCase().includes('nhis') || fundType.name.toLocaleLowerCase().includes('insurance')) {
      this.memberIDControl.setValidators(Validators.required);
      this.cardSerialControl.setValidators(Validators.required);
      this.staffIDControl.clearValidators();
      this.staffIDControl.reset();
      return true;
    } else {
      this.staffIDControl.setValidators(Validators.required);
      this.memberIDControl.clearValidators();
      this.memberIDControl.reset();
      this.cardSerialControl.clearValidators();
      return false;
    }
  }

  get companyControl(): FormControl {
    return this.sponsorForm.get('company') as FormControl;
  }
  get cardSerialControl(): FormControl {
    return this.sponsorForm.get('cardSerialNumber') as FormControl;
  }

  get staffIDControl(): FormControl {
    return this.sponsorForm.get('staffId') as FormControl;
  }
  get memberIDControl(): FormControl {
    return this.sponsorForm.get('memberId') as FormControl;
  }

  get relationControl(): FormControl {
    return this.sponsorForm.get('relation') as FormControl;
  }

  getSelectedFundingType(value: number) {
    const fundType = this.fundingTypes.find(ft => ft.id === value);
    if (!fundType) {
      return null;
    }
    return fundType;
  }

  /*
  * Tracks validity status of form before moving to the
  * next step in patient registration*/
  validateForm(): boolean {
    if (!this.sponsorForm) {
      return null;
    }

    if (!this.isBeneficiaryDependant) {
      this.relationControl.reset();
    }

    for (const i of Object.keys(this.sponsorForm.controls)) {
      this.sponsorForm.controls[i].markAsDirty();
      this.sponsorForm.controls[i].updateValueAndValidity();
    }

    return this.sponsorForm.valid;
  }

  relationValidator = (control: FormControl): { [key: string]: any } | null => {
    if (!this.isBeneficiaryDependant) {
      return null;
    }

    if (!control.value) {
      return { required: true };
    }

    return null;
  }

  getPage(currentIndex) {
    if (currentIndex > this.pageIndex) {
      this.getPaginatedPatients(this.nextUrl, currentIndex);
    } else if (currentIndex < this.pageIndex) {
      this.getPaginatedPatients(this.prevUrl, currentIndex);
    }
  }

  getPaginatedPatients(url: string, currentIndex: number) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    this.recordService.getPatientsPagination(`${url}&${this.filterBy}=${this.searchValue.value}`).pipe(first()).subscribe(
      res => {
        this.listOfData = res.data;
        this.isLoadingData = false;
        this.pageIndex = currentIndex;
        if (res.pagination) {
          this.totalItems = res.pagination.total_records;
          this.nextUrl = res.pagination.next_page_url;
          this.prevUrl = res.pagination.prev_page_url;
        }
      },
      error => {
        this.listOfData = [];
        this.isLoadingData = false;
        console.log(error);
      }
    );
  }

  search(term: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    this.recordService.getAllPatients(`/paginated?page=1&${this.filterBy}=${term}`).pipe(first()).subscribe(
      res => {
        this.listOfData = res.data;
        this.isLoadingData = false;
        console.log(res.data);
        if (res.pagination) {
          this.totalItems = res.pagination.total_records;
          this.nextUrl = res.pagination.next_page_url;
          this.prevUrl = res.pagination.prev_page_url;
        }
      },
      error => {
        this.listOfData = [];
        this.isLoadingData = false;
        console.log(error);
      }
    );
  }

  select(patient) {
    this.patient = patient;
  }

  addSponsor() {
    this.validateForm();
  }
}
