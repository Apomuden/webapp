import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../interfaces/user.type';
import jwt_decode from 'jwt-decode';

const USER_AUTH_API_URL = environment.apiBaseUrl + '/auth/login';
const LOGOUT_API = environment.apiBaseUrl + '/auth/logout';

@Injectable()
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
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
            console.log('result', res);
            this.decodedUser = jwt_decode(res.data.access_token);
            this.decodedUser.token = res.data.access_token;
            this.decodedUser.details = res.data.profile;
            localStorage.setItem(
              'currentUser',
              JSON.stringify(this.decodedUser)
            );

            this.currentUserSubject.next(this.decodedUser);
          }
          return this.decodedUser;
        })
      );
  }

  logout() {
    this.http
      .post<any>(LOGOUT_API, {})
      .pipe(
        map(res => {
          if (res) {
            console.log(res);
            localStorage.removeItem('currentUser');
            this.currentUserSubject.next(null);
            this.router.navigate(['authentication/login']);
          }
        })
      )
      .subscribe();
  }
}
