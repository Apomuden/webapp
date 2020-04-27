import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LaboratoryService {

  constructor(private http: HttpClient) { }

  getLabInvestigation(consultation_id: string, date: string) {
    const url = `${environment.apiBaseUrl}/registry/investigations`;
    return this.http.get<any>(url, {
      params: {
        'consultation_id': `${consultation_id}`,
        'consultation_date': date,
      }
    }).pipe(map(
      res => {
        if (res && res.data.length > 0) {
          return res.data[0];
        }
        throw new HttpErrorResponse({ status: 404 });
      }
    ));
  }
}
