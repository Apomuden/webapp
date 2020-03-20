import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class OpdService {

  constructor(private http: HttpClient) { }

  getQueue(queuePath: string) {
    const url = `${environment.apiBaseUrl}${queuePath}`;
    return this.http.get<any>(url).pipe(map(
      res => {
        if (res && res.data) {
          return res.data;
        }
        throw new HttpErrorResponse({ status: 500 });
      }
    ));
  }

  getAttendance(folderNo = '', attendanceDate: string) {
    console.log(attendanceDate);
    const url = `${environment.apiBaseUrl}/registry/attendance/byfolder`;
    return this.http.get<any>(url, {
      params: {
        'folder_no': folderNo,
        'attendance_date': attendanceDate
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

  getConsultation(folderNo = '', attendanceDate: string) {
    const url = `${environment.apiBaseUrl}/registry/consultationservicerequests`;
    return this.http.get<any>(url, {
      params: {
        'folder_no': folderNo,
        'attendance_date': attendanceDate
      },
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

  getPatientVitals(patient_id = '', attendance_date: string) {
    const url = `${environment.apiBaseUrl}/registry/patientvitals`;
    return this.http.get<any>(url, {
      params: {
        'patient_id': patient_id,
        'created_at': attendance_date,
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

  saveVitals(data: any) {
    const url = `${environment.apiBaseUrl}/registry/patientvitals`;
    return this.http.post(url, data);
  }
}
