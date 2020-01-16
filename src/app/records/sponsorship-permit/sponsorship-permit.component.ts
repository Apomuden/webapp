import { first, debounceTime } from 'rxjs/operators';
import { RecordService } from './../record.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-sponsorship-permit',
  templateUrl: './sponsorship-permit.component.html',
  styleUrls: ['./sponsorship-permit.component.css']
})
export class SponsorshipPermitComponent implements OnInit, OnDestroy, AfterViewInit {
  selected = false;
  isLoadingData = false;
  searchInitialized = false;
  listOfData = [];
  filterBy = 'folder_no';
  pageIndex = 1;
  totalItems = 10;
  pageSize = 10;
  nextUrl = null;
  prevUrl = null;

  searchValue = this.fb.control(null);
  sponsorForm = this.fb.group({
    sponsorType: this.fb.control(null, [Validators.required]),
    sponsorName: this.fb.control(null, [Validators.required]),
    company: this.fb.control(null, [Validators.required]),
    memberId: this.fb.control(null, [Validators.required]),
    cardSerialNumber: this.fb.control(null, [Validators.required]),
    staffId: this.fb.control(null, [Validators.required]),
    beneficiary: this.fb.control(null, [Validators.required]),
    relation: this.fb.control(null, [Validators.required]),
    priority: this.fb.control(null, [Validators.required]),
    policy: this.fb.control(null, [Validators.required]),
    issueDate: this.fb.control(null, [Validators.required]),
    expiryDate: this.fb.control(null, [Validators.required]),
  });

  constructor(
    private recordService: RecordService,
    private fb: FormBuilder) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.searchValue.valueChanges.pipe(debounceTime(1000), untilComponentDestroyed(this)).subscribe(value => {
      if (value) {
        this.search(value);
      }
    });
  }

  ngOnDestroy() { }

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
        if (res.pagination) {
          console.log(res.pagination);
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

  addSponsor() {
  }
}
