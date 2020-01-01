import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const ROLES_API_URL = environment.apiBaseUrl + '/auth/roles';
@Injectable({
  providedIn: 'root'
})
export class RolesService {
  roles = null;
  constructor(private http: HttpClient) {}

  getRoles() {
    return this.http.get<any>(ROLES_API_URL).pipe(
      map(res => {
        if (res) {
          this.roles = res.data;
        }
        return this.roles;
      })
    );
  }
}
