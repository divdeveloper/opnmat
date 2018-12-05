import { LOCALE_ID, Inject } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { DatePipe } from '@angular/common';


export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {

   constructor(@Inject(LOCALE_ID) private locale: string) {
    super();
  }

  // you can override any of the methods defined in the parent class
  private types: Object = {
    'class': 'Class',
    'seminar': 'Seminar',
    'mat_event': 'Opn Mat',
    'others': 'Others',
  };

  month(event: CalendarEvent): string {
    return `<span class="time">${new DatePipe(this.locale).transform(
      event.start,
      'hh:mm a',
      )}</span><span class="title">${event.title}</span>
      <span class="more-info">${(event.meta.event.subscriptions && event.meta.event.subscriptions.length > 0)
      ? event.meta.event.subscriptions[0].subscription.name
      : (event.meta.event.payment_status == 'fee')
        ? '$' + event.meta.event.price_all
        : 'free'} </span>`;
  }
}
