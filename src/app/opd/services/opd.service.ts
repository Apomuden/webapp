import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class OpdService {

  constructor(private http: HttpClient) { }

  getAttendance(folderNo = '') {
    const url = `${environment.apiBaseUrl}/registry/attendance/byfolder`;
    return this.http.get<any>(url, {
      params: {
        'folder_no': folderNo
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

  getPatient(folderNo = '') {
    const url = `${environment.apiBaseUrl}/registry/patients/single`;
    return this.http.get<any>(url, {
      params: {
        'folder_no': folderNo
      }
    }).pipe(map(
      res => {
        if (res) {
          return res.data;
        }
        throw new HttpErrorResponse({ status: 404 });
      }
    ));
  }
}
