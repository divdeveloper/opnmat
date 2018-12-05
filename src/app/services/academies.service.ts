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

import { findIndex } from 'lodash';

@Injectable()
export class AcademiesService {
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

  public getUserMe(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/users/me',
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getAcademyFollowings(user_id, limit, page, name): Observable<any> {
    let filterName = '';
    if (name && name != '') {
      filterName = `&filter[name][like]=%${name}%`;
    }
    return this.http.get(
      encodeURI(ConfigService.STATIC_SERVER + `/followings/user/${user_id}/academies?page[size]=${limit}&page[number]=${page}&include=followers,students${filterName}`),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public upgradeToPro(id, obj): Observable<any> {
    return this.http.put(
      ConfigService.STATIC_SERVER + `/academies/${id}`,
      JSON.stringify(obj),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public checkUserInManager(academy_id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/academies/${academy_id}?include=managers`,
      this.options,
    )
    .map(res => {
        return res.json().user_id === this.user.id || findIndex(res.json().managers, ['user_id', this.user.id]) >= 0;
    })
    .catch(this.handleError);
  }
  public checkUserInManagerById(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/managers/?filter[user_id]=${this.user.id}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  public checkPro(academy_id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/academies/${academy_id}`,
      this.options,
    )
    .map(res => res.json().is_pro)
    .catch(this.handleError);
  }

  public addFollowAcademy(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + `/academy_followers/add`,
      obj,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public removeFollowAcademy(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + `/academy_followers/remove`,
      obj,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getAcademyPhotos(academy_id, limit, page): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/post_files?filter[academy_id]=${academy_id}&filter[type]=image&page[size]=${limit}&page[number]=${page}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  public getAcademyVideos(academy_id, limit, page): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/post_files?filter[academy_id]=${academy_id}&filter[type]=video&page[size]=${limit}&page[number]=${page}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  public getAcademyFollowers(id, limit, page, name?): Observable<any> {
    let filterName = '';
    if (name && name != '') {
      filterName = `&filter[full_name][like]=%${name}%`;
    }
    return this.http.get(
      encodeURI(ConfigService.STATIC_SERVER + `/academy_followers/users/${id}?page[size]=${limit}&page[number]=${page}&include=academy,belts,followers&${filterName}`),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getIsFollower(academy_id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/academy_followers/status/${academy_id}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
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

  public addAcademies(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + '/academies',
      JSON.stringify(obj),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  getMe(): any {
    return this.user;
  }

  public getAcademyById(id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/academies/${id}?include=followers`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  public editAcademyById(id, obj): Observable<any> {
    return this.http.put(
      ConfigService.STATIC_SERVER + `/academies/${id}`,
      JSON.stringify(obj),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getAcademyByUserId(user_id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/academies?filter[user_id]=' + user_id,
      this.options,
    )
    .map(res => res.json().data)
    .catch(this.handleError);
  }

  public getManagerAcademies(user_id){
      return this.http.post(
          ConfigService.STATIC_SERVER + '/managers/academies', {user_id: user_id}, this.options
      ).map(res => res.json().data)
  }

  public getAcademyByStatus(status): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/academies?filter[status]=' + status,
      this.options,
    )
    .map(res => res.json().data)
    .catch(this.handleError);
  }
  public confirmAcademy(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + '/academies/set_status',
      JSON.stringify(obj),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }


  public removeAcademyById(id): Observable<any> {
    return this.http.delete(
      ConfigService.STATIC_SERVER + '/academies/' + id,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public updateAcademies(id, obj): Observable<any> {
    return this.http.put(
      ConfigService.STATIC_SERVER + '/academies/' + id,
      JSON.stringify(obj),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  public getAcademies(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/academies?filter[status]=Accepted',
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getServerUrl(): String {
    return ConfigService.URL_SERVER;
  }

  private handleError(error: any) {
    return Observable.throw(error.message || error);
  }
}
