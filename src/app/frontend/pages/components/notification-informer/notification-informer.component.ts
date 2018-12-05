import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { cancelSubscription } from '../../../../providers/cancelSubscription';

import {LiveNotificationsService} from '../../../../services/socket-notification';
import {UsersService} from '../../../../services/users.service';

@Component({
  selector: 'opn-notification-informer',
  templateUrl: './notification-informer.component.html',
  styleUrls: ['./notification-informer.component.scss'],
  providers: [ LiveNotificationsService, UsersService ],
})
export class NotificationInformerComponent implements OnInit, OnDestroy {

  data: any;
  private unread = false;
  private me: any;
  private sound: any = new Audio('/assets/sounds/unsure.mp3');

  public subscrips: Subscription[] = [];

  constructor(
    private liveNotificationSrv: LiveNotificationsService,
    private userSrv: UsersService,
  ) {
    this.liveNotificationSrv.onSocketConected().subscribe(res => {
      console.log('Informer connect ', res);
      this.liveNotificationSrv.setLogin(this.me.id);
    });
    this.me = this.userSrv.getMe();
  }

  ngOnInit() {
    this.liveNotificationSrv.getUnread({id: this.me.id});
    this.subscrips.push(
      this.liveNotificationSrv.getSocketNotifications().subscribe(notification => {
        if (notification['user_id'] == this.me.id) {
          this.sound.play();
        }
      }),
      this.liveNotificationSrv.onUnread().subscribe(unread => {
        console.log(unread);
        if ((unread['user'] + unread['manager']) > 0) {
          this.unread = true;
        }else {
          this.unread = false;
        }
      }),
    );
  }
  ngOnDestroy() {
    cancelSubscription(this.subscrips);
    this.liveNotificationSrv.socketDisconect();
  }
}
