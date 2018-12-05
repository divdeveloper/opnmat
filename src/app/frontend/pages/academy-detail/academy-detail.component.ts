import { Component, OnInit,  ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { PostService } from '../../../services/posts.service';
import { ActivitiesService } from '../../../services/activity.service';
import { AcademiesService } from '../../../services/academies.service';
import { DataService } from '../../../services/data.service';
import { ISubscription } from 'rxjs/Subscription';
import {format} from 'date-fns';

@Component({
  selector: 'opn-academy-detail',
  templateUrl: './academy-detail.component.html',
  styleUrls: ['./academy-detail.component.scss', '../@theme/scss/theme.scss'],
  providers: [AcademiesService, ActivitiesService],
})
export class AcademyDetailPageComponent implements OnInit {
  title = 'Profile';

  private openPro: Boolean = false;
  private academyId: Number;
  private posts: Array<any> = [];
  private events: Array<any> = [];
  private limit: any = 3;
  private page: any = 1;
  private maxPage: Number;
  private total: Number;
  private load: Boolean = false;

  private academyProfile: any = [];

  private academyTab: String = 'posts';
  private isFolow: Boolean = false;

  public formAcademy: FormGroup;
  private academyInfo: String = '';
  private validErrAcademy: Boolean = false;
  private addingAcademy: Boolean = false;
  private infoAcademies: Array<any> = [];

  private addingPrizes: Boolean = false;
  public formPrizes: FormGroup;
  private infoPrizes: Array<any> = [];
  private prizesText: String = '';

  private popupPost: any = {};
  private showModal: Boolean = false;
  private modalIndex: Number = 0;

  private coverBg: Object = {};
  private cropper: any;
  private serverUrl: String;

  private createActivitiOpen = false;
  private createClassOpen = false;
  private editEventModal = false;
  private editEventSource = {};
  private editClassModal = false;
  private editClassSource = {};

  private isManager: Boolean = false;
  private isPro: Boolean = false;
  private academyLink: any = '';
  private countFolowers: any = 0;
  private viewUser: any = {};
  private activitiSubscribe: ISubscription;

  @ViewChild('eventsRef', {read: ElementRef}) eventsRef: ElementRef;

  private eventsState: Boolean = true;
  @ViewChild('cropCover', {read: ElementRef}) cropCoverRef: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private postService: PostService,
    private academyService: AcademiesService,
    private activityService: ActivitiesService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private dataServices: DataService,
  ) {
    this.serverUrl = this.academyService.getServerUrl();
    this.activeRoute.params.subscribe(params => {
      this.academyId = params['id'];
    });

    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    };
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
         this.router.navigated = false;
         window.scrollTo(0, 0);
      }
    });
  }
  ngOnInit() {
    this.academyLink = `/academiy-datail/${this.academyId}`;
    this.cropCoverRef.nativeElement.style.display = 'none';
    this.load = false;
    this.postService.getUser().subscribe(res => {
      this.viewUser = res;
    });
    this.academyService.getAcademyById(this.academyId).subscribe( academy => {
      this.countFolowers = academy.followers.length;
      this.titleService.setTitle( academy.name );
      this.academyProfile = academy;
      if (this.academyProfile.cover_photo) {
        this.coverBg = {
          background: `url(${this.serverUrl}${this.academyProfile.cover_photo}) center no-repeat`,
          'background-size': 'cover',
        };
      }else {
          this.coverBg = {
            background: `url(/assets/images/profile_cover.jpg) center no-repeat`,
            'background-size': 'cover',
          };
      }
      if (academy) {
        this.postService.getPostsByAcademyId(this.academyId, this.limit, this.page).subscribe(res => {
          this.total = res.total;
          this.maxPage = Math.ceil(res.total / this.limit);
          this.posts = this.posts.concat(res.data);
          this.load = true;
        });

        this.academyService.getIsFollower(this.academyId).subscribe(res => {
          this.isFolow = res.status;
        });

        this.activityService.getEventsByAcademy(this.academyId).subscribe(events => {
          this.events = events;
        });
      }
    });
    this.registerActivitiBroadcast();
  }

  registerActivitiBroadcast() {
    this.activitiSubscribe = this.activityService.on()
      .subscribe(obj => {
        obj.date = format(obj.start_date, 'MM/DD/YYYY');
        obj.time = format(obj.start_date, 'Hms');
        if (!this.events) {
          this.events = [];
          this.events.push(obj);
        }else {
          this.events.unshift(obj);
        }
      });
  }

  public onEventMessage () {
      this.dataServices.eventMessage.emit({
          user_id: this.viewUser.id,
          academy_id: this.academyId,
          type: 'academy'
      });
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
    }
  }
  onCheckManager(status) {
    this.isManager = status;
  }
  onScrollDown () {
    if (this.page <= this.maxPage) {
      this.page += 1;
      this.load = false;
      this.postService.getPostsByAcademyId(this.academyId, this.limit, this.page).subscribe(res => {
        this.posts = this.posts.concat(res.data);
        this.load = true;
      });
    }
  }
  onPostAdded(postData) {
    if (postData) {
      const post = postData;
      post.academy = this.academyProfile;
      this.posts.unshift(post);
    }
  }
  onRemovePost(id) {
    document.getElementById('post_' + id).style.display = 'none';
  }
  onChangeTab(event, tab: String) {
    this.academyTab = tab;
  }
  onNewAcademyInfo(event) {
    this.addingAcademy = true;
  }

  setAcademy(event) {
    this.academyInfo = event.text;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({
          onlySelf: true,
        });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onFollowAdd(id) {
    this.academyService.addFollowAcademy({
      academy_id: id,
    }).subscribe( res => {
      this.countFolowers += 1;
      this.isFolow = !this.isFolow;
    });
  }

  onFollowRemove(id) {
    this.academyService.removeFollowAcademy({
      academy_id: id,
    }).subscribe( res => {
      this.countFolowers -= 1;
      this.isFolow = !this.isFolow;
    });
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

  onChangeCover(data) {
    if (data.cover_photo) {
      this.coverBg = {
        background: `url(${this.serverUrl}${data.cover_photo}?${Date.now()}) center no-repeat`,
        'background-size': 'cover',
      };
    }
    this.cropCoverRef.nativeElement.style.display = 'none';
  }
  onCloseCoverModal() {
    this.cropCoverRef.nativeElement.style.display = 'none';
  }
  onEditCoverPhoto($event) {
    const image: any = new Image();
    const file: File = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    const self = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      self.cropper = image;
      self.cropCoverRef.nativeElement.style.display = 'block';
    };

    myReader.readAsDataURL(file);
      $event.target.value = '';
  }
  onActivitiModalOpen(status) {
    document.body.classList.add('openModal');
    this.createActivitiOpen = status;
  }
  onActivitiModalClose() {
    document.body.classList.remove('openModal');
    this.createActivitiOpen = false;
  }
  onUpdateEvent(event) {
    document.body.classList.add('openModal');
    if (event.type === 'class') {
      this.editClassSource = event;
      this.editClassModal = true;
    }else {
      this.editEventSource = event;
      this.editEventModal = true;
    }
  }
  onCloseUpdateEvent() {
    document.body.classList.remove('openModal');
    this.editEventSource = [];
    this.editEventModal = false;
  }

  onClassModalOpen() {
    if (this.isPro) {
      document.body.classList.add('openModal');
      this.createClassOpen = true;
    }
  }
  onClassModalClose() {
    document.body.classList.remove('openModal');
    this.createClassOpen = false;
  }

  onCloseUpdateClass() {
    document.body.classList.remove('openModal');
    this.editClassSource = [];
    this.editClassModal = false;
  }
  goToLink(link) {
    if (this.isPro) {
      this.router.navigate([this.academyLink + link]);
    }
  }
  onSetPro(pro) {
    this.isPro = pro;
  }
}
