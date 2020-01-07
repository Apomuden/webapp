import { Router, NavigationExtras } from '@angular/router';
import { first } from 'rxjs/operators';
import { UserManagementService } from './user-management.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users = [];
  loading = true;
  pageIndex = 1;
  totalItems = 10;
  pageSize = 10;
  nextUrl = null;
  prevUrl = null;
  constructor(private router: Router, private userManagementService: UserManagementService) { }

  ngOnInit() {
    this.userManagementService.getAllUsers().pipe(first()).subscribe(
      res => {
        this.loading = false;
        this.users = res.data;
        this.totalItems = res.pagination.total_records;
        this.nextUrl = res.pagination.next_page_url;
        this.prevUrl = res.pagination.prev_page_url;
      },
      err => {
        this.loading = false;
        console.log('could not fetch users');
      }
    );
  }
  getPage(currentIndex) {
    if (currentIndex > this.pageIndex) {
      this.getPaginatedUsers(this.nextUrl, currentIndex);
    } else if (currentIndex < this.pageIndex) {
      this.getPaginatedUsers(this.prevUrl, currentIndex);
    }
  }

  getPaginatedUsers(url: string, currentIndex: number) {
    this.loading = true;
    this.userManagementService.getUsersPagination(url).pipe(first()).subscribe(
      res => {
        this.loading = false;
        this.users = res.data;
        this.pageIndex = currentIndex;
        this.totalItems = res.pagination.total_records;
        this.nextUrl = res.pagination.next_page_url;
        this.prevUrl = res.pagination.prev_page_url;
      },
      err => {
        this.loading = false;
        console.log('could not fetch users');
      }
    );
  }
}
