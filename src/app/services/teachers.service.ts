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
export class TeachersService {
  private options;
  private activate: Boolean;

  constructor(private http: Http, public jwtHelper: JwtHelperService) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    });
    this.options = new RequestOptions({
      headers: headers,
    });
  }

  public getTeachersByAcademy(id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/teachers?filter[academy_id]=${id}`,
      this.options,
    )
    .map(res => res.json().data)
    .catch(this.handleError);
  }
  public updateTeacher(id, obj): Observable<any> {
    return this.http.put(
      ConfigService.STATIC_SERVER + '/teachers/' + id,
      JSON.stringify(obj),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public createTeacher(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + '/teachers',
      JSON.stringify(obj),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public removeTeacher(id): Observable<any> {
    return this.http.delete(
      ConfigService.STATIC_SERVER + '/teachers/'+id,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getAcademies(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/academies',
      this.options,
    )
    .map(res => {
      let academies = [
        {
          id: '0',
          text: 'All Academy',
        },
      ];
      res.json().data.forEach(function(el, i, arr){
        academies.push({id: el.id, text: el.name});
      });
      return academies;
    })
    .catch(this.handleError);
  }

  public getTeacherById(id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/teachers?filter[id]=' + id,
      this.options,
    )
    .map(res => res.json().data[0])
    .catch(this.handleError);
  }

  public getTeachers(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/teachers',
      this.options,
    )
    .map(res => res.json().data)
    .catch(this.handleError);
  }



  private handleError(error: any) {
    return Observable.throw(error.message || error);
  }
}
