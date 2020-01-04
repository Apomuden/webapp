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
  constructor(private userManagementService: UserManagementService) { }

  ngOnInit() {
    this.userManagementService.getAllUsers().pipe(first()).subscribe(
      users => {
        this.users = users;
      },
      err => {
        console.log('could not fetch users')
      }
    );
    // this.users = [
    //   {
    //     key: '1',
    //     staff_id: '101',
    //     profession: 'Pharmacist',
    //     name: 'John Brown',
    //     department: 'Pharmacy',
    //     address: 'Ashaiman'
    //   },
    //   {
    //     key: '2',
    //     name: 'Jim Green',
    //     staff_id: '112',
    //     profession: 'Records Officer',
    //     department: 'Records',
    //     address: 'Trassaco'
    //   },
    //   {
    //     key: '3',
    //     name: 'Joe Black',
    //     staff_id: '012',
    //     profession: 'Doctor',
    //     department: 'Male Ward',
    //     address: 'Dansoman'
    //   }
    // ];
  }
}
