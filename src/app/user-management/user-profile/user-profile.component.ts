import { first, map } from 'rxjs/operators';
import { UserManagementService } from './../user-management.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  loading: boolean;
  userId: string;
  user: any;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userManagementService: UserManagementService) { }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.params.id;
    console.log(this.userId);
    this.userManagementService.getUserDetails(this.userId).pipe(first()).subscribe(
      res => {
        this.user = res.data;
        console.log(this.user);
      }, err => {

      }
    );


  }
}
