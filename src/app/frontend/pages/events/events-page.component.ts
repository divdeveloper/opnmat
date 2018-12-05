import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PostService } from '../../../services/posts.service';

import { LeftSidebarComponent } from '../parts/sidebars/left/left-sidebar.component';

@Component({
  selector: 'opn-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.scss'],
})
export class EventsPageComponent implements OnInit {

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
    this.titleService.setTitle( 'Events Near Me' );
    this.me = this.postService.getMe();
  }
  ngOnInit() {
  }
}
