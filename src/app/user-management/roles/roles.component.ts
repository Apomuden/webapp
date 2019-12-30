import { first, retry } from "rxjs/operators";
import { RolesService } from "./roles.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.css"]
})
export class RolesComponent implements OnInit {
  roles = [];
  initLoading = true;
  constructor(private rolesService: RolesService) {}

  ngOnInit() {
    this.rolesService
      .getRoles()
      .pipe(first())
      .subscribe(
        roles => {
          this.initLoading = false;
          this.roles = roles;
          console.log(this.roles);
        },
        error => {
          this.initLoading = false;
          retry(3);
          console.log(error);
        }
      );
  }
}
