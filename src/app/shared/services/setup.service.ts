import { JwtInterceptor } from './../interceptor/token.interceptor';
import { map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
const COUNTRIES_API_URL = environment.apiBaseUrl+"/setups/countries";
const ROLES_API_URL = environment.apiBaseUrl+"/setups/countries";
const DEPARTMENTS_API_URL = environment.apiBaseUrl+"/setups/departments";
const BANKS_API_URL = environment.apiBaseUrl+"/setups/banks";
@Injectable({
  providedIn: 'root'
})
export class SetupService {
 private countries;
 private roles;
 private departments;
 private banks;
  constructor(private http:HttpClient) { }

  getCountries() {
    return this.http
      .get<any>(COUNTRIES_API_URL)
      .pipe(
        map(res => {
          if (res) {
            this.countries=res;
          }
          return this.countries ;
        })
      );
  }

  getDepartments(){
    return this.http
      .get<any>(DEPARTMENTS_API_URL)
      .pipe(
        map(res => {
          if (res) {
            this.departments=res;
          }
          return this.departments ;
        })
      );
  }

  getRoles(){
    return this.http
      .get<any>(ROLES_API_URL)
      .pipe(
        map(res => {
          if (res) {
            this.roles=res;
          }
          return this.roles ;
        })
      );
  }

  getBanks(){
    return this.http
      .get<any>(BANKS_API_URL)
      .pipe(
        map(res => {
          if (res) {
            this.banks=res;
          }
          return this.banks ;
        })
      );
  }





}
