import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const SYSTEM_COMPONENT_API_URL = environment.apiBaseUrl + '/auth/components';
@Injectable({
  providedIn: 'root'
})
export class SystemComponentsService {
  components = [];
  constructor(private http: HttpClient) {

  }

  getSystemComponents() {
    return this.http.get<any>(SYSTEM_COMPONENT_API_URL).pipe(
      map(
        res => {
          if (res) {
            this.components = res.data;
          }
          return this.components;
        }
      )
    );
  }
}
