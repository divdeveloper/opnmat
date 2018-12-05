import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { ProfileService } from '../../../../../services/profile.service';


@Component({
  selector: 'opn-profile-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosProfileComponent implements OnInit {
  private videos: Array<any> = [];
  private limit: any = 10;
  private page: any = 1;
  private maxPage: Number;
  private total: Number;
  private load: Boolean = true;

  private user: any;
  private serverUrl: String;

  constructor(
    private profileService: ProfileService,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.activeRoute.params.subscribe(params => {
      this.user = params['id'];
    });
  }
  ngOnInit() {
    this.load = false;
    this.profileService.getUserVideos(this.user, this.limit, this.page).subscribe(videos => {
      this.total = videos.total;
      this.maxPage = Math.ceil(videos.total / this.limit);
      this.videos = this.videos.concat(videos.data);
      this.load = true;
    });
    this.serverUrl = this.profileService.getServerUrl();
  }
  onScrollDown () {
    if (this.load && this.page <= this.maxPage) {
      this.page += 1;
      this.load = false;
      this.profileService.getUserVideos(this.user, this.limit, this.page).subscribe(videos => {
        this.videos = this.videos.concat(videos.data);
        this.load = true;
      });
    }
  }
}
