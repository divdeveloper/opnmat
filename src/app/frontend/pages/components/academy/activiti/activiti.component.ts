import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter,
  CalendarMonthViewDay,
} from 'angular-calendar';

import { Router } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivitiesService } from '../../../../../services/activity.service';
import {
  Broadcaster,
} from '../../../../../services/broadcaster';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import { CustomEventTitleFormatter } from './custom-event-title-formatter.provider';

import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

const colors: any = {
  yellow: {
    primary: '#fdb44d',
    secondary: 'rgba(253, 180, 77, 0.2)',
  },
  blue: {
    primary: '#4ca1ff',
    secondary: 'rgba(76, 161, 255, 0.2)',
  },
  purpure: {
    primary: '#fd4df7',
    secondary: 'rgba(253, 77, 247, 0.2)',
  },
  green: {
    primary: '#11e66b',
    secondary: 'rgba(17, 230, 107, 0.2)',
  },
};

const types: Object = {
  'class': 'Class',
  'seminar': 'Seminar',
  'mat_event': 'Opn Mat',
  'others': 'Others',
};

@Component({
  selector: 'opn-academy-activiti',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activiti.component.html',
  styleUrls: ['./activiti.component.scss'],
  providers: [
    ActivitiesService,
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
})
export class ActivitiAcademyComponent implements OnInit, OnDestroy {
  view: String = 'month';

  viewDate: Date = new Date();
  private actions: CalendarEventAction[] = [];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: Boolean = false;
  private activitiSubscribe: ISubscription;
  private activitiUpdateSubscribe: ISubscription;

  private tmpEvent: any = {};

  @Input() academyId: any;
  @Input() isManager: any;
  @Output() openUpdate: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(ModalConfirmComponent)
  public modalConfirm: ModalConfirmComponent;

  constructor(
    private activitiService: ActivitiesService,
    private broadcaster: Broadcaster,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.isManager) {
      this.actions = [
        {
          label: '<i class="event-edit"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.handleEvent('Edited', event);
          },
        },
        {
          label: '<i class="event-remove"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.handleEvent('Deleted', event);
          },
        },
      ];
    }
    this.activitiService.getActivitiesForCalendar(this.academyId).subscribe(events => {
      this.formatEvents(events, false);
    });
    this.registerActivitiBroadcast();
  }

  registerActivitiBroadcast() {
    this.activitiSubscribe = this.activitiService.on()
      .subscribe(obj => {
        const item: Array<any> = [];
        item.push(obj);
        this.formatEvents(item, false);
      });

      this.broadcaster.on<any>('update_event')
      .subscribe(updatedObj => {
        const item: Array<any> = [];
        item.push(updatedObj);
        this.formatEvents(item, true);
      });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  formatEvents(events, update?: Boolean) {
    events.forEach(event => {
      switch (event.type) {
        case 'seminar': {
          this.pushEvent(event, colors.purpure, update);
          break;
        }
        case 'mat_event': {
          this.pushEvent(event, colors.yellow, update);
          break;
        }
        case 'others': {
          this.pushEvent(event, colors.green, update);
          break;
        }
        case 'class': {
          this.pushEvent(event, colors.blue, update);
          break;
        }
      }
    });
  }

  pushEvent(event, color, update?: any) {
    if (!update) {
      this.events.push(
        {
          start: new Date(event.start_date),
          end: new Date(event.end_date),
          title: event.name,
          color: color,
          meta: {
            type: event.type,
            id: event.id,
            event: event,
          },
          actions: this.actions,
        },
      );
      this.refresh.next();
    }else {
      this.events.forEach((item, index) => {
        if (item.meta.id === event.id) {
          this.events[index] = {
            start: new Date(event.start_date),
            end: new Date(event.end_date),
            title: event.name,
            color: color,
            meta: {
              type: event.type,
              id: event.id,
              event: event,
            },
            actions: this.actions,
          };
        }
      });
      this.refresh.next();
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    const self = this;
    switch (action) {
      case 'Edited': {
          this.editEvent(event.meta.event);
        break;
      }
      case 'Deleted': {
        this.modalConfirm.open();
        this.tmpEvent = event;
        // this.activitiService.removeActivity(event.meta.id).subscribe(res => {
        //   self.events = self.events.filter(iEvent => iEvent !== event);
        //   self.refresh.next();
        // });
        break;
      }
      case 'Clicked': {
        this.router.navigate(['activity', event.meta.id]);
        break;
      }
    }
  }
  onConfirm(confirm) {
    if (confirm) {
      this.activitiService.removeActivity(this.tmpEvent.meta.id).subscribe(res => {
        this.events = this.events.filter(iEvent => iEvent !== this.tmpEvent);
        this.refresh.next();
      });
    }
  }
  editEvent(event) {
    this.openUpdate.emit(event);
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(cell => {
      const groups: any = {};
      cell.events.forEach((event: CalendarEvent<{ type: string }>) => {
        groups[types[event.meta.type]] = groups[types[event.meta.type]] || [];
        groups[types[event.meta.type]].push(event);
      });
      cell['eventGroups'] = Object.entries(groups);
    });
  }

  ngOnDestroy() {
    this.activitiSubscribe.unsubscribe();
  }
}
