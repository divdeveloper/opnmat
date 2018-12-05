import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PostService } from '../../../services/posts.service';

import { LeftSidebarComponent } from '../parts/sidebars/left/left-sidebar.component';

@Component({
  selector: 'opn-roadmap-page',
  templateUrl: './roadmap-page.component.html',
  styleUrls: ['./roadmap-page.component.scss'],
})
export class RoadmapPageComponent implements OnInit {

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
    this.titleService.setTitle( 'My Technique  Roadmap' );
    this.me = this.postService.getMe();
  }
  ngOnInit() {
  }
}
