import {
  Injectable,
} from '@angular/core';
import {
  Socket,
} from 'ngx-socket-io';

@Injectable()
export class LiveNotificationsService {
  private connect = false;
  constructor(
    private socket: Socket,
  ) {
    if (!this.connect) {
      this.socket.connect();
      this.connect = !this.connect;
    }

    this.socket.on('disconnect', () => {
      console.log('Client disconnect ', new Date().getTime());
    });

    this.socket.on('error', (error: string) => {
      console.log(`ERROR: ${error}`);
    });
  }

  socketDisconect() {
    return this.socket.disconnect();
  }

  onSocketConected() {
    return this.socket
      .fromEvent('connect')
      .map(data => new Date().getTime());
  }

  onSocketReconected() {
    return this.socket
      .fromEvent('reconnect')
      .map(data => new Date().getTime());
  }

  getSocketNotifications() {
    return this.socket
      .fromEvent('notification')
      .map(data => data);
  }
  setLogin(id) {
    this.socket.emit('login', {id: id}, res => {
      console.log('login: ', res);
    });
  }
  setWriteGroup(id) {
    this.socket.emit('write-group', {id: id}, res => {
      console.log('setWriteGroup: ', res);
    });
  }
  getUnread(obj) {
    this.socket.emit('get-unread', obj);
  }
  onUnread() {
    return this.socket
      .fromEvent('notification_count')
      .map(data => data);
  }
}
