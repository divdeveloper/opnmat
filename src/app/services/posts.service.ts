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

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class PostService {
  private options;
  private activate: Boolean;
  private user: Number;

  constructor(
    private http: Http,
    private jwtHelper: JwtHelperService,
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
    this.broadcaster.broadcast(this, data);
  }

  on(): Observable<string> {
    return this.broadcaster.on<string>(this);
  }

  getServerUrl(): String {
    return ConfigService.URL_SERVER;
  }

  getMe(): any {
    return this.user;
  }

  public getPostById(post_id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/posts/?include=files,user&filter[id]=${post_id}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public updatePost(obj, id): Observable<any> {
    return this.http.put(
      ConfigService.STATIC_SERVER + '/posts/' + id,
      obj,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getUser(): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/users/me`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getProfile(id): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/users/${id}?include=files`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public saveFilesPost(obj, id): Observable<any> {
    const headers = new Headers({
      // 'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    });
    const options = new RequestOptions({
      headers: headers,
    });
    return this.http.post(
      ConfigService.STATIC_SERVER + '/post_files/' + id,
      obj,
      options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public removePost(id): Observable<any> {
    return this.http.delete(
      ConfigService.STATIC_SERVER + '/posts/' + id,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public createPost(obj): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + '/posts/',
      obj,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  public getPosts(size, number): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/posts?include=files,user&page[size]=${size}&page[number]=${number}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  public getPostsWorldwide(size, number): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/posts/worldwide?include=files,user&page[size]=${size}&page[number]=${number}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getPostsMe(size, number): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/posts/me?include=files,user&page[size]=${size}&page[number]=${number}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getPostsById(id, size, number): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/posts/user/${id}?include=files,user&page[size]=${size}&page[number]=${number}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getPostsByAcademyId(id, size, number): Observable<any> {
    return this.http.get(
      ConfigService.STATIC_SERVER + `/posts/academy/${id}?include=files,academy&page[size]=${size}&page[number]=${number}`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public postLike(like, id): Observable<any> {
    let likeUrl = '';
    switch (like) {
      case true: {
        likeUrl = 'unlike';
        break;
      }
      case false: {
        likeUrl = 'like';
        break;
      }
    }
    if (likeUrl == '') {
      likeUrl = 'like';
    }
    return this.http.post(
      ConfigService.STATIC_SERVER + '/posts/' + likeUrl,
      {
        post_id: id,
      },
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public getCommentsPost(size, number, post_id) {
    return this.http.get(
      ConfigService.STATIC_SERVER + '/post_comments?filter[post_id]=' + post_id + `&page[size]=${size}&page[number]=${number}&include=user`,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public setCommentToPost(comment): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + '/post_comments',
      comment,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }

  public sharePostTimline(share): Observable<any> {
    return this.http.post(
      ConfigService.STATIC_SERVER + '/posts/share',
      share,
      this.options,
    )
    .map(res => res.json())
    .catch(this.handleError);
  }
  private handleError(error: any) {
    return Observable.throw(error.message || error);
  }
}
