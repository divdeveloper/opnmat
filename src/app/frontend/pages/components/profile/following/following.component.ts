import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import {
  Subject,
} from 'rxjs/Subject';
import { range, ceil, findIndex } from 'lodash';
import { cancelSubscription } from '../../../../../providers/cancelSubscription';

import { ProfileService } from '../../../../../services/profile.service';
import { AcademiesService } from '../../../../../services/academies.service';

@Component({
  selector: 'opn-profile-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss'],
})
export class FollowingProfileComponent implements OnInit {
  private followings: any = [];
  pagintion: any;
  private per_page: any = 12;
  private page: any = 1;
  private total: any = 0;

  private user: any;
  private me: any;
  private serverUrl: String;

  private filterName: String = '';
  private subjectFilter: Subject < string > = new Subject();
  public subscrips: Subscription[] = [];
  private group: String = 'users';


  constructor(
    private profileService: ProfileService,
    private academiesService: AcademiesService,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.me = this.profileService.getMe().id;
    this.activeRoute.params.subscribe(params => {
      this.user = params['id'];
    });
    this.pagintion = {
      show: false,
      pages: [],
    };
  }
  ngOnInit() {
    this.serverUrl = this.profileService.getServerUrl();
    this.subjectFilter.debounceTime(500).subscribe((searchValue) => {
      this.page = 1;
      this.getFollowings(this.user, this.per_page, this.page, searchValue);
    });
    this.getFollowings(this.user, this.per_page, this.page, this.filterName);
  }

  getFollowings(user, per_page, page, filterName?) {
    this.followings = [];
    switch (this.group) {
      case 'users': {
        this.profileService.getUserFollowings(user, per_page, page, filterName).subscribe(followings => {
          this.total = followings.total;
          this.followings = followings.data;
          this.Paginations(followings.total);
        });
        break;
      }
      case 'academies': {
        this.academiesService.getAcademyFollowings(user, per_page, page, filterName).subscribe(followings => {
          this.total = followings.total;
          this.followings = followings.data;
          this.Paginations(followings.total);
        });
        break;
      }
    }
  }

  Paginations(total) {
    if (total > this.per_page) {
      this.pagintion.pages = range(1, ceil(total / this.per_page) + 1, 1);
      this.pagintion.show = true;
    }else {
      this.pagintion.show = false;
    }
  }

  onLoadPage(page) {
    this.getFollowings(this.user, this.per_page, page, this.filterName);
    this.page = page;
  }

  onChangeFilter(val) {
    this.subjectFilter.next(val);
  }

  onChangeFilterStatus(val) {
    console.log(val);
    this.group = val;
    this.getFollowings(this.user, this.per_page, this.page, this.filterName);
  }

  onFollow(following, group) {
    switch (group) {
      case 'users': {
        const self = this;
        this.profileService.addFollowingMe({
          friend_id: following.id,
        }).subscribe(folow => {
          following.is_following.status = 1;
        });
        break;
      }
      case 'academies': {
        this.academiesService.addFollowAcademy({
          academy_id: following.id,
        }).subscribe( res => {
          following.is_following.status = 1;
        });
        break;
      }
    }
  }
  onUnfollow(following, group) {
    switch (group) {
      case 'users': {
        const self = this;
        this.profileService.removeFollowingMe({
          friend_id: following.id,
        }).subscribe(folow => {
          following.is_following.status = 0;
          // self.followings = self.followings.filter(IFolllowing => IFolllowing !== following);
        });
        break;
      }
      case 'academies': {
        this.academiesService.removeFollowAcademy({
          academy_id: following.id,
        }).subscribe( res => {
          following.is_following.status = 0;
        });
        break;
      }
    }
  }

  toProfile(user_id) {
    this.router.navigate(['profile', user_id]);
  }
  toAcademy(academy_id) {
    this.router.navigate(['academiy-datail', academy_id]);
  }
}
