import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
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
import {
  ActivitiesService,
} from '../../../../../services/activity.service';

import {
  Broadcaster,
} from '../../../../../services/broadcaster';
import { ISubscription } from 'rxjs/Subscription';

import { GroupByPipe, OrderByPipe } from 'ngx-pipes';
import { keys, orderBy } from 'lodash';
import {format} from 'date-fns';

@Component({
  selector: 'opn-events-academy',
  templateUrl: './events-widget.component.html',
  styleUrls: ['./events-widget.component.scss'],
  providers: [GroupByPipe, OrderByPipe, ActivitiesService],
})
export class EventsAcademyComponent implements OnInit, AfterViewInit {
  private events: Array<any> = [];
  private dates: Array<any>;
  private allUrl: String;
  private styles: any = {};
  private page = 2;
  private more: Boolean = true;
  private activitiSubscribe: ISubscription;

  @Input() dataSource: Array<any> = [];
  @Input() allRedirect: String;
  @Input() academyId: String;
  @Input() type?: String;
  @ViewChild('eventsList')  eventsListRef: ElementRef;

  constructor(
    private router: Router,
    private groupBy: GroupByPipe,
    private orderPipe: OrderByPipe,
    private activityService: ActivitiesService,
    private broadcaster: Broadcaster,
  ) {}
  ngOnInit() {
    this.orderData(this.dataSource);
  }
  
  ngAfterViewInit() {
    if (this.eventsListRef) {
      const element = this.eventsListRef.nativeElement;
      const height = element.offsetHeight;
      this.styles = {
        'max-height': `${height}px`,
      };
    }
  }
  orderData(arr) {
    const events = this.groupBy.transform(arr, 'date');
    this.dates = orderBy(keys(events), ['date'], ['asc']);
    this.allUrl = this.allRedirect;
    this.events = events;
    this.dates.forEach(el => {
      this.events[el] = this.orderPipe.transform(events[el], 'time');
    });
  }
  onLoadMore(type) {
    this.activityService[type](this.academyId, this.page).subscribe(events => {
      if (events.length < 5) {
        this.more = false;
      }
      this.dataSource = this.dataSource.concat(events);
      this.orderData(this.dataSource);
      this.page += 1;
    });
  }
  private onRedirectTo(id) {
    this.router.navigate([`activity/${id}`]);
  }
}
