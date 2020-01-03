import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const PERMISSION_API_URL = environment.apiBaseUrl + '/auth/permissions';
@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  permissions = [];
  constructor(private http: HttpClient) { }
  getPermissions() {
    return this.http.get<any>(PERMISSION_API_URL).pipe(map(
      res => {
        if (res) {
          this.permissions = res.data;
        }
        return this.permissions;
      }
    ));
  }

}
