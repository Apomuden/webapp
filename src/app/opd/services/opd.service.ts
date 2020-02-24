import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class OpdService {

  constructor(private http: HttpClient) { }

  getPatient(query = '') {
    const url = `${environment.apiBaseUrl}/registry/patients/single?${query}`;
    return this.http.get<any>(url).pipe(map(
      res => {
        if (res) {
          return res.data;
        }
        throw new HttpErrorResponse({ status: 404 });
      }
    ));
  }
}
