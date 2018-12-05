import {
  Injectable,
} from '@angular/core';
import {
  Http,
  Headers,
  RequestOptions,
} from '@angular/http';
import {
  Observable,
} from 'rxjs/Observable';
import {
  ConfigService,
} from './service.config';
import { JwtHelperService } from '@auth0/angular-jwt';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class StudentsService {
  private options;
  private activate: Boolean;
  private user: any;

  constructor(private http: Http, public jwtHelper: JwtHelperService) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    });
    this.options = new RequestOptions({
      headers: headers,
    });
    this.user = jwtHelper.decodeToken(localStorage.getItem('token'));
  }

  getMe(): any {
    return this.user;
  }

  public setAcademyStatus(st_id, obj): Observable<any> {
    return this.http.put(
      ConfigService.STATIC_SERVER + `/users/${st_id}`,
      obj,
      this.options,
    )
    .map(res => res.json().data)
    .catch(this.handleError);
  }

  public getStudents(academyId, size, number, status?, name?): Observable<any> {
    let sqlStatus = '';
    let sqlName = '';
    if (status) {
      sqlStatus = `&filter[academy_status]=${status}`;
    }
    if (name) {
      sqlName = `&filter[first_name][like]=%${name}%`;
    }
    return this.http.get(
      encodeURI(ConfigService.STATIC_SERVER + `/users?include=belt_user.belt&filter[academy_id]=${academyId}${sqlStatus}${sqlName}&page[size]=${size}&page[number]=${number}`),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getUserData(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/users/me',
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getSybscriptionsByAcademy(id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/subscriptions?filter[academy_id]=${id}`,
      this.options,
    )
    .map(res => res.json().data)
    .catch(this.handleError);
  }

  public signUp(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + `/user_subscriptions`,
      obj,
      this.options,
    )
    .map(res => res.json().data)
    .catch(this.handleError);
  }


  private handleError(error: any) {
    return Observable.throw(error.message || error);
  }
}
