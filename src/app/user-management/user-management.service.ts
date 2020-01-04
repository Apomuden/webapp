import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const USER_API_URL = environment.apiBaseUrl + '/auth/profiles';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  users = [];
  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get<any>(USER_API_URL).pipe(
      map(
        res => {
          if (res) {
            this.users = res.data;
          }
          return this.users;
        }
      )
    )
  }
}
