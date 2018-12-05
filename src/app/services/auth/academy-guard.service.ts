import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AcademiesService } from '../academies.service';

@Injectable()
export class AcademyGuardService implements CanActivate {
  // constructor(private permissions: Permissions, private currentUser: UserToken) {}
  constructor(private academyService: AcademiesService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.academyService.checkUserInManager(route.params.id).map(res => {
      return res;
    });
  }
}
