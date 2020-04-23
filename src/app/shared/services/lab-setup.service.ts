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

  getParamFlags(paramId: number) {
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

  createParameter(data: any) {
    return this.http.post<boolean>(`${LAB_URL}/parameters`, data)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  deleteParameter(id: number) {
    return this.http.delete<boolean>(`${LAB_URL}/parameters/${id}`)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  editLabParameter(id: number, data: any) {
    return this.http.put<boolean>(`${LAB_URL}/parameters/${id}`, data)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  createParamFlag(data: any) {
    return this.http.post<boolean>(`${LAB_URL}/parameters/ranges`, data)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  deleteParamFlag(id: number) {
    return this.http.delete<boolean>(`${LAB_URL}/parameters/ranges/${id}`)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  editParamFlag(id: number, data: any) {
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
        service_category_id: '2',
        // service_category: 'laboratory',
        // status: 'ACTIVE'
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

  deleteLabParam(labId: number, params: any[]) {
    const url = `${environment.apiBaseUrl}/labs/services/${labId}/parameters`;
    const options = {
      params: {},
      body: { parameters: params }
    };
    return this.http.delete<boolean>(url, options)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  createLabParam(labId: number, params: any[]) {
    const url = `${environment.apiBaseUrl}/labs/services/${labId}/parameters`;
    return this.http.post<boolean>(url, {
      parameters: params
    })
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  createLabSampleType(labId: number, sampleTypes: any[]) {
    const url = `${environment.apiBaseUrl}/labs/services/${labId}/sampletypes`;
    return this.http.post<boolean>(url, {
      sample_types: sampleTypes
    })
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }

  getLabSampleTypes(labId: number) {
    const url = `${environment.apiBaseUrl}/labs/services/${labId}/sampletypes`;
    return this.http.get<any>(url).pipe(
      map(res => {
        if (res && res.data.length > 0) {
          return res.data;
        }
        return [];
      }), catchError(_ => of([])), first()
    );
  }

  deleteLabSampleType(labId: number, sampleTypes: any[]) {
    const url = `${environment.apiBaseUrl}/labs/services/${labId}/sampletypes`;
    const options = {
      params: {},
      body: { sample_types: sampleTypes }
    };
    return this.http.delete<boolean>(url, options)
      .pipe(map(res => !!res), first(), catchError(_ => of(false)));
  }
}
