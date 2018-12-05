import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import {
  Subject,
} from 'rxjs/Subject';
import { range, ceil, findIndex } from 'lodash';
import { cancelSubscription } from '../../../../../providers/cancelSubscription';

import { ProfileService } from '../../../../../services/profile.service';

@Component({
  selector: 'opn-profile-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
})
export class FollowersProfileComponent implements OnInit {
  private followers: any = [];
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


  constructor(
    private profileService: ProfileService,
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
      this.getFollowers(this.user, this.per_page, this.page, searchValue);
    });
    this.getFollowers(this.user, this.per_page, this.page, this.filterName);
  }

  getFollowers(user, per_page, page, filterName?) {
    this.profileService.getUserFollowers(user, per_page, page, filterName).subscribe(followers => {
      console.log(followers);
      this.total = followers.total;
      this.followers = followers.data;
      this.Paginations(followers.total);
    });
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
    this.getFollowers(this.user, this.per_page, page, this.filterName);
    this.page = page;
  }

  onChangeFilter(val) {
    this.subjectFilter.next(val);
  }

  onFollowing(follower, status) {
    const self = this;
    this.profileService.addFollowingMe({
      friend_id: follower.id,
    }).subscribe(folow => {
      follower.is_my_following = true;
    });
  }
  onUnfollowing(follower, status) {
    const self = this;
    this.profileService.removeFollowingMe({
      friend_id: follower.id,
    }).subscribe(folow => {
      follower.is_my_following = false;
    });
  }

  onFollow(follower, status) {
    const self = this;
    this.profileService.addFollowMe({
      friend_id: follower.id,
    }).subscribe(folow => {
      follower.is_follower.status = status;
    });
  }
  onUnfollow(follower, status) {
    const self = this;
    this.profileService.removeFollowMe({
      friend_id: follower.id,
    }).subscribe(folow => {
      follower.is_follower.status = status;
    });
  }

  toProfile(user_id) {
    this.router.navigate(['profile', user_id]);
  }
  toAcademy(academy_id) {
    this.router.navigate(['academiy-datail', academy_id]);
  }
}
