import { first } from 'rxjs/operators';
import { RecordService } from './../record.service';
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-patient',
  templateUrl: './search-patient.component.html',
  styleUrls: ['./search-patient.component.css']
})
export class SearchPatientComponent implements OnInit {

  isLoadingData = false;
  searchInitialized = false;
  listOfData = [];
  searchValue = '';
  filterBy = 'firstname';
  timeout;
  pageIndex = 1;
  totalItems = 10;
  pageSize = 10;
  nextUrl = null;
  prevUrl = null;

  constructor(private recordService: RecordService) { }

  ngOnInit() {
    this.timeout = null;
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
    this.recordService.getPatientsPagination(`${url}&${this.filterBy}=${this.searchValue}`).pipe(first()).subscribe(
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
  getData() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.isLoadingData = true;
      this.searchInitialized = true;
      this.recordService.getAllPatients(`/paginated?page=1&${this.filterBy}=${this.searchValue}`).pipe(first()).subscribe(
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
    }, 1000);


  }
}
