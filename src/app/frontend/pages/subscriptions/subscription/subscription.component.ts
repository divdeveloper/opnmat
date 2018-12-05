import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SubscriptionsService } from '../../../../services/subscriptions.service';
import { Subscription } from 'rxjs/Subscription';
import { cancelSubscription } from '../../../../providers/cancelSubscription';

@Component({
  selector: 'opn-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [SubscriptionsService],
})
export class SubscriptionComponent implements OnInit {
  public subscrips: Subscription[] = [];
  private subscriptions: Array<any> = [];
  public membership: Object = {
    'one': 'One',
    'month': 'Month',
    '3_months': '3 month',
  };

  private load: Boolean = true;

  constructor(
    private subscribeSrv: SubscriptionsService,
  ) { }

  ngOnInit() {
    this.getMeSubscriptions();
  }
  getMeSubscriptions() {
    this.load = false;
    this.subscrips.push(
      this.subscribeSrv.getSybscriptionsByUser().subscribe(subscribes => {
        console.log(subscribes);
        this.subscriptions = subscribes;
        this.load = true;
      }),
    );
  }

  onCancel(subscribe) {
    const self = this;
    this.subscrips.push(
      this.subscribeSrv.cancelSabscription({subscription_id: subscribe.id}).subscribe(res => {
        console.log('Cenceled process: ', res);
        if (res) {
          self.subscriptions = self.subscriptions.filter(iSubscribe => iSubscribe.subscription !== subscribe);
        }
      }),
    );
  }

}
