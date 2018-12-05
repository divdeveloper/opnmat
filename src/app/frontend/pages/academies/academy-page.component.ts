import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PostService } from '../../../services/posts.service';

import { LeftSidebarComponent } from '../parts/sidebars/left/left-sidebar.component';

@Component({
  selector: 'opn-academy-page',
  templateUrl: './academy-page.component.html',
  styleUrls: ['./academy-page.component.scss'],
})
export class AcademyPageComponent implements OnInit {

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
    this.titleService.setTitle( 'Academies' );
    this.me = this.postService.getMe();
  }
  ngOnInit() {
    this.postService.getPostsMe(this.limit, this.page).subscribe(res => {
      this.total = res.total;
      this.maxPage = Math.ceil(res.total / this.limit);
      this.posts = this.posts.concat(res.data);
    });

    this.postService.getProfile(35).subscribe( res => {
      this.userProfile = res;
      this.userAvatar = res.avatar;
      this.academyName = res.academy.name;
      console.log(res);
    });
  }
  onScrollDown () {
    if (this.page <= this.maxPage) {
      this.page += 1;
      this.postService.getPostsMe(this.limit, this.page).subscribe(res => {
        this.posts = this.posts.concat(res.data);
      });
    }
  }
  onPostAdded(event) {
    if (event.post) {
      const post = event.post;
      post.user = this.userProfile;
      post.files = [];
      this.posts.unshift(post);
    }
    if (event.files) {
      for (let i = 0; i < event.files.length; i++) {
        this.posts[0].files.push(event.files[i]);
      }
    }
  }
}
