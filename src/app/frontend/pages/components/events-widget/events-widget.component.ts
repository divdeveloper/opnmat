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
} from '../../../../services/activity.service';

import { GroupByPipe, OrderByPipe } from 'ngx-pipes';
import { keys, orderBy } from 'lodash';

@Component({
  selector: 'opn-events-widget',
  templateUrl: './events-widget.component.html',
  styleUrls: ['./events-widget.component.scss'],
  providers: [GroupByPipe, OrderByPipe, ActivitiesService],
})
export class EventsWidgetComponent implements OnInit, AfterViewInit {
  private events: Array<any> = [];
  private dates: Array<any>;
  private allUrl: String;
  private styles: any = {};
  private page = 2;
  private more: Boolean = true;
  @Input() dataSource: Array<any>;
  @Input() allRedirect: String;
  @Input() type?: String;
  @Input() academyId?: any;
  @ViewChild('eventsList')  eventsListRef: ElementRef;
  constructor(
    private router: Router,
    private groupBy: GroupByPipe,
    private orderPipe: OrderByPipe,
    private activityService: ActivitiesService,
  ) {}
  ngOnInit() {
    console.log('this.dataSource ', this.dataSource);
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
    if (type === 'getEventsByAcademy') {
      this.activityService[type](this.academyId, this.page).subscribe(events => {
        if (events.length < 5) {
          this.more = false;
        }
        this.dataSource = this.dataSource.concat(events);
        this.orderData(this.dataSource);
        this.page += 1;
      });
    }else {
      this.activityService[type](50, this.page).subscribe(events => {
        if (events.length < 5) {
          this.more = false;
        }
        this.dataSource = this.dataSource.concat(events);
        this.orderData(this.dataSource);
        this.page += 1;
      });
    }
  }
  private onRedirectTo(id) {
    this.router.navigate([`activity/${id}`]);
  }
}
