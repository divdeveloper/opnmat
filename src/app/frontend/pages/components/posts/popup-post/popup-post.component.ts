import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  Title,
} from '@angular/platform-browser';
import {
  Location,
} from '@angular/common';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';
// import { ShareButtons } from '@ngx-share/core';

import {
  PostService,
} from '../../../../../services/posts.service';

import {
  Broadcaster,
} from '../../../../../services/broadcaster';

import { ModalService } from '../../modal/modal.service';

@Component({
  selector: 'opn-popup-post',
  templateUrl: './popup-post.component.html',
  styleUrls: ['./popup-post.component.scss'],
})
export class PopupPostComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() post: any;
  @Input() show: Boolean;
  @Input() indexFile: any;
  @Input() academyId: any;

  @Output() closeModal: EventEmitter <any> = new EventEmitter <any> ();
  @Output() onRemovePost: EventEmitter <any> = new EventEmitter <any> ();

  private files: Array<any> = [];
  private _updatePost: Boolean = false;
  private userAvatar: String = '';
  private currentFile: Array<any> = [];
  private comments: Array < any > = [];
  private limit: any = 10;
  private page: any = 1;
  private maxPage: Number;
  private total: Number;

  private commentToggle: Boolean = true;
  private shareToggle: Boolean = false;
  private serverUrl: String;
  private addComment: Boolean = true;

  constructor(
    private elementRef: ElementRef,
    private postService: PostService,
    private broadcaster: Broadcaster,
    private modalSrv: ModalService,
  ) {
    this.serverUrl = postService.getServerUrl();
  }
  ngOnInit() {
    this.files = this.post.files;
    const user_id = this.postService.getMe().id;
    if ((this.post.user && user_id == this.post.user.id) || (this.post.academy && this.post.academy.id == this.academyId)) {
      this._updatePost = true;
    }
    if (this.post.user) {
      this.userAvatar = this.post.user.avatar;
    }
    if (this.show) {
      this.showOverlay();
    }
    this.currentFile = this.files[this.indexFile];

    if (this.commentToggle) {
      this.postService.getCommentsPost(this.limit, this.page, this.post.id).subscribe(res => {
        this.total = res.total;
        this.maxPage = Math.ceil(res.total / this.limit);
        this.comments = this.comments.concat(res.data);
      });
    }
  }
  showOverlay() {
    document.body.classList.add('openModal');
    this.elementRef.nativeElement.children[0].style.display = 'block';
  }
  ngAfterViewInit() {

  }
  ngOnChanges(changes: SimpleChanges) {
    // const post: SimpleChange = changes.post;
    // console.log(post);
  }
  onCloseModal() {
    this.broadcaster.broadcast(`post${this.post.id}`, this.post);
    document.body.classList.remove('openModal');
    this.elementRef.nativeElement.children[0].style.display = 'none';
    this.closeModal.emit();
  }

  onControllAction(event) {
    switch (event.action) {
      case 'update': {
        this.postService.updatePost({
          share_from: event.share_from,
          content: this.post.content,
          title: this.post.title,
        }, this.post.id).subscribe(res => {
          this.post.share_from = res.post.share_from;
        });
        break;
      }
      case 'remove': {
        this.postService.removePost(this.post.id).subscribe(res => {
          if (res.status) {
            this.onCloseModal();
            this.onRemovePost.emit(this.post.id);
          }
        });
        break;
      }
    }
  }

  onLike(event, is_like, post) {
    this.postService.postLike(is_like, post.id).subscribe(res => {
      if (res.status) {
        switch (res.action) {
          case 'unlike':
            {
              post.count_like -= 1;
              post.is_like = !is_like;
              event.toElement.classList.remove('is-like');
              break;
            }
          case 'like':
            {
              post.count_like += 1;
              post.is_like = !is_like;
              event.toElement.classList.add('is-like');
              break;
            }
        }
      }
    });
  }
  onCommentToggle(event, post) {
    this.commentToggle = !this.commentToggle;
    if (this.commentToggle) {
      event.toElement.classList.add('active');
      this.postService.getCommentsPost(this.limit, this.page, this.post.id).subscribe(res => {
        this.total = res.total;
        this.maxPage = Math.ceil(res.total / this.limit);
        this.comments = this.comments.concat(res.data);
        console.log(this.comments);
      });
    } else {
      this.comments = [];
      event.toElement.classList.remove('active');
    }
  }

  onSaveComment(inputElement, post) {
    if (inputElement.value != '') {
      this.postService.setCommentToPost({
        post_id: post.id,
        content: inputElement.value,
      }).subscribe(res => {
        console.log(res);
        if (res.status) {
          post.count_comments += 1;
          inputElement.value = '';
          this.comments.unshift(res.comment);
        }
      });
    }
  }

  onScrollDown() {
    if (this.page <= this.maxPage) {
      this.page += 1;
      this.postService.getCommentsPost(this.limit, this.page, this.post.id).subscribe(res => {
        this.comments = this.comments.concat(res.data);
      });
    }
  }

  onShareTimline(id) {
    this.postService.sharePostTimline({
      post_id: id,
    }).subscribe(res => {
      if (res.status) {
        // this.modalSrv.open('shured-modal');
      }
    });
  }

  onCloseSahre() {
    this.shareToggle = !this.shareToggle;
  }

  onShareToggle(event) {
    event.stopPropagation();
    this.shareToggle = !this.shareToggle;
  }
  setCurrentFile(i) {
    this.currentFile = this.files[i];
  }
  onNextMedia() {
    if (this.indexFile < this.files.length - 1) {
      this.indexFile += 1;
    }else {
      this.indexFile = 0;
    }
    this.setCurrentFile(this.indexFile);
  }
  onPrevMedia() {
    if (this.indexFile > 0) {
      this.indexFile -= 1;
    }else {
      this.indexFile = this.files.length - 1;
    }
    this.setCurrentFile(this.indexFile);
  }
}
