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
import { findIndex } from 'lodash';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { DataService } from '../services/data.service';

@Injectable()
export class SubscriptionsService {
  private options;
  private activate: Boolean;
  private user: any;

  constructor(private http: Http,
              public jwtHelper: JwtHelperService,
              public dataService: DataService) {
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

  public cancelSabscription(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + `/subscriptions/canceled`,
      obj,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getSybscriptionsByUser(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/user_subscriptions?filter[user_id]=${this.user.id}&include=subscription&filter[status][not]=0`,
      this.options,
    )
    .map(res => res.json().data)
    .catch(this.handleError);
  }

  public getSybscriptionsByAcademy(id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/subscriptions?filter[academy_id]=${id}&include=users_subscription`,
      this.options,
    )
    .map(res => {
      return res.json().data.map(el => {
        el.member = false;
        el.joinLoader = false;
        if (findIndex(el.users_subscription, {user_id: this.user.id, status: 1}) >= 0) {
          el.member = true;
        }
        return el;
      });
    })
    .catch(this.handleError);
  }

  public paySabscription(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + `/subscriptions/pay`,
      obj,
      this.options,
    )
    .map(res => res.json())
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
    return Observable.throw(error.message || JSON.parse(error._body).errors[0] || error);
  }

  public getAcademySubscriptions(academy: number) {
      return this.dataService.getResponse(`/subscriptions?filter[academy_id]=${academy}`);
  }
}
