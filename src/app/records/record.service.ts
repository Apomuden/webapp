import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
const PATIENT_API_URL = environment.apiBaseUrl + '/registry/patients';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  patients: any;

  constructor(private http: HttpClient) { }

  getAllPatients(query = '') {

    const url = PATIENT_API_URL + query;


    return this.http.get<any>(url).pipe(map(
      res => {
        if (res) {
          this.patients = res;
        }
        return this.patients;
      }
    ));
  }

  getPatientsPagination(url: string) {
    return this.http.get<any>(url).pipe(
      map(
        res => {
          if (res) {
            this.patients = res;
          }
          return this.patients;
        }
      )
    );
  }
}
