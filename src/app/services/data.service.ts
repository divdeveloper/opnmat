import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable} from 'rxjs/Observable';
import { ConfigService } from './service.config';
import { JwtHelperService } from '@auth0/angular-jwt';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class DataService {
    public eventMessage = new EventEmitter<any>();
    private options;
    private optionsForm;
    private activate: Boolean;
    private user: Number;

    constructor(private http: Http,
                private jwtHelper: JwtHelperService) {

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        });
        this.options = new RequestOptions({
            headers: headers,
        });
        this.user = jwtHelper.decodeToken(localStorage.getItem('token'));

        const headersForm = new Headers({
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        });
        this.optionsForm = new RequestOptions({
            headers: headersForm,
        });
    }

    public getMe(): any {
        return this.user;
    }

    public getResponse(url: string): Observable<any> {
        return this.http.get(
            encodeURI(ConfigService.STATIC_SERVER + `${url}`),
            this.options,
        )
            .map(res => res.json())
            .catch(this.handleError);
    }

    public postResponse(url: string, data, header?): Observable<any> {
        const headers = header ? this.optionsForm : this.options ;
        return this.http.post(ConfigService.STATIC_SERVER + `${url}`, data, headers)
            .map(res => res.json())
            .catch(this.handleError);
    }

    public putResponse(url: string, data, header?): Observable<any> {
        const headers = header ? this.optionsForm : this.options ;
        return this.http.put(ConfigService.STATIC_SERVER + `${url}`, data, headers)
            .map(res => res.json())
            .catch(this.handleError);
    }

    public delResponse(url: string): Observable<any> {
        return this.http.delete(ConfigService.STATIC_SERVER + `${url}`, this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    public handleError(error: any) {
      return Observable.throw(error.message || error);
    }

}
