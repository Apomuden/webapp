import { first } from 'rxjs/operators';
import { PermissionsService } from './permissions.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {

  constructor(private permissionsService: PermissionsService) { }

  ngOnInit() {
    this.permissionsService.getPermissions().pipe(first()).subscribe(res => {

    },
      err => {

      }
    );
  }

}
