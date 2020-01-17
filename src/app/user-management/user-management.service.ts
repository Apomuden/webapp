import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const USER_API_URL = environment.apiBaseUrl + '/auth/profiles';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  data: any;
  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get<any>(USER_API_URL).pipe(
      map(
        res => {
          if (res) {
            this.data = res;
          }
          return this.data;
        }
      )
    );
  }

  getUsersPagination(url: string) {
    return this.http.get<any>(url).pipe(
      map(
        res => {
          if (res) {
            this.data = res;
          }
          return this.data;
        }
      )
    );
  }

  getUserDetails(userId: string) {
    const url = USER_API_URL + '/' + userId;
    return this.http.get<any>(url).pipe(
      map(
        res => {
          if (res) {
            this.data = res;
          }
          return this.data;
        }
      )
    );
  }

  createUser(userData: any) {
    return this.http.post<any>(USER_API_URL, userData).pipe(
      map(
        res => {
          if (res) {
            this.data = res;
          }
          return this.data;
        }
      )
    );
  }

  addProfileDoc(documentData: any) {
    return this.http.post<any>(`${environment.apiBaseUrl}/auth/profiledocuments`, documentData).pipe(
      map(
        res => {
          if (res) {
            this.data = res;
          }
          return this.data;
        }
      )
    );
  }

  createNextOfKin(data: any) {
    return this.http.post<any>(`${environment.apiBaseUrl}/setups/profilenextofkins`, data).pipe(
      map(
        res => {
          if (res) {
            this.data = res;
          }
          return this.data;
        }
      )
    );
  }

}
