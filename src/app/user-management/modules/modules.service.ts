import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const MODULE_API_URL = environment.apiBaseUrl + '/auth/modules';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {
  modules = [];
  constructor(private http: HttpClient) {

  }

  getModules() {
    return this.http.get<any>(MODULE_API_URL).pipe(
      map(
        res => {
          if (res) {
            this.modules = res.data;
          }
          return this.modules;
        }
      )
    );
  }
}
