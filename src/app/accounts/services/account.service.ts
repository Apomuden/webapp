import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) {

  }

  getServiceOrdersForPatient(patientId) {
    return this.http.get<any>(`${environment.apiBaseUrl}/accounts/transactions/patients/${patientId}/quickdetails`).toPromise();
  }
  createEreceipt(data) {
    return this.http.post<any>(`${environment.apiBaseUrl}/accounts/transactions/ereceipt`, data).toPromise();
  }

}
