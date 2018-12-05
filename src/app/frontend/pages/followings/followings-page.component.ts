import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PostService } from '../../../services/posts.service';

import { LeftSidebarComponent } from '../parts/sidebars/left/left-sidebar.component';

@Component({
  selector: 'opn-followings-page',
  templateUrl: './followings-page.component.html',
  styleUrls: ['./followings-page.component.scss', '../@theme/scss/theme.scss'],
})
export class FollowingsPageComponent implements OnInit {

  constructor(
    private titleService: Title,
    private postService: PostService,
  ) {
    this.titleService.setTitle( 'Followings' );
  }
  ngOnInit() {
  }
}
