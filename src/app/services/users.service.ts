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
export class UsersService {
  private options;
  private activate: Boolean;
  private user: Number;

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

  public getUserMe(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/users/me',
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getUsers(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/users',
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public updateUsers(id, obj): Observable<any> {
    return this.http.put(
      ConfigService.STATIC_SERVER + '/users/' + id,
      JSON.stringify(obj),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getUserById(id) {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/users?filter[id]=' + id,
      this.options,
    )
    .map(res => res.json().data[0])
    .catch(this.handleError);
  }

  public resetPasword(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + '/auth/forgot',
      JSON.stringify(obj),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  private handleError(error: any) {
    return Observable.throw(error.message || error);
  }
}
