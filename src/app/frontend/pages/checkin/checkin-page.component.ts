import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PostService } from '../../../services/posts.service';

import { LeftSidebarComponent } from '../parts/sidebars/left/left-sidebar.component';

@Component({
  selector: 'opn-checkin-page',
  templateUrl: './checkin-page.component.html',
  styleUrls: ['./checkin-page.component.scss'],
})
export class CheckinPageComponent implements OnInit {

  private posts: Array<any> = [];
  private limit: any = 3;
  private page: any = 1;
  private maxPage: Number;
  private total: Number;

  private me: Number;
  private userProfile: any = [];
  private userAvatar: any;
  private academyName: String = '';


  constructor(
    private titleService: Title,
    private postService: PostService,
  ) {
    this.titleService.setTitle( 'Check In' );
    this.me = this.postService.getMe();
  }
  ngOnInit() {
  }
}
