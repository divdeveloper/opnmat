import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';
import { Location } from '@angular/common';
import { cancelSubscription } from '../../../../../providers/cancelSubscription';
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from '../../../../../services/socket.service';

import { UsersService } from '../../../../../services/users.service';

@Component({
  selector: 'opn-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
  providers: [UsersService],
})
export class LeftSidebarComponent implements OnInit, OnDestroy {
  private user: any;
  private academy: any;
  private belt: String = '';

  public subscrips: Subscription[] = [];
  public profileLink: String = '';
  public load = false;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private socketService: SocketService,
  ) {
    this.user = [];
  }

  ngOnInit() {
    this.subscrips.push(
      this.usersService.getUserMe().subscribe(res => {
        console.log('user me', res);
        this.profileLink = `/profile/${res.id}`;
        this.belt = res.belt.sourse_round;
        this.user = res;
        this.load = true;
      }),
    );
  }

  onLogout() {
    localStorage.removeItem('token');
    localStorage.clear();
    this.socketService.disconnect();
    window.location.href = '/auth/login';
  }

  public toSearchEvent() {
    this.router.navigate([`/redirect`], {
      queryParams: {
        url: '/search/activity',
        location: true,
      },
    });
  }

  ngOnDestroy() {
    cancelSubscription(this.subscrips);
  }
}
