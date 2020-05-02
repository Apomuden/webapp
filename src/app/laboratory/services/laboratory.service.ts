import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, first, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LaboratoryService {
  readonly investigationUrl = `${environment.apiBaseUrl}/registry/investigations`;

  constructor(private http: HttpClient) { }

  getLabInvestigation(consultation_id: string, date: string) {
    return this.http.get<any>(this.investigationUrl, {
      params: {
        'consultation_id': `${consultation_id}`,
        'consultation_date': date,
      }
    }).pipe(map(
      res => {
        if (res && res.data.length > 0) {
          return res.data;
        }
        throw new HttpErrorResponse({ status: 404 });
      }
    ), first());
  }

  updateLabRequest(id: number, data: any) {
    return this.http.put<any>(`${this.investigationUrl}/${id}`, data).pipe(map(
      res => {
        if (res && res.data) {
          return res.data;
        }
        throw new HttpErrorResponse({});
      }
    ), first());
  }

  newSampleCode(investigation_id: number, sample_type_id: number) {
    const url = `${environment.apiBaseUrl}/labs/investigations/` +
      `${investigation_id}/samplestypes/${sample_type_id}/newcode`;
    return this.http.get<any>(url).pipe(map(
      res => {
        if (res && res.data) {
          return res.data;
        }
        throw new HttpErrorResponse({});
      }
    ), first());
  }

  createSample(data: any) {
    const url = `${environment.apiBaseUrl}/labs/samples`;
    return this.http.post<any>(url, data).pipe(map(
      res => {
        if (res && res.data) {
          return res.data;
        }
        throw new HttpErrorResponse({});
      }
    ), first());
  }

  getSample(investigation: any) {
    const url = `${environment.apiBaseUrl}/labs/samples`;
    return this.http.get<any>(url, {
      params: {
        investigation_id: investigation.id,
        service_id: investigation.service_id
      }
    }).pipe(map(
      res => {
        if (res && res.data && res.data.length > 0) {
          return res.data[0];
        }
        throw new HttpErrorResponse({});
      }
    ), first());
  }

  saveLabResults(result: any) {
    const url = `${environment.apiBaseUrl}/labs/results/multiple`;
    return this.http.post<any>(url, result).pipe(map(
      res => {
        if (res && res.data) {
          return res.data;
        }
        throw new HttpErrorResponse({});
      }
    ), first());
  }

  getLabResults(investigation_id: number) {
    const url = `${environment.apiBaseUrl}/labs/investigations/${investigation_id}/results`;
    return this.http.get<any>(url).pipe(map(
      res => {
        if (res && res.data && res.data.results) {
          return res.data.results;
        } else {
          return [];
        }
      }
    ), first(), catchError(e => of([])));
  }
}
