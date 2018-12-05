import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../service.config';
import { Router } from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { ClolorsBelt, Belts } from '../../../components/belts';

@Injectable()
export class AuthService {
  private options;
  private activate: Boolean;
  private user: any;

  constructor(public jwtHelper: JwtHelperService, private http: Http, private router: Router) {
    const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') });
    this.options = new RequestOptions({headers: headers});
    if (localStorage.getItem('token')) {
      this.user = jwtHelper.decodeToken(localStorage.getItem('token'));
    }else {
      this.router.navigate(['/auth/login']);
    }
  }

  public getAcademiesByName(name): any {
    const academies = this.http.get(
      encodeURI(ConfigService.STATIC_SERVER + '/academies?filter[name][like]=' + `%${name}%` + '&sort=name'),
      this.options,
    )
    .map(res => {
      let academies = [];
      res.json().data.forEach(function(el, i, arr){
        academies.push({id: el.id, text: el.name});
      });
      return academies;
    }).debounceTime(1000);
    return academies;
  }
  public getAcademiesLimit(limit): any {
    const academies = this.http.get(
      ConfigService.STATIC_SERVER + '/academies?page[size]=' + limit + '&sort=name',
      this.options,
    )
    .map(res => {
      let academies = [];
      res.json().data.forEach(function(el, i, arr){
        academies.push({id: el.id, text: el.name});
      });
      return academies;
    });
    return academies;
  }

  public getBeltStipiesBycolorId(colorId): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/belts?filter[belt_color_id]=' + colorId + '&sort=stripe',
      this.options,
    )
    .map(res => {
      const belts = [];
      res.json().data.forEach(function(el){
        belts.push({
          id: el.id,
          colorId: el.belt_color_id,
          source: ConfigService.URL_SERVER + el.sourse,
          name: el.name,
          stripe: el.stripies,
        });
      });
      return belts;
    })
    .catch(this.handleError);
  }

  public getBeltColors(type): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/belt_colors?sort=id&filter[type][in]=${type}`,
      this.options,
    )
    .map(res => res.json().data)
    .catch(this.handleError);
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return !this.jwtHelper.isTokenExpired(token);
    }else {
      this.router.navigate(['/auth/login']);
    }
    return false;
  }

  public getTokenData(): any {
    const token = localStorage.getItem('token');
    if (token) {
      return this.jwtHelper.decodeToken(token);
    }
    return false;
  }

  public setToken(token, active_token): boolean {
    localStorage.setItem('token', token);
    localStorage.setItem('active_token', active_token);
    return true;
  }
  public getUserMe(): Observable<any> {
    console.log('auth.service ', this.options);
    return this.http.get(
      ConfigService.STATIC_SERVER + '/users/me',
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getUserProfile(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/users/me',
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public signup(obj): Observable<any> {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.post(
      ConfigService.STATIC_SERVER + '/auth/signup',
      JSON.stringify(obj),
      options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public editProfile(obj): Observable<any> {
    const headers = new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    });
    const options = new RequestOptions({headers: headers});
    return this.http.put(
      ConfigService.STATIC_SERVER + '/users/' + this.user.id,
      obj,
      options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public login(obj): Observable<any> {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.post(
      ConfigService.STATIC_SERVER + '/auth/signin',
      JSON.stringify(obj),
      options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public forgotSend(obj): Observable<any> {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.post(
      ConfigService.STATIC_SERVER + '/auth/forgot',
      JSON.stringify(obj),
      options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getAcademies(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/academies?sort=name',
      this.options,
    )
    .map(res => {
      const academies = [];
      res.json().data.forEach(function(el, i, arr){
        academies.push({id: el.id, text: el.name});
      });
      return academies;
    })
    .catch(this.handleError);
  }

  public ResetPassword(obj, kode): Observable<any> {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.post(
      ConfigService.STATIC_SERVER + '/auth/reset_password/' + kode,
      JSON.stringify(obj),
      options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public activeUser(kode): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/auth/activate_user/' + kode,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public sendConfirmation(obj): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') });
    this.options = new RequestOptions({headers: headers});
    return this.http.post(
      ConfigService.STATIC_SERVER + '/auth/send_confirmation',
      JSON.stringify(obj),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getBelts(age): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/belts' + '?filter[age_begin][lte]=' + age + '&filter[age_end][gte]=' + age,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }



  private handleError(error: any) {
    return Observable.throw(error.message || error);
  }
}
