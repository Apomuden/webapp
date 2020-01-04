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
  constructor(private http: HttpClient) { }

  getRoles() {
    return this.http.get<any>(ROLES_API_URL).pipe(
      map(res => {
        if (res) {
          console.log(res);
          this.roles = res.data;
        }
        return this.roles;
      })
    );
  }

  attachModulesToRole(role_id: number, modules: Array<number>) {
    const url = ROLES_API_URL + `/${role_id}/attachmodules`;
    return this.http.put(url, { module_ids: modules }).pipe(map(
      res => {
        if (res) {
          console.log(res);
          return true;
        }
        return false;
      }
    ));
  }

  detachModulesFromRole(role_id: number, modules: Array<number>) {
    const url = ROLES_API_URL + `/${role_id}/detachmodules`;
    return this.http.put(url, { module_ids: modules }).pipe(map(
      res => {
        if (res) {
          console.log(res);
          return true;
        }
        return false;
      }
    ));
  }

  attachPermissionsToRole(role_id: number, permissions: Array<number>) {
    const url = ROLES_API_URL + `/${role_id}/attachpermissions`;
    return this.http.put(url, { permission_ids: permissions }).pipe(map(
      res => {
        if (res) {
          console.log(res);
          return true;
        }
        return false;
      }
    ));
  }

  detachPermissionsFromRole(role_id: number, permissions: Array<number>) {
    const url = ROLES_API_URL + `/${role_id}/detachpermissions`;
    return this.http.put(url, { permission_ids: permissions }).pipe(map(
      res => {
        if (res) {
          console.log(res);
          return true;
        }
        return false;
      }
    ));
  }

  attachSystemComponentsToRole(role_id: number, components: Array<number>) {
    const url = ROLES_API_URL + `/${role_id}/attachcomponents`;
    return this.http.put(url, { component_ids: components }).pipe(map(
      res => {
        if (res) {
          console.log(res);
          return true;
        }
        return false;
      }
    ));
  }

  detachSystemComponentsFromRole(role_id: number, modules: Array<number>) {
    const url = ROLES_API_URL + `/${role_id}/detachcomponents`;
    return this.http.put(url, { component_ids: modules }).pipe(map(
      res => {
        if (res) {
          console.log(res);
          return true;
        }
        return false;
      }
    ));
  }
}
