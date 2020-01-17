import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { first, debounceTime, filter } from 'rxjs/operators';
import { RecordService } from './../record.service';
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-search-patient',
  templateUrl: './search-patient.component.html',
  styleUrls: ['./search-patient.component.css']
})
export class SearchPatientComponent implements OnInit, OnDestroy {

  isLoadingData = false;
  searchInitialized = false;
  listOfData = [];
  searchForm: FormGroup;
  pageIndex = 1;
  totalItems = 10;
  searchControl: FormControl;
  filterByControl: FormControl;
  pageSize = 10;
  nextUrl = null;
  prevUrl = null;

  constructor(private recordService: RecordService, private readonly fb: FormBuilder) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      searchControl: [null, [Validators.minLength(11), Validators.maxLength(12)]],
      filterByControl: ['folder_no', [Validators.required]]
    });
    this.searchControl = this.searchForm.get('searchControl') as FormControl;
    this.filterByControl = this.searchForm.get('filterByControl') as FormControl;
    this.searchControl.valueChanges.pipe(debounceTime(1000), untilComponentDestroyed(this)).subscribe(value => {
      if (value && this.searchControl.valid) {
        this.getData(value, this.filterByControl.value);
      } else {
        this.listOfData = [];
      }
    });
    this.filterByControl.valueChanges.pipe(untilComponentDestroyed(this)).subscribe(value => {
      if (value && this.searchControl.valid) {
        this.getData(this.searchControl.value, value);
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
    this.recordService.getPatientsPagination(`${url}&${this.filterByControl.value}=${this.searchControl.value}`).pipe(first()).subscribe(
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
  getData(searchValue, filterBy) {

    this.isLoadingData = true;
    this.searchInitialized = true;
    this.recordService.getAllPatients(`/paginated?page=1&${filterBy}=${searchValue}`).pipe(first()).subscribe(
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
}
