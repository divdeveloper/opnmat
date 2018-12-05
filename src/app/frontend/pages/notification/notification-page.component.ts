import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NotificationsService } from '../../../services/notifications.service';
import { LiveNotificationsService } from '../../../services/socket-notification';
import { Subscription } from 'rxjs/Subscription';
import { cancelSubscription } from '../../../providers/cancelSubscription';
import { AcademiesService } from '../../../services/academies.service';

import { LeftSidebarComponent } from '../parts/sidebars/left/left-sidebar.component';

@Component({
  selector: 'opn-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.scss', '../@theme/scss/theme.scss'],
  providers: [
    NotificationsService,
    LiveNotificationsService,
    AcademiesService,
  ],
})
export class NoficationPageComponent implements OnInit, OnDestroy, AfterViewInit {
  private group = 'user';
  private me: any;
  public subscrips: Subscription[] = [];
  private notifications: Array<any> = [];
  private load: Boolean = true;
  private unreadGroup: Object = {};
  private socketConnect: Boolean = false;
  private isManager: Boolean = false;

  constructor(
    private titleService: Title,
    private notificationSrv: NotificationsService,
    private liveNotificationSrv: LiveNotificationsService,
    private academyService: AcademiesService,
  ) {
    this.titleService.setTitle( 'Notifications' );
    this.me = this.notificationSrv.getMe();
  }
  ngOnInit() {
    this.getNotificationsGroup();
    this.registerSocketNotifications();
    this.statusManager();
  }
  ngAfterViewInit() {
    const that = this;
    document.addEventListener("visibilitychange", function() {
      that.onViewAll();
    });

    // document.getElementsByClassName('actions-follower').item(0).addEventListener( 'click' , function() {alert('Спасибо!')});
  }

  statusManager() {
    this.academyService.checkUserInManagerById().subscribe(res => {
      if (res.data.length >= 0) {
        this.isManager = true;
      }
    });
  }

  registerSocketNotifications() {
    this.subscrips.push(
      this.liveNotificationSrv.getSocketNotifications().subscribe(notification => {
        if (notification['user_id'] == this.me.id) {
          this.notifications.unshift(notification);
          this.onViewAll();
        }
      }),
      this.liveNotificationSrv.onUnread().subscribe((unread) => {
        this.unreadGroup = unread;
        console.log(this.unreadGroup);
      }),
    );

    this.subscrips.push(
      this.liveNotificationSrv.onSocketReconected().subscribe(() => {
        console.log('Notifications connect ', new Date().getTime());
        this.liveNotificationSrv.setLogin(this.me.id);
        this.onViewAll();
      }),
    );
  }
  
  getNotificationsGroup() {
    this.notifications = [];
    this.load = false;
    this.subscrips.push(
      this.notificationSrv.getNotifications(this.me.id, this.group).finally(() => {
        this.onViewAll();
        this.load = true;
      })
      .subscribe(notifications => {
        this.notifications = notifications.data;
      }),
    );
  }
  onChangeFilterStatus(group) {
    this.group = group;
    this.getNotificationsGroup();
  }
  onViewAll() {
    if (document.visibilityState === 'visible' && this.notifications.length > 0) {
      const timeoutId = setTimeout(() => {
        this.subscrips.push(
          this.notificationSrv.groupViewAll({
            type: this.group,
          })
          .finally(() => {
            clearTimeout(timeoutId);
            this.liveNotificationSrv.setWriteGroup(this.me.id);
          })
          .subscribe(res => {
            if (res) {
              this.setViewAllGroup();
            }
          }),
        );
      }, 3000);
    }
  }
  setViewAllGroup() {
    this.notifications = this.notifications.map(el => {
      if (el.type == this.group ) {
        el.view = 1;
        return el;
      }
      return el;
    });
  }
  ngOnDestroy() {
    cancelSubscription(this.subscrips);
    this.liveNotificationSrv.socketDisconect();
  }
  onAccept(id) {
    alert(id);
  }
}
