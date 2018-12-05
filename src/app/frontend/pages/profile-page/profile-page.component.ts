import {Component, OnInit, OnDestroy, ElementRef, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from '@angular/forms';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {Select2TemplateFunction, Select2OptionData} from 'ng2-select2';

import {PostService} from '../../../services/posts.service';
import {ProfileService} from '../../../services/profile.service';
import {cancelSubscription} from '../../../providers/cancelSubscription';
import {Subscription} from 'rxjs/Subscription';
import {DataService} from '../../../services/data.service';

@Component({
  selector: 'opn-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss', '../@theme/scss/theme.scss'],
  providers: [ProfileService],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  title = 'Profile';

  public subscrips: Subscription[] = [];

  private userId: Number;
  private posts: Array<any> = [];
  private limit: any = 3;
  private page: any = 1;
  private maxPage: Number;
  private total: Number;

  private me: Number;
  private userProfile: any = [];
  private userAvatar: any;
  private academyName: String = '';
  private belt: String = '';

  private profileTab: String = 'posts';
  private isFolow: Boolean = false;

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

  public yearsF: Array<Select2OptionData>;
  public optionsYearsF: Select2Options;
  public yearsT: Array<Select2OptionData>;
  public optionsYearsT: Select2Options;

  private academiesInfo: any = {
    from: 0,
    to: 0,
    action: 'add',
  };
  private currentAcademy: any;
  private load: Boolean = true;

  private profileFound: Boolean = true;
  private profileload: Boolean = false;

  private viewUser: any = {};

  @ViewChild('cropCover', {read: ElementRef}) cropCoverRef: ElementRef;

  constructor(private formBuilder: FormBuilder,
              private titleService: Title,
              private postService: PostService,
              private profileService: ProfileService,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private dataServices: DataService,) {
    this.serverUrl = this.profileService.getServerUrl();

    this.titleService.setTitle('Profile');
    this.me = this.profileService.getMe().id;
    this.activeRoute.params.subscribe(params => {
      this.userId = params['id'];
    });

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
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
    this.cropCoverRef.nativeElement.style.display = 'none';
    this.load = false;
    this.subscrips.push(
      this.postService.getUser().subscribe(res => {
        this.viewUser = res;
      }),
      this.postService.getPostsById(this.userId, this.limit, this.page).subscribe(res => {
        this.total = res.total;
        this.maxPage = Math.ceil(res.total / this.limit);
        this.posts = this.posts.concat(res.data);
        this.load = true;
      }),
      this.postService.getProfile(this.userId)
        .finally(() => {
          this.profileload = true;
        })
        .subscribe(res => {
            this.userProfile = res;
            this.userAvatar = res.avatar;
            this.academyName = res.academy.name;
            this.belt = res.belt.sourse_round;

            if (res.cover_photo) {
              this.coverBg = {
                background: `url(${this.serverUrl}${res.cover_photo}) center/cover no-repeat`,
              };
            } else {
              this.coverBg = {
                background: `url(/assets/images/profile_cover.jpg) center/cover no-repeat`,
              };
            }
          },
          err => {
            this.profileFound = false;
          }),
      this.profileService.getAademiesInfo(this.userId).subscribe(res => {
        this.infoAcademies = res.data;
      }),
      this.profileService.getPrizesInfo(this.userId).subscribe(res => {
        this.infoPrizes = res.data;
      }),
    );

    this.formPrizes = this.formBuilder.group({
      text: [null, [Validators.required]],
    });
    this.subscrips.push(
      this.profileService.isFollower(this.userId).subscribe(res => {
        this.isFolow = res.status;
      }),
    );
    this.yearsF = [
      {
        id: '0',
        text: 'From',
      },
    ];
    this.yearsT = [
      {
        id: '0',
        text: 'From',
      },
      {
        id: 'Present',
        text: 'Present',
      },
    ];

    for (let i = 1940; i <= 2051; i++) {
      this.yearsF.push({
        id: `${i}`,
        text: `${i}`,
      });
    }

    for (let i = 1945; i <= 2061; i++) {
      this.yearsT.push({
        id: `${i}`,
        text: `${i}`,
      });
    }

    this.optionsYearsF = {
      minimumResultsForSearch: 1,
      dropdownCssClass: 'academy-dropdown',
      placeholder: {
        id: '0', // the value of the option
        text: 'From',
      },
    };
    this.optionsYearsT = {
      minimumResultsForSearch: 1,
      dropdownCssClass: 'academy-dropdown',
      placeholder: {
        id: '0', // the value of the option
        text: 'To',
      },
    };
  }

  changeFromYear(year) {
    this.academiesInfo.from = year.value;
  }

  changeToYear(year) {
    this.academiesInfo.to = year.value;
  }

  // public onEventMessage () {
  //     this.dataServices.eventMessage.emit({
  //         id: this.academyId,
  //         type: 'muser'
  //     });
  // }
  onScrollDown() {
    if (this.page <= this.maxPage) {
      this.load = false;
      this.page += 1;
      this.subscrips.push(
        this.postService.getPostsById(this.userId, this.limit, this.page).subscribe(res => {
          this.posts = this.posts.concat(res.data);
          this.load = true;
        }),
      );
    }
  }
  onPostAdded(postData) {
    if (postData) {
      const post = postData;
      post.user = this.userProfile;
      this.posts.unshift(post);
    }
  }

  onRemovePost(id) {
    document.getElementById('post_' + id).style.display = 'none';
  }

  onChangeTab(event, tab: String) {
    this.profileTab = tab;
  }

  onNewAcademyInfo(event) {
    this.academiesInfo.action = 'add';
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

  onSubmitAcademy() {
    if (this.academiesInfo.from != 0 && this.academiesInfo.to != 0 && !this.validErrAcademy) {
      this.subscrips.push(
        this.profileService.saveAademyInfo({
          name: this.academyInfo,
          begin_date: this.academiesInfo.from,
          end_date: this.academiesInfo.to,
        }).subscribe(res => {
          if (res.status) {
            this.infoAcademies.unshift(res.data);
            this.hideAcademyInfoForm();
          }
        }),
      );
    }
    if (this.academyInfo == '') {
      this.validErrAcademy = true;
    } else {
      this.validErrAcademy = false;
    }
  }

  removeAcademyInfo(info) {
    this.subscrips.push(
      this.profileService.removeAademiesInfo(info.id).subscribe(res => {
        this.infoAcademies = this.infoAcademies.filter(Iinfo => Iinfo !== info);
      }),
    );
  }

  removeInfoPrize(prize) {
    this.subscrips.push(
      this.profileService.removePrizesInfo(prize.id).subscribe(res => {
        this.infoPrizes = this.infoPrizes.filter(IPrize => IPrize !== prize);
      }),
    );
  }

  i = 0;

  public onEventMessage() {
    this.dataServices.eventMessage.emit({
      type: 'user',
      user_id: this.userId,
    });
  }

  private hideAcademyInfoForm() {
    this.addingAcademy = false;
    this.academiesInfo = {
      from: 0,
      to: 0,
    };
    this.academyInfo = '';
    this.validErrAcademy = false;
  }

  private hidePrizeInfoForm() {
    this.addingPrizes = false;
    this.formPrizes.reset();
    this.prizesText = '';
  }

  onResetAcademy() {
    this.hideAcademyInfoForm();
  }

  onNewPrizesInfo() {
    this.addingPrizes = true;
  }

  onResetPrizes() {
    this.hidePrizeInfoForm();
  }

  onSubmitPrizes() {
    if (this.formPrizes.valid) {
      this.subscrips.push(
        this.profileService.savePrizesInfo({
          content: this.formPrizes.get('text').value,
        }).subscribe(res => {
          if (res.status) {
            this.infoPrizes.unshift(res.data);
            this.hidePrizeInfoForm();
          }
        }),
      );
    }
  }

  onFollowUser(id) {
    this.subscrips.push(
      this.profileService.addFollowingMe({
        friend_id: id,
      }).subscribe(res => {
        this.userProfile.count_followers += 1;
        this.isFolow = !this.isFolow;
      }),
    );
  }

  onFollowRemove(id) {
    this.subscrips.push(
      this.profileService.removeFollowingMe({
        friend_id: id,
      }).subscribe(res => {
        this.userProfile.count_followers -= 1;
        this.isFolow = !this.isFolow;
      }),
    );
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
  }

  ngOnDestroy() {
    cancelSubscription(this.subscrips);
  }

  toAcademy(academy) {
    this.router.navigate([`/academiy-datail/${academy}`]);
  }
}
