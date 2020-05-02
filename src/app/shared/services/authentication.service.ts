import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, first, catchError } from 'rxjs/operators';

import { User } from '../interfaces/user.type';
import jwt_decode from 'jwt-decode';

const USER_AUTH_API_URL = environment.apiBaseUrl + '/auth/login';
const LOGOUT_API = environment.apiBaseUrl + '/auth/logout';
const USER_UPDATE_API = environment.apiBaseUrl + '/auth/profiles/';

@Injectable()
export class AuthenticationService {
  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private decodedUser;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(USER_AUTH_API_URL, { username, password })
      .pipe(
        map(res => {
          if (res && res.data.access_token) {
            this.decodedUser = jwt_decode(res.data.access_token);
            this.decodedUser.token = res.data.access_token;
            this.decodedUser.details = res.data.profile;
            localStorage.setItem(
              'currentUser',
              JSON.stringify(this.decodedUser)
            );

            this.currentUserSubject.next(this.decodedUser);
            this.getFacilityDetails().pipe(first()).subscribe();
          }
          return this.decodedUser;
        })
      );
  }

  getFacilityDetails(): Observable<any> {
    const url = `${environment.apiBaseUrl}/setups/hospital`;
    return this.http.get<any>(url).pipe(map(res => {
      if (res && res.data) {
        localStorage.setItem(
          'facilityDetails',
          JSON.stringify(res.data)
        );
      }
      return res.data;
    }
    ));
  }

  logoutOn401() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    if (this.router.url === 'authentication/login') { return; }
    this.router.navigate(['authentication/login']);
  }

  logout() {
    this.http
      .post<any>(LOGOUT_API, {})
      .pipe(
        map(res => {
          if (res) {
            localStorage.removeItem('currentUser');
            this.currentUserSubject.next(null);
            this.router.navigate(['authentication/login']);
          }
        })
      )
      .subscribe();
  }

  changePassword(password: string): Observable<any> {
    return this.http.put<any>(
      `${USER_UPDATE_API}${(this.currentUserValue.details as any).id}`,
      { password }
    );
  }
}
