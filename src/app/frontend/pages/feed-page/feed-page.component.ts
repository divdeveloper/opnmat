import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PostService } from '../../../services/posts.service';
import { cancelSubscription } from '../../../providers/cancelSubscription';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import {
  ActivitiesService,
} from '../../../services/activity.service';

import { LeftSidebarComponent } from '../parts/sidebars/left/left-sidebar.component';

import { ModalService } from '../components/modal/modal.service';


@Component({
  selector: 'opn-feed-page',
  templateUrl: './feed-page.component.html',
  styleUrls: ['./feed-page.component.scss', '../@theme/scss/theme.scss'],
  providers: [
    ActivitiesService,
  ],
})
export class FeedPageComponent implements OnInit, OnDestroy {
  title = 'My feed page';

  public subscrips: Subscription[] = [];

  private posts: Array<any> = [];
  private events: Array<any> = [];
  private classes: Array<any> = [];
  private limit: any = 3;
  private page: any = 1;
  private maxPage: Number;
  private total: Number;

  private me: any;
  private load: Boolean = false;


  private popupPost: any = {};
  private showModal: Boolean = false;
  private modalIndex: Number = 0;

  userProfile: any = {};

  @ViewChild('eventsRef', {read: ElementRef}) eventsRef: ElementRef;
  @ViewChild('classesRef', {read: ElementRef}) classesRef: ElementRef;

  private feedCarrentTab: String = 'All';
  @ViewChild('panelWorldRef', {read: ElementRef}) panelWorldRef: ElementRef;
  @ViewChild('panelAllRef', {read: ElementRef}) panelAllRef: ElementRef;

  private eventsState: Boolean = true;
  private classesState: Boolean = true;

  private onePostId: any = null;
  private onePostData: any = null;

  private viewUser: any = {};



  constructor(
    private titleService: Title,
    private postService: PostService,
    private activityService: ActivitiesService,
    private route: ActivatedRoute,
    private location: Location,
    private modalSrv: ModalService,
  ) {
    this.titleService.setTitle( 'Feed page' );
    this.me = this.postService.getMe();
  }
  ngOnInit() {
    this.onePostId = decodeURIComponent(this.route.snapshot.queryParams['show-p']);
    this.postService.getUser().subscribe(res => {
      this.viewUser = res;
    });

    if ( this.onePostId !==  'undefined') {
      this.subscrips.push(
        this.postService.getPostById(this.onePostId).subscribe(res => {
          this.onePostData = res.data[0];
          this.modalSrv.open('one-post');
        }),
      );
    }

    this.panelAllRef.nativeElement.style.display = 'none';
    this.firstLoadPosts('All');
    this.activityService.getEventsFilter(50).subscribe(events => {
      this.events = events;
    });
    this.activityService.getUpcomingFilter(50).subscribe(classes => {
      this.classes = classes;
    });

    this.postService.getProfile(this.me.id).subscribe( res => {
      this.userProfile = res;
    });
  }

  onReplaceL() {
    this.location.replaceState('/');
  }
  private activeFeedTab() {
    switch (this.feedCarrentTab) {
      case 'World': {
        this.panelAllRef.nativeElement.classList.remove('active');
        this.panelAllRef.nativeElement.classList.remove('order-1');
        this.panelAllRef.nativeElement.classList.add('order-2');
        this.panelWorldRef.nativeElement.classList.add('active');
        this.panelWorldRef.nativeElement.classList.remove('order-2');
        this.panelWorldRef.nativeElement.classList.add('order-1');
        break;
      }
      case 'All': {
        this.panelAllRef.nativeElement.classList.add('active');
        this.panelAllRef.nativeElement.classList.add('order-1');
        this.panelAllRef.nativeElement.classList.remove('order-2');
        this.panelWorldRef.nativeElement.classList.remove('active');
        this.panelWorldRef.nativeElement.classList.remove('order-1');
        this.panelWorldRef.nativeElement.classList.add('order-2');
        break;
      }
    }
  }
  private firstLoadPosts(tab) {
    this.feedCarrentTab = tab;
    this.posts = [];
    this.limit = 5;
    this.page = 1;
    switch (tab) {
      case 'All': {
        this.load = false;
        this.subscrips.push(
          this.postService.getPosts(this.limit, this.page).subscribe( postsAll => {
            if (postsAll.data.length <= 0) {
              this.firstLoadPosts('World');
            }
            this.total = postsAll.total;
            this.maxPage = Math.ceil(postsAll.total / this.limit);
            this.posts = this.posts.concat(postsAll.data);
            this.panelAllRef.nativeElement.style.display = 'block';
            this.activeFeedTab();
            this.load = true;
          }),
        );
        break;
      }
      case 'World': {
        this.load = false;
        this.subscrips.push(
          this.postService.getPostsWorldwide(this.limit, this.page).subscribe( postsWorld => {
            this.total = postsWorld.total;
            this.maxPage = Math.ceil(postsWorld.total / this.limit);
            this.posts = this.posts.concat(postsWorld.data);
            this.activeFeedTab();
            this.load = true;
          }),
        );
        break;
      }
    }
  }
  private loadTabPosts () {
    if (this.load && this.page < this.maxPage) {
      switch (this.feedCarrentTab) {
        case 'World': {
          this.load = false;
          this.page += 1;
          this.subscrips.push(
            this.postService.getPostsWorldwide(this.limit, this.page).subscribe(res => {
              this.posts = this.posts.concat(res.data);
              this.load = true;
            }),
          );
          break;
        }
        case 'All': {
          this.load = false;
          this.page += 1;
          this.subscrips.push(
            this.postService.getPosts(this.limit, this.page).subscribe(res => {
              this.posts = this.posts.concat(res.data);
              this.load = true;
            }),
          );
          break;
        }
      }
    }
  }
  onScrollDown () {
    this.loadTabPosts();
  }
  onRemovePost(id) {
    document.getElementById('post_' + id).style.display = 'none';
  }
  onOpenModal(obj) {
    this.popupPost = obj.post;
    this.showModal = true;
    this.modalIndex = obj.fileIndex;
  }

  onCloseModal() {
    this.popupPost = [];
    this.showModal = false;
    this.modalIndex = 0;
  }

  private onToggleActivity(type) {
    switch (type) {
      case 'events': {
        if (this.events.length > 0) {
          if (!this.eventsState) {
            this.eventsRef.nativeElement.style.height = 'auto';
            this.eventsRef.nativeElement.classList.add('open-dropdown');
          }else {
            this.eventsRef.nativeElement.style.height = '60px';
            this.eventsRef.nativeElement.classList.remove('open-dropdown');
          }
          this.eventsState = !this.eventsState;
        }
        break;
      }
      case 'classes': {
        if (this.classes.length > 0) {
          if (!this.classesState) {
            this.classesRef.nativeElement.style.height = 'auto';
            this.classesRef.nativeElement.classList.add('open-dropdown');
          }else {
            this.classesRef.nativeElement.style.height = '60px';
            this.classesRef.nativeElement.classList.remove('open-dropdown');
          }
          this.classesState = !this.classesState;
        }
        break;
      }
    }
  }
  private onChangeFeedTab (tab) {
    this.feedCarrentTab = tab;
    this.firstLoadPosts(tab);
    this.activeFeedTab();
  }

  ngOnDestroy() {
    cancelSubscription(this.subscrips);
  }

  onPostAdded(postData) {
    if (postData) {
      const post = postData;
      post.user = this.userProfile;
      this.posts.unshift(post);
    }
  }
}
