import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { cancelSubscription } from '../../../../../providers/cancelSubscription';

import { SubscriptionsService } from '../../../../../services/subscriptions.service';
import { PaymentStripeComponent } from '../../../../../../components/payment-stripe/payment-stripe.component';
import { ModalAcademyService } from '../modal/modal.service';


@Component({
  selector: 'opn-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [ SubscriptionsService ],
})
export class SubscriptionsComponent implements OnInit, OnDestroy {
  @ViewChild(PaymentStripeComponent)
  public paymentStripe: PaymentStripeComponent;
  public user;
  private academy_id: any;
  public subscrips: Subscription[] = [];
  private me: any;
  private selectSubscribe: any;
  private load: Boolean = true;

  public membership: Object = {
    '1_day': 'One day',
    '1_month': 'Month',
    '3_months': '3 month',
    '6_months': '6 month',
    '1_year': 'Year',
  };
  private subscriptions: Array<any> = [];
  private modalAlert: String = '';

  @Input() public type;

  constructor(
    private subscriptionsService: SubscriptionsService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private modalSrv: ModalAcademyService,
  ) {
    this.activeRoute.params.subscribe(params => {
      this.academy_id = params['id'];
    });
  }

  ngOnInit() {
    this.me = this.subscriptionsService.getMe();
    this.user = JSON.parse(localStorage.getItem('user'));
    if ( this.type == 'academy') {
        this.getAcademySubscriptions(this.academy_id);
    }
  }

  public getAcademySubscriptions(academy: number) {
    this.load = false;
    this.subscriptionsService.getSybscriptionsByAcademy(academy)
    .finally(() => {
      this.load = true;
    })
    .subscribe( (res) => {
      console.log(res);
        this.subscriptions = res;
    }, (err) => {
        console.log(err);
    })
  }

  onSignUp(subscribe) {
    this.paymentStripe.showPayment();
    this.selectSubscribe = subscribe;
  }
  onCancel(subscribe) {
    subscribe.joinLoader = true;
    this.subscrips.push(
      this.subscriptionsService.cancelSabscription({subscription_id: subscribe.id}).subscribe(res => {
        if (res.status) {
          subscribe.member = false;
          subscribe.joinLoader = false;
        }
      }),
    );
  }
  onRePay() {
    this.paymentStripe.showPayment();
    this.modalSrv.close('payment-fail');
  }

  // You have signed up to (name of subscription). Your trial ends in (number) days!
  onPay(token) {
    this.selectSubscribe.joinLoader = true;
    const data = {
      source: token.id,
      type: token.type,
      subscription_id: this.selectSubscribe.id,
    };
    this.subscrips.push(
      this.subscriptionsService.paySabscription(data).subscribe(res => {
        if (res.status) {
          this.selectSubscribe.member = true;
          if (this.selectSubscribe.trial_days) {
            this.modalAlert = `Your trial ends in (${this.selectSubscribe.trial_days}) days!`;
          }else {
            this.modalAlert = `You have signed up to "${this.selectSubscribe.name}".`;
          }
          this.modalSrv.open('payment-success');
          this.selectSubscribe.joinLoader = false;
        }
      },
      err => {
        if (err.status == 400) {
          this.modalAlert = err.description;
          this.modalSrv.open('payment-fail');
          this.selectSubscribe.joinLoader = false;
        }
      }),
    );
  }

  ngOnDestroy() {
    cancelSubscription(this.subscrips);
  }
}
