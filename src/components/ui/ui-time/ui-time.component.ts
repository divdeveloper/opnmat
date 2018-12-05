import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';

import {
  Location,
  DatePipe,
} from '@angular/common';

import {
  subHours,
  addHours,
  getHours,
  getMinutes,
  endOfHour,
  setHours,
  setMinutes,
} from 'date-fns';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'opn-ui-time',
  templateUrl: './ui-time.component.html',
  styleUrls: ['./ui-time.component.scss'],
  providers: [DatePipe],
})
export class UiTimeComponent implements OnInit {

  @Input() date: Date;


  @Output()
  changeTime: EventEmitter < any > = new EventEmitter < any > ();

  @ViewChild('timePicker', {
    read: ElementRef,
  }) timePickerRef: ElementRef;
  @ViewChild('hour', {
    read: ElementRef,
  }) hourRef: ElementRef;
  @ViewChild('minute', {
    read: ElementRef,
  }) minuteRef: ElementRef;

  @HostListener('document:mouseup', ['$event'])
  onMouseUp() {
    if (this.open) {
      this.closeTimePicker();
    }
  }
  private time: any;
  private hours: any;
  private minutes: any;
  private amnet: any;
  private open = false;

  constructor(private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.setTime(this.datePipe.transform(this.date, 'shortTime'));
  }
  onClick(e) {
    e.stopPropagation();
  }
  setTime(time12h) {
    const [time, modifier] = time12h.split(' ');
    const [hours, minutes] = time.split(':');
    this.time = this.datePipe.transform(setHours(this.date, hours), 'shortTime');
    this.time = this.datePipe.transform(setMinutes(this.date, minutes), 'shortTime');
    this.hours = hours;
    this.minutes = minutes;
    this.amnet = modifier;
  }
  closeTimePicker() {
    this.timePickerRef.nativeElement.classList.remove('open');
    this.open = false;
  }
  onToggle(e) {
    this.open = !this.open;
    if (this.open) {
      this.timePickerRef.nativeElement.classList.add('open');
    }else {
      this.timePickerRef.nativeElement.classList.remove('open');
    }
  }

  onHourStepUp(hour) {
    this.changeHours('+');
  }
  onHourStepDown() {
    this.changeHours('-');
  }

  onMinuteStepUp() {
    this.changeMinutes('+');
  }
  onMinuteStepDown() {
    this.changeMinutes('-');
  }
  changeHours(type) {
    switch (type) {
      case '+': {
        if (this.hours < 12) {
          this.hours = +this.hours + 1;
        }
        break;
      }
      case '-': {
        if (this.hours > 1) {
          this.hours = +this.hours - 1;
        }
        break;
      }
    }
  }
  changeMinutes(type) {
    switch (type) {
      case '+': {
        if (this.minutes < 59) {
          this.minutes = +this.minutes + 1;
        }
        break;
      }
      case '-': {
        if (this.minutes > 0) {
          this.minutes = +this.minutes - 1;
        }
        break;
      }
    }
  }
  onCheckHours(hours) {
    if (hours > 12) {
      this.hours = 12;
    }
    if (hours < 1) {
      this.hours = 1;
    }
  }
  onCheckMinutes(minutes) {
    if (minutes > 59) {
      this.minutes = 0;
    }
    if (minutes < 0) {
      this.minutes = 0;
    }
  }

  convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return hours + ':' + minutes + ':00';
  }

  onToggleAmnet() {
    switch (this.amnet) {
      case 'AM': {
        this.amnet = 'PM';
        break;
      }
      case 'PM': {
        this.amnet = 'AM';
        break;
      }
    }
  }
  onSetTime() {
    this.time = `${this.hours}:${this.minutes} ${this.amnet}`;
    this.changeTime.emit(this.convertTime12to24(this.time));
    this.closeTimePicker();
  }
}
