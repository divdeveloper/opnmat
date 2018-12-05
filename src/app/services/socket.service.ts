import { Injectable } from '@angular/core';
import { ConfigService } from './service.config';

import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
    private host: string = `${ConfigService.URL_SERVER}`;
    private hostApi: string = `${ConfigService.STATIC_SERVER}`;
    private socket: any;
    private userId: number;
    private status: boolean = false;


    constructor() {
        const user = JSON.parse( localStorage.getItem('user') );
        if (user && !this.status) {
            this.connect(user.id);
        }
    }

    public connect (id: number) {
        this.userId = id;
        if (!this.status) {
            this.initSocket();
        }
    }

    public initSocket(){
        console.log('initSocket');
        this.socket = io(this.host);
        this.socket.on("connect", () => {
            this.connected();
        });
        this.socket.on("disconnect", () => this.disconnected());
        this.socket.on("error", (error: string) => {
            console.log(`ERROR: "${error}" (${this.host})`);
        });
    }

    public disconnect () {
        this.socket.off('message');
        this.socket.off('online');
        this.socket.off('offline');
        this.socket.disconnect();
    }

    public emit(event, message) {
        return new Observable<any>(observer => {
            this.socket.emit(event, message, (data) => {
                if (data.success) {
                    observer.next(data.msg);
                } else {
                    observer.error(data.msg);
                }
                observer.complete();
            });
        });
    }

    public onGetMessages() {
        return new Observable<any>( (observer) => {
            this.socket.on('message', msg => {
                observer.next(msg);
            });
        });
    }

    public getOnline() {
        return new Observable<any>( (observer) => {
            this.socket.on('online', msg => {
                observer.next(msg);
            });
        });
    }
    public getOffline() {
        return new Observable<any>( (observer) => {
            this.socket.on('offline', msg => {
                observer.next(msg);
            });
        });
    }

    private connected() {
        this.status = true;
        console.log('Connected');
        console.log('emit user login-', this.userId);
        this.socket.emit('login', {
            id: this.userId
        })
    }

    private disconnected() {
        this.status = false;
        console.log('Disconnected');
    }
}