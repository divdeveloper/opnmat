import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import {
  Subject,
} from 'rxjs/Subject';
import { range, ceil, findIndex } from 'lodash';
import { cancelSubscription } from '../../../../../providers/cancelSubscription';

import { AcademiesService } from '../../../../../services/academies.service';

@Component({
  selector: 'opn-academy-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
  providers: [AcademiesService],
})
export class FollowersAcademyComponent implements OnInit {
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
    private academiesService: AcademiesService,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.me = this.academiesService.getMe().id;
    this.activeRoute.params.subscribe(params => {
      this.user = params['id'];
    });
    this.pagintion = {
      show: false,
      pages: [],
    };
  }
  ngOnInit() {
    this.serverUrl = this.academiesService.getServerUrl();
    this.subjectFilter.debounceTime(500).subscribe((searchValue) => {
      this.page = 1;
      this.getFollowers(this.user, this.per_page, this.page, searchValue);
    });
    this.getFollowers(this.user, this.per_page, this.page, this.filterName);
  }

  getFollowers(user, per_page, page, filterName?) {
    this.academiesService.getAcademyFollowers(user, per_page, page, filterName).subscribe(followers => {
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

  // onFollow(follower, status) {
  //   const self = this;
  //   this.academiesService.addFollowAcademy({
  //     academy_id: follower.id,
  //   }).subscribe(folow => {
  //     follower.is_follower.status = status;
  //     //self.followers = self.followers.filter(IFolllower => IFolllower !== follower);
  //   });
  // }
  // onUnfollow(follower, status) {
  //   const self = this;
  //   this.academiesService.removeFollowAcademy({
  //     academy_id: follower.id,
  //   }).subscribe(folow => {
  //     follower.is_follower.status = status;
  //     //self.followers = self.followers.filter(IFolllower => IFolllower !== follower);
  //   });
  // }
}

