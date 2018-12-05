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
export class ProfileService {
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

  public updateUserById(id, obj): Observable<any> {
    return this.http.put(
      ConfigService.STATIC_SERVER + '/users/' + id,
      JSON.stringify(obj),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getUserPhotos(user_id, limit, page): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/post_files?filter[user_id]=${user_id}&filter[type]=image&page[size]=${limit}&page[number]=${page}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  public getUserVideos(user_id, limit, page): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/post_files?filter[user_id]=${user_id}&filter[type]=video&page[size]=${limit}&page[number]=${page}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  public getUserFollowers(user_id, limit, page, name): Observable<any> {
    let filterName = '';
    if (name && name != '') {
      filterName = `&filter[full_name][like]=%${name}%`;
    }
    return this.http.get(
      encodeURI(ConfigService.STATIC_SERVER + `/followers/users/${user_id}?page[size]=${limit}&page[number]=${page}&include=academy,belts,followers${filterName}`),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  public getUserFollowings(user_id, limit, page, name): Observable<any> {
    let filterName = '';
    if (name && name != '') {
      filterName = `&filter[first_name][like]=%${name}%`;
    }
    return this.http.get(
      encodeURI(ConfigService.STATIC_SERVER + `/followings/users/${user_id}?page[size]=${limit}&page[number]=${page}&include=academy,belts,followers${filterName}`),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  getServerUrl(): String {
    return ConfigService.URL_SERVER;
  }

  public changeFollow(id, obj): Observable<any> {
    return this.http.put(
      ConfigService.STATIC_SERVER + `/followers/${id}`,
      obj,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getAademiesInfo(user) {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/user_academy_info?filter[user_id]=${user}&sort=-begin_date`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  public removeAademiesInfo(id) {
    return this.http.delete(
      ConfigService.STATIC_SERVER + `/user_academy_info/${id}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public saveAademyInfo(academy) {
    return this.http.post(
      ConfigService.STATIC_SERVER + `/user_academy_info`,
      academy,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getPrizesInfo(user) {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/user_prizes_info?filter[user_id]=${user}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public removePrizesInfo(id) {
    return this.http.delete(
      ConfigService.STATIC_SERVER + `/user_prizes_info/${id}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  public savePrizesInfo(prize) {
    return this.http.post(
      ConfigService.STATIC_SERVER + `/user_prizes_info`,
      prize,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public addFollowingMe(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + `/followings/add`,
      obj,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public removeFollowingMe(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + `/followings/remove`,
      obj,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public addFollowMe(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + `/followers/add`,
      obj,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public removeFollowMe(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + `/followers/remove`,
      obj,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  public isFollower(id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/followings/status/${id}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  private handleError(error: any) {
    return Observable.throw(error.message || error);
  }
}
