import { Component, OnInit,  ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ActivitiesService } from '../../../services/activity.service';
import { PaymentStripeComponent } from '../../../../components/payment-stripe/payment-stripe.component';

import { mapValues, ObjectIterator, ObjectIteratee, intersection, findIndex, take } from 'lodash';

import {
  differenceInMinutes,
} from 'date-fns';

import { ModalService } from '../components/modal/modal.service';

@Component({
  selector: 'opn-activity-view',
  templateUrl: './activity-view.component.html',
  styleUrls: ['./activity-view.component.scss', '../@theme/scss/theme.scss'],
  providers: [ActivitiesService],
})
export class ActivityViewPageComponent implements OnInit {
  private coverBg: Object = {};
  private activity: any = {};
  private userAvatar: any;
  private commentText: String = '';
  private activityId: Number;

  private types: Object = {
    'class': 'Class',
    'seminar': 'Seminar',
    'mat_event': 'Opn Mat',
    'others': 'Others',
  };
  private comments: any;
  private instructors: any = '';
  private techniques: any = '';
  private differenceDate = 0;
  private userSabscriptions: Array<Number> = [];
  private activitySabscriptions: Array<Number> = [];
  private isMember: any;
  private user: any;
  private join_activities: any;
  private maxJoinAvatar: any = 5;
  private rightCount = 0;
  private joinedCount = 0;
  private eventLoaded = false;
  private subscribeLoaded = false;
  private joinLoader = false;

  private modalAlert = '';

  private addComment: Boolean = true;

  @ViewChild(PaymentStripeComponent)
  public paymentStripe: PaymentStripeComponent;

  constructor(
    private titleService: Title,
    private activityService: ActivitiesService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private modalSrv: ModalService,
  ) {
  }
  ngOnInit() {
    this.activityService.getMe().subscribe(user => {
      this.user = user;
    });
    this.activeRoute.params.subscribe(param => {
      this.activityId = param.id;
      this.activityService.getActivityById(param.id).subscribe(activity => {
        console.log(activity);
        this.titleService.setTitle(activity.name);
        this.activity = activity;
        this.differenceDate = differenceInMinutes(new Date(activity.end_date), new Date());
        if (activity.join_activities) {
          this.isMember = findIndex(activity.join_activities, {user_id: this.activityService.userId()});
          this.join_activities = activity.join_activities;
          this.joinedCount = this.join_activities.length;
          if (this.join_activities.length > this.maxJoinAvatar) {
            this.rightCount = this.join_activities.length - this.maxJoinAvatar;
          }
          this.join_activities = take(activity.join_activities, this.maxJoinAvatar);
        }
        if (activity.teachers) {
          this.instructors = mapValues(activity.teachers, (v) => {
            return `${v.first_name} ${v.last_name}`;
          });
        }
        if (activity.techniques) {
          this.techniques = mapValues(activity.techniques, (v) => {
            return v.name;
          });
        }
        if (activity.subscriptions) {
          activity.subscriptions.forEach(el => {
            this.activitySabscriptions.push(el.id);
          });
        }
        this.eventLoaded = true;
      });
    });
    this.activityService.getUserMe().subscribe(user => {
      this.userAvatar = user.avatar;
    });
    this.coverBg = {
      background: `url(/assets/images/activity-bg.jpg) center no-repeat`,
      'background-size': 'cover',
    };
    this.activityService.getComments(this.activityId).subscribe(comments => {
      this.comments = comments.data;
    });
    this.getUserSubscriptions();
  }

  getUserSubscriptions() {
    this.activityService.getUserSubscriptions().subscribe(subscriptions => {
      this.userSabscriptions = subscriptions;
      const isSabscription = intersection(subscriptions, this.activitySabscriptions).length;
      this.activity.isSabscription = isSabscription;
      this.subscribeLoaded = true;
    });
  }

  onSaveComment(event) {
    if (this.commentText !== '') {
      this.activityService.addComment({
        activity_id: this.activityId,
        content: this.commentText,
      }).subscribe(res => {
        if (res.status) {
          this.commentText = '';
          this.comments.unshift(res.comment);
        }
      });
    }
  }

  onJoin(activity) {
    this.joinLoader = true;
    const isSabscription = intersection(this.userSabscriptions, this.activitySabscriptions).length;
    if (isSabscription > 0) {
      this.activityService.joinActivity({activity_id: activity.id}).subscribe(res => {
        if (res.status) {
          this.join_activities.push({user: this.user});
          this.isMember = 1;
          this.joinedCount += 1;
        }
        this.joinLoader = false;
      });
    }else if (activity.payment_status == 'free') {
      this.activityService.joinActivity({activity_id: activity.id}).subscribe(res => {
        if (res.status) {
          this.join_activities.push({user: this.user});
          this.isMember = 1;
          this.joinedCount += 1;
        }
        this.joinLoader = false;
      },
      err => {
        this.modalAlert = err.description;
        this.modalSrv.open('join-fail');
        this.joinLoader = false;
      });
    }else if (activity.payment_status == 'fee') {
      this.paymentStripe.showPayment();
      this.joinLoader = false;
    }
  }
  toProfile(user_id) {
    this.router.navigate(['profile', user_id]);
  }
  onRePay() {
    this.paymentStripe.showPayment();
    this.modalSrv.close('payment-fail');
  }
  onPay(token) {
    this.joinLoader = true;
    this.activityService.payActivity({
      activity_id: this.activityId,
      source: token.id,
      type: token.type,
    })
    .finally(() => {
      this.joinLoader = false;
    })
    .subscribe(
      res => {
        if (res.status) {
          this.join_activities.push({user: this.user});
          this.isMember = 1;
          this.joinedCount += 1;
          this.modalAlert = `The payment for "${this.activity.name}" was successful`;
          this.modalSrv.open('payment-success');
        }
      },
      err => {
        if (err.status == 400) {
          this.modalAlert = err.description;
          this.modalSrv.open('payment-fail');
        }
      });
  }
  toAcademy(academy) {
    this.router.navigate([`/academiy-datail/${academy}`]);
  }
}
