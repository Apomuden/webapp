import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PhysicianService {

  private consultationDateSubject = new BehaviorSubject<Date>(new Date());
  readonly consultationDate$ = this.consultationDateSubject.asObservable();

  constructor(private http: HttpClient) { }

  setConsultationDate(date: Date) {
    if (!date) {
      return;
    }
    this.consultationDateSubject.next(date);
  }

  getAttendance(folderNo = '', attendanceDate: string) {
    const url = `${environment.apiBaseUrl}/registry/attendance/byfolder`;
    return this.http.get<any>(url, {
      params: {
        'folder_no': `=${folderNo}`,
        'attendance_date': `>=${attendanceDate}`
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

  getConsultation(patientId = '', attendanceDate: string) {
    const url = `${environment.apiBaseUrl}/registry/consultationservicerequests`;
    return this.http.get<any>(url, {
      params: {
        'patient_id': `=${patientId}`,
        'attendance_date': `>=${attendanceDate}`
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
    const url = `${environment.apiBaseUrl}/registry/patientvitals/byattendancedate`;
    return this.http.get<any>(url, {
      params: {
        'patient_id': `=${patient_id}`,
        'attendance_date': `>=${attendance_date}`,
      }
    }).pipe(map(
      res => {
        if (res && res.data && res.data.length > 0) {
          return res.data[0];
        }
        throw new HttpErrorResponse({ status: 404 });
      }
    ));
  }

  savePatientHistory(data: any) {
    const url = `${environment.apiBaseUrl}/registry/patienthistories`;
    return this.http.post<any>(url, data);
  }

  getPatientHistories(patient_id: any) {
    const url = `${environment.apiBaseUrl}/registry/patienthistories`;
    return this.http.get<any>(url, {
      params: {
        'patient_id': patient_id,
      }
    }).pipe(map(
      res => {
        if (res && res.data && res.data.length > 0) {
          return res.data;
        }
        throw new HttpErrorResponse({ status: 404 });
      }
    ));
  }

  savePatientHistorySummary(data: any) {
    const url = `${environment.apiBaseUrl}/registry/patienthistorysummaries`;
    return this.http.post<any>(url, data);
  }

  getPatientHistorySummary(patient_id: number) {
    const url = `${environment.apiBaseUrl}/registry/patienthistorysummaries/${patient_id}`;
    return this.http.get<any>(url).pipe(map(
      res => {
        if (res && res.data) {
          return res.data;
        }
        throw new HttpErrorResponse({ status: 404 });
      }
    ));
  }

  getPhysicalExams(patient_id: any) {
    const url = `${environment.apiBaseUrl}/registry/physicalexaminations`;
    return this.http.get<any>(url, {
      params: {
        'patient_id': patient_id,
      }
    }).pipe(map(
      res => {
        if (res && res.data && res.data.length > 0) {
          return res.data;
        }
        throw new HttpErrorResponse({ status: 404 });
      }
    ));
  }

  savePhysicalExams(data: any, isUpdating = false, examId = 0) {
    let url = `${environment.apiBaseUrl}/registry/physicalexaminations/multiple`;
    if (!isUpdating) {
      return this.http.post<any>(url, data);
    } else {
      url += `/${examId}`;
      return this.http.put<any>(url, data);
    }
  }

  getPhysicalExamCategories() {
    const url = `${environment.apiBaseUrl}/setups/physicalexaminationcategories`;
    return this.http.get<any>(url).pipe(map(
      res => {
        if (res && res.data && res.data.length > 0) {
          return res.data;
        }
        throw new HttpErrorResponse({ status: 404 });
      }
    ));
  }

  getIllnessTypes() {
    const url = `${environment.apiBaseUrl}/setups/illnesstypes`;
    return this.http.get<any>(url, {
      params: {
        status: 'ACTIVE'
      }
    }).pipe(map(
      res => {
        if (res && res.data && res.data.length > 0) {
          return res.data;
        }
        throw new HttpErrorResponse({ status: 404 });
      }
    ));
  }
}
