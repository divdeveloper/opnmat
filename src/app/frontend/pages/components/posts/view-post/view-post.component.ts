import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    OnChanges,
    AfterViewInit,
    ViewChild,
    ElementRef,
    HostListener,
    SimpleChanges,
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

import {
    PostService,
} from '../../../../../services/posts.service';

import {
    Broadcaster,
} from '../../../../../services/broadcaster';
import {
    Observable
} from 'rxjs/Observable';
import {
    ISubscription
} from 'rxjs/Subscription';

@Component({
    selector: 'opn-view-post',
    templateUrl: './view-post.component.html',
    styleUrls: ['./view-post.component.scss'],
})

export class ViewPostComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    @Input() me: any;
    @Input() post: any;
    @Input() academyId: any;

    @ViewChild('feedContent') feedContent: ElementRef;
    @ViewChild('showMore') showMore: ElementRef;

    @Output() onRemove: EventEmitter < any > = new EventEmitter < any > ();
    @Output() openModal: EventEmitter < any > = new EventEmitter < any > ();

    @HostListener('document:click', ['$event'])

    click(event: MouseEvent): void {
        if (this.shareToggle) {
            this.shareToggle = false;
        }
    }

    private offset: Number;
    private edit: Boolean = false;
    private serverUrl: String;

    private comments: Array < any > = [];
    private lastComment: any;
    private limit: any = 10;
    private page: any = 1;
    private maxPage: Number;
    private total: Number;

    private commentToggle: Boolean = false;
    private shareToggle: Boolean = false;
    private userAvatar: string;

    private _height: Number;
    private _toggleMore: Boolean;
    private _updatePost: Boolean = false;
    private _gridFiles: Object = {
        1: {
            0: {
                col: 12
            },
        },
        2: {
            0: {
                col: 6
            },
            1: {
                col: 6
            },
        },
        3: {
            0: {
                col: 12
            },
            1: {
                col: 6
            },
            2: {
                col: 6
            },
        },
        4: {
            0: {
                col: 6
            },
            1: {
                col: 6
            },
            2: {
                col: 6
            },
            3: {
                col: 6
            },
        },
    };
    private countFiles: Number = 1;
    private postSubscribe: ISubscription;

    private addComment: Boolean = true;

    constructor(
        private postService: PostService,
        private broadcaster: Broadcaster,
        private router: Router,
        private loculr: Location,
    ) {
        this.serverUrl = postService.getServerUrl();
    }
    ngOnInit() {
        const user_id = this.postService.getMe().id;
        if ((this.post.user && user_id == this.post.user.id) || (this.post.academy && this.post.academy.id == this.academyId)) {
            this._updatePost = true;
        }
        if (this.post.user) {
            this.userAvatar = this.post.user.avatar;
        }

        if (this.post.files && this.post.files.length > 0) {
            this.countFiles = this.post.files.length;
        }

        this.registerPostBroadcast();

        this.postService.getCommentsPost(1, 1, this.post.id).subscribe(res => {
            if (res.data) {
                this.lastComment = res.data[0];
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.post && changes.post.currentValue) {
            this.post = changes.post.currentValue;
        }
        if (changes.post && changes.post.currentValue && changes.post.currentValue.files && changes.post.currentValue.files.length > 0) {
            this.post = changes.post.currentValue;
            this.countFiles = changes.post.currentValue.files.length;
        }
    }

    registerPostBroadcast() {
        this.postSubscribe = this.broadcaster.on < string > (`post${this.post.id}`)
            .subscribe(postData => {
                console.log(`post_${this.post.id}`, postData);
            });
    }

    ngAfterViewInit() {
        if (this.feedContent) {
            const element = this.feedContent.nativeElement;
            this.offset = element.offsetHeight - element.clientHeight;
            const height = element.scrollHeight + this.offset;
            this._height = height;
            this._toggleMore = true;
            if (height <= 140) {
                element.style.height = height + 'px';
                this.showMore.nativeElement.style.display = 'none';
            } else {
                element.style.height = '140px';
            }
        }
    }
    onClickMedia(post, file_index) {
        this.openModal.emit({
            post: this.post,
            fileIndex: file_index
        });
    }

    toggleMore(event) {
        if (this._toggleMore) {
            this.feedContent.nativeElement.style.height = this._height + 'px';
        } else {
            this.feedContent.nativeElement.style.height = '140px';
        }
        this._toggleMore = !this._toggleMore;
    }

    onControllAction(event) {
        switch (event.action) {
            case 'update':
                {
                    this.postService.updatePost({
                        share_from: event.share_from,
                        content: this.post.content,
                        title: this.post.title,
                    }, this.post.id).subscribe(res => {
                        this.post.share_from = res.post.share_from;
                    });
                    break;
                }
            case 'remove':
                {
                    this.postService.removePost(this.post.id).subscribe(res => {
                        if (res.status) {
                            this.onRemove.emit(this.post.id);
                        }
                    });
                    break;
                }
        }
    }

    onEdit(e, post) {
        if (!this.edit) {
            this.feedContent.nativeElement.classList.add('editing');
            this.feedContent.nativeElement.readOnly = false;
            this.edit = !this.edit;
            e.toElement.classList.add('editOn');
        } else {
            this.postService.updatePost({
                content: this.feedContent.nativeElement.value,
                title: post.title,
            }, post.id).subscribe(res => {
                this.feedContent.nativeElement.classList.remove('editing');
                this.feedContent.nativeElement.readOnly = true;
                this.edit = !this.edit;
                e.toElement.classList.remove('editOn');
            });
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
                            event.toElement.classList.remove('hand-gesture-blue');
                            event.toElement.classList.add('hand-gesture');
                            break;
                        }
                    case 'like':
                        {
                            post.count_like += 1;
                            post.is_like = !is_like;
                            event.toElement.classList.add('is-like');
                            event.toElement.classList.remove('hand-gesture');
                            event.toElement.classList.add('hand-gesture-blue');
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
                if (res.status) {
                    post.count_comments += 1;
                    inputElement.value = '';
                    this.comments.unshift(res.comment);
                    this.lastComment = res.comment;
                    this.addComment = true;
                }
            });
        }
    }

    // onScrollDown() {
    //   if (this.page <= this.maxPage) {
    //     this.page += 1;
    //     this.postService.getCommentsPost(this.limit, this.page, this.post.id).subscribe(res => {
    //       this.comments = this.comments.concat(res.data);
    //     });
    //   }
    // }

    onShareTimline(id) {
        this.postService.sharePostTimline({
            post_id: id,
        }).subscribe(res => {
            if (res.status) {
                // alert('This has been shared to your Timeline!');
            }
        });
    }

    onCloseSahre(social) {
        alert(`This has been shared to your ${social}!`);
        this.shareToggle = !this.shareToggle;
    }

    onShareToggle(event) {
        event.stopPropagation();
        this.shareToggle = !this.shareToggle;
    }
    ngOnDestroy() {
        this.postSubscribe.unsubscribe();
    }
    toProfile(user_id) {
        this.router.navigate(['profile', user_id]);
    }
}
