import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {catchError, first, map} from 'rxjs/operators';
import {BehaviorSubject, of} from 'rxjs';
import {GetPayload} from "../../shared/models/payload.model";
import {ConsultationQuestionResponse} from "../../shared/models/consultation-questionnaire.model";

@Injectable({providedIn: 'root'})
export class PhysicianService {

  private consultationDateSubject = new BehaviorSubject<Date>(new Date());
  readonly consultationDate$ = this.consultationDateSubject.asObservable();

  constructor(private http: HttpClient) {
  }

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
        throw new HttpErrorResponse({});
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
        throw new HttpErrorResponse({});
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
        throw new HttpErrorResponse({});
      }
    ));
  }

  getPatientVitals(patient_id = '', attendance_date: string) {
    const url = `${environment.apiBaseUrl}/registry/patientvitals/byattendancedate/${attendance_date}`;
    return this.http.get<any>(url, {
      params: {
        'patient_id': `${patient_id}`,
      }
    }).pipe(map(
      res => {
        if (res && res.data && res.data.length > 0) {
          return res.data[0];
        }
        throw new HttpErrorResponse({});
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
        throw new HttpErrorResponse({});
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
        throw new HttpErrorResponse({});
      }
    ));
  }

  saveDiagnosis(data: any) {
    const url = `${environment.apiBaseUrl}/registry/diagnoses/multiple`;
    return this.http.post<any>(url, data);
  }

  getDiagnosis(patient_id: any) {
    console.log(`patientId: ${patient_id}`);
    const url = `${environment.apiBaseUrl}/registry/diagnoses`;
    return this.http.get<any>(url, {
      params: {
        'patient_id': patient_id,
      }
    }).pipe(map(
      res => {
        if (res && res.data && res.data.length > 0) {
          return res.data;
        }

        throw new HttpErrorResponse({});
      }
    ));
  }

  saveInvestigations(data: any) {
    const url = `${environment.apiBaseUrl}/registry/investigations/multiple`;
    return this.http.post<any>(url, data);
  }

  getInvestigations(patient_id: any) {
    console.log(`patientId: ${patient_id}`);
    const url = `${environment.apiBaseUrl}/registry/investigations`;
    return this.http.get<any>(url, {
      params: {
        'patient_id': patient_id,
      }
    }).pipe(map(
      res => {
        if (res && res.data && res.data.length > 0) {
          return res.data;
        }

        throw new HttpErrorResponse({});
      }
    ));
  }

  getProcedures(patient_id: any) {
    console.log(`patientId: ${patient_id}`);
    const url = `${environment.apiBaseUrl}/registry/procedures`;
    return this.http.get<any>(url, {
      params: {
        'patient_id': patient_id,
      }
    }).pipe(map(
      res => {
        if (res && res.data && res.data.length > 0) {
          return res.data;
        }

        throw new HttpErrorResponse({});
      }
    ));
  }

  saveProcedures(data: any) {
    const url = `${environment.apiBaseUrl}/registry/procedures/multiple`;
    return this.http.post<any>(url, data);
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
        throw new HttpErrorResponse({});
      }
    ));
  }

  savePhysicalExams(data: any) {
    let url = `${environment.apiBaseUrl}/registry/physicalexaminations/multiple`;
    return this.http.post<any>(url, data);
  }

  getPhysicalExamCategories() {
    const url = `${environment.apiBaseUrl}/setups/physicalexaminationcategories`;
    return this.http.get<any>(url).pipe(map(
      res => {
        if (res && res.data && res.data.length > 0) {
          return res.data;
        }
        throw new HttpErrorResponse({});
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
        throw new HttpErrorResponse({});
      }
    ));
  }

  getQuestionResponses(patient_id: any) {
    const url = `${environment.apiBaseUrl}/registry/consultationquestionresponses`;
    const options = {
      params: {
        'patient_id': patient_id
      }
    }
    return this.http.get<GetPayload<ConsultationQuestionResponse[]>>(url, options).pipe(first(), map(
      res => {
        if (res && res.data && res.data.length > 0) {
          return res.data;
        }
        throw new HttpErrorResponse({});
      }
    ), catchError(_ => of([])));
  }

  saveQuestionResponse(data: any) {
    const url = `${environment.apiBaseUrl}/registry/consultationquestionresponses`;
    return this.http.post<boolean>(url, data).pipe(first(), map(res => !!res), catchError(_ => of(console.log(_))));
  }
}
