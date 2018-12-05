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
export class TechniquesService {
  private options;

  constructor(private http: Http, public jwtHelper: JwtHelperService) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    });
    this.options = new RequestOptions({
      headers: headers,
    });
  }

  public getTechniquesByAcademy(id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/techniques?filter[academy_id]=${id}`,
      this.options,
    )
    .map(res => res.json().data)
    .catch(this.handleError);
  }


  public updateTechnique(id, obj): Observable<any> {
    return this.http.put(
      ConfigService.STATIC_SERVER + '/techniques/' + id,
      JSON.stringify(obj),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public createTechnique(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + '/techniques',
      JSON.stringify(obj),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public removeTechnique(id): Observable<any> {
    return this.http.delete(
      ConfigService.STATIC_SERVER + '/techniques/'+id,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getTechniques(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/techniques',
      this.options,
    )
    .map(res => res.json().data)
    .catch(this.handleError);
  }

  public getTechniqueById(id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/techniques?filter[id]=' + id,
      this.options,
    )
    .map(res => res.json().data[0])
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

  private handleError(error: any) {
    return Observable.throw(error.message || error);
  }
}
