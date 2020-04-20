import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { first, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

const LAB_URL = `${environment.apiBaseUrl}/labs`;

@Injectable({
  providedIn: 'root'
})
export class LabSetupService {

  constructor(private http: HttpClient) { }

  getParameters() {
    return this.http.get<any>(`${LAB_URL}/parameters`)
      .pipe(map(res => {
        if (res && res.data && res.data.length > 0) {
          res.data.forEach(param => {
            param.isActivated = param.status === 'ACTIVE';
          });
          return res.data;
        } else {
          return [];
        }
      }), first(), catchError(_ => of([])));
  }

  getParamRanges(paramId: number) {
    return this.http.get<any>(`${LAB_URL}/parameters/ranges`, {
      params: {
        lab_parameter_id: `${paramId}`
      }
    })
      .pipe(map(res => {
        if (res && res.data && res.data.length > 0) {
          res.data.forEach(range => {
            range.isActivated = range.status === 'ACTIVE';
          });
          return res.data;
        } else {
          return [];
        }
      }), first(), catchError(_ => of([])));
  }

  createLabParameter(data: any) {
    return this.http.post<boolean>(`${LAB_URL}/parameters`, data)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  deleteLabParameter(id: number) {
    return this.http.delete<boolean>(`${LAB_URL}/parameters/${id}`)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  editLabParameter(id: number, data: any) {
    return this.http.put<boolean>(`${LAB_URL}/parameters/${id}`, data)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  createParamRange(data: any) {
    return this.http.post<boolean>(`${LAB_URL}/parameters/ranges`, data)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  deleteParamRange(id: number) {
    return this.http.delete<boolean>(`${LAB_URL}/parameters/ranges/${id}`)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  editParamRange(id: number, data: any) {
    return this.http.put<boolean>(`${LAB_URL}/parameters/ranges/${id}`, data)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  getSampleTypes() {
    return this.http.get<any>(`${LAB_URL}/sampletypes`)
      .pipe(map(res => {
        if (res && res.data && res.data.length > 0) {
          res.data.forEach(type => {
            type.isActivated = type.status === 'ACTIVE';
          });
          return res.data;
        } else {
          return [];
        }
      }), first(), catchError(_ => of([])));
  }

  createSampleType(data: any) {
    return this.http.post<boolean>(`${LAB_URL}/sampletypes`, data)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  deleteSampleType(id: number) {
    return this.http.delete<boolean>(`${LAB_URL}/sampletypes/${id}`)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  editSampleType(id: number, data: any) {
    return this.http.put<boolean>(`${LAB_URL}/sampletypes/${id}`, data)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  getLabs() {
    const url = `${environment.apiBaseUrl}/pricing/services`;
    return this.http.get<any>(url, {
      params: {
        service_category: 'laboratory',
        status: 'ACTIVE'
      }
    }).pipe(
      map(res => {
        if (res && res.data.length > 0) {
          return res.data;
        }
        return [];
      }), catchError(_ => of([])), first()
    );
  }

  getLabParams(labId: number) {
    const url = `${environment.apiBaseUrl}/labs/services/${labId}/parameters`;
    return this.http.get<any>(url).pipe(
      map(res => {
        if (res && res.data.length > 0) {
          return res.data;
        }
        return [];
      }), catchError(_ => of([])), first()
    );
  }

  mapLabParam(labId: number, params: any[]) {
    const url = `${environment.apiBaseUrl}/labs/services/${labId}/parameters`;
    return this.http.post<boolean>(url, {
      parameters: params
    })
    .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }
}
