import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import {
  Router,
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      const current_time = new Date().getTime() / 1000;
      if (current_time > currentUser.exp) {
        this.router.navigate(['authentication/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }

      return true;
    }
    this.router.navigate(['authentication/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;

    // return false;
  }
}
