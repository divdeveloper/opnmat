import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router, public jwtHelper: JwtHelperService) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('token');

    const tokenPayload = this.auth.getTokenData();

    if (tokenPayload && !this.auth.isAuthenticated() || tokenPayload.role !== expectedRole ) {
      this.router.navigate(['admin-auth']);
      return false;
    }
    return true;
  }
}
