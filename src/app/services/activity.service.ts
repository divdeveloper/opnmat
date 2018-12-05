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
import { Broadcaster } from './broadcaster';
import {format} from 'date-fns';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { id } from '@swimlane/ngx-charts/release/utils';

@Injectable()
export class ActivitiesService {
  private options;
  private activate: Boolean;
  private user: any;

  constructor(private http: Http,
    public jwtHelper: JwtHelperService,
    private broadcaster: Broadcaster,
  ) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    });
    this.options = new RequestOptions({
      headers: headers,
    });
    this.user = jwtHelper.decodeToken(localStorage.getItem('token'));
  }

  fire(data: string): void {
    this.broadcaster.broadcast(ActivitiesService, data);
  }

  on(): Observable<any> {
    return this.broadcaster.on<any>(ActivitiesService);
  }

  userId() {
    return this.user.id;
  }

  getMe(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/users/${this.user.id}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public payActivity(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + '/activities/pay',
      obj,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  public joinActivity(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + '/join_activity',
      obj,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getUserSubscriptions(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/user_subscriptions?filter[user_id]=${this.user.id}`,
      this.options,
    )
    .map(res => {
      return res.json().data.map(el => {
        return el.subscription_id;
      });
    })
    .catch(this.handleError);
  }

  public getClasssesByAcademy(size, number, academy_id, name?: String): Observable<any> {
    let filter = '';
    if ( name ) {
      filter = `&filter[name][like]=%${name}%`;
    }
    return this.http.get(
      encodeURI(ConfigService.STATIC_SERVER + `/activities/?filter[type]=class&filter[academy_id]=${academy_id}&page[size]=${size}&page[number]=${number}&include=subscriptions${filter}`),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getSubscriptionsByAcademy(academy_id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/subscriptions?filter[academy_id]=${academy_id}`,
      this.options,
    )
    .map(res => {
      return res.json().data.map(subscription => {
        return {
          id : subscription.id,
          itemName: subscription.name,
        };
      });
    })
    .catch(this.handleError);
  }
  public getTeachersByAcademy(academy_id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/teachers?filter[academy_id]=${academy_id}&filterOr[academy_id]=0`,
      this.options,
    )
    .map(res => {
      return res.json().data.map(teacher => {
        return {
          id : teacher.id,
          itemName: `${teacher.first_name} ${teacher.last_name}`,
        };
      });
    })
    .catch(this.handleError);
  }

  public getTechniquesByAcademy(academy_id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/techniques?filter[academy_id]=${academy_id}&filterOr[academy_id]=0`,
      this.options,
    )
    .map(res => {
      return res.json().data.map(techniques => {
        return {
          id : techniques.id,
          itemName: techniques.name,
        };
      });
    })
    .catch(this.handleError);
  }

  public getComments(comment_id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/activity_comments?filter[activity_id]=${comment_id}&include=user`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  public addComment(comment): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + '/activity_comments',
      comment,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  public getUserMe(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/users/me',
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getActivityById(a_id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/activities/${a_id}?include=join_activities.user,techniques,subscriptions,teachers,academy,join_activities.user.academy`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public removeActivity(id): Observable<any> {
    return this.http.delete(
      ConfigService.STATIC_SERVER + '/activities/' + id,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public createActivity(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + '/activities',
      JSON.stringify(obj),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public updateActivity(obj, id): Observable<any> {
    return this.http.put(
      ConfigService.STATIC_SERVER + `/activities/${id}`,
      JSON.stringify(obj),
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getAcademies(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/academies?sort=id',
      this.options,
    )
    .map(res => {
      const academies = [
        {
          id: '0',
          text: 'Academy',
        },
      ];
      res.json().data.forEach(function(el, i, arr){
        academies.push({id: el.id, text: el.name});
      });
      return academies;
    })
    .catch(this.handleError);
  }

  public getActivities(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/activities?include=academy',
      this.options,
    )
    .map(res => res.json().data)
    .catch(this.handleError);
  }

  public getActivitiesByAcademy(size, number, academy_id, name?: String): Observable<any> {
    let filter = '';
    if ( name ) {
      filter = `&filter[name][like]=%${name}%`;
    }
    return this.http.get(
      encodeURI(ConfigService.STATIC_SERVER + `/activities/?filter[type][in]=seminar,mat_event,others&filter[academy_id]=${academy_id}&page[size]=${size}&page[number]=${number}&include=subscriptions${filter}`),
      this.options,
    )
      .map(res => res.json())
      .catch(this.handleError);
  }

  public getActivitiesForCalendar(academy): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/activities?filter[academy_id]=${academy}&include=subscriptions.subscription`,
      this.options,
    )
    .map(res => res.json().data)
    .catch(this.handleError);
  }

  public getEventsFilter(miles, page: number = 1): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/activities?filter[type][in]=seminar,mat_event,others&page[number]=${page}&page[size]=5&distantion=${miles}&sort=-start_date&filter[start_date][gte]=${format(new Date(), 'YYYY-MM-DD')}`,
      this.options,
    )
    .map(res => {
      return res.json().data.map(el => {
        el.date = format(el.start_date, 'MM/DD/YYYY');
        el.time = format(el.start_date, 'Hms');
        return el;
      });
    })
    .catch(this.handleError);
  }

  public getEventsByAcademy(academy, page: number = 1): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/activities?filter[academy_id]=${academy}&page[number]=${page}&page[size]=5&sort=-start_date&filter[start_date][gte]=${format(new Date(), 'YYYY-MM-DD')}&include=subscriptions.subscription`,
      this.options,
    )
    .map(res => {
      return res.json().data.map(el => {
        el.date = format(el.start_date, 'MM/DD/YYYY');
        el.time = format(el.start_date, 'Hms');
        return el;
      });
    })
    .catch(this.handleError);
  }

  public getUpcomingFilter(miles, page: number = 1): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/activities?include=subscriptions.subscription&join_activity=true&page[number]=${page}&page[size]=5&distantion=${miles}&sort=-start_date&filter[start_date][gte]=${format(new Date(), 'YYYY-MM-DD')}`,
      this.options,
    )
    .map(res => {
      return res.json().data.map(el => {
        el.date = format(el.start_date, 'MM/DD/YYYY');
        el.time = format(el.start_date, 'Hms');
        return el;
      });
    })
    .catch(this.handleError);
  }

  private handleError(error: any) {
    return Observable.throw(error.message || JSON.parse(error._body).errors[0] || error);
  }
}
