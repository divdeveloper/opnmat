import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ElementRef,
  HostListener,
  forwardRef,
  ViewChild,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';
import {
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  setYear,
  eachDay,
  getDate,
  getMonth,
  getYear,
  getTime,
  isToday,
  isSameDay,
  isSameMonth,
  isSameYear,
  format,
  getDay,
  subDays,
  setDay,
  differenceInDays,
} from 'date-fns';
import {
  ISlimScrollOptions,
} from 'ngx-slimscroll';

export interface DatepickerOptions {
  minYear ? : number; // default: current year - 30
  maxYear ? : number; // default: current year + 30
  displayFormat ? : string; // default: 'MMM D[,] YYYY'
  barTitleFormat ? : string; // default: 'MMMM YYYY'
  firstCalendarDay ? : number; // 0 = Sunday (default), 1 = Monday, ..
  disable ? : Date;
}

@Component({
  selector: 'opn-ui-datepicker',
  templateUrl: 'ng-datepicker.component.html',
  styleUrls: ['ng-datepicker.component.sass'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiDatepickerComponent),
    multi: true,
  }, ],
})
export class UiDatepickerComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() options: DatepickerOptions;
  @Input() id: DatepickerOptions;

  isOpened: boolean;
  innerValue: Date;
  displayValue: string;
  displayFormat: string;
  date: Date;
  barTitle: string;
  barTitleFormat: string;
  minYear: number;
  maxYear: number;
  firstCalendarDay: number;
  view: string;
  disable: Date;
  years: {
    year: number;
    isThisYear: boolean
  }[];
  dayNames: string[];
  scrollOptions: ISlimScrollOptions;
  days: {
    date: Date;
    day: number;
    month: number;
    year: number;
    inThisMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isDisable: boolean;
  }[];

  @ViewChild('datepickerContainer', {
    read: ElementRef,
  }) datepickerContainerRef: ElementRef;

  @Output()
  changeDate: EventEmitter < any > = new EventEmitter < any > ();

  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

  get value(): Date {
    return this.innerValue;
  }

  set value(val: Date) {
    this.innerValue = val;
    this.onChangeCallback(this.innerValue);
  }

  constructor(private elementRef: ElementRef) {
    this.scrollOptions = {
      barBackground: '#DFE3E9',
      gridBackground: '#FFFFFF',
      barBorderRadius: '3',
      gridBorderRadius: '3',
      barWidth: '6',
      gridWidth: '6',
      barMargin: '0',
      gridMargin: '0',
    };
  }

  ngOnInit() {
    this.view = 'days';
    this.date = new Date();
    this.setOptions();
    this.initDayNames();
    this.initYears();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
    if ('options' in changes) {
      this.setOptions();
      this.initDayNames();
      this.init();
      this.initYears();
    }
  }

  setOptions(): void {
    this.minYear = this.options && this.options.minYear || getYear(this.date) - 30;
    this.maxYear = this.options && this.options.maxYear || getYear(this.date) + 30;
    this.displayFormat = this.options && this.options.displayFormat || 'MMM D[,] YYYY';
    this.barTitleFormat = this.options && this.options.barTitleFormat || 'MMMM YYYY';
    this.firstCalendarDay = this.options && this.options.firstCalendarDay || 0;
    this.disable = this.options && this.options.disable || this.date;
  }

  nextMonth(): void {
    this.date = addMonths(this.date, 1);
    this.init();
  }

  prevMonth(): void {
    this.date = subMonths(this.date, 1);
    this.init();
  }

  setDate(i: number): void {
    this.date = this.days[i].date;
    this.value = this.date;
    this.changeDate.emit(this.date);
    this.init();
    this.close();
  }

  setYear(i: number): void {
    this.date = setYear(this.date, this.years[i].year);
    this.init();
    this.initYears();
    this.view = 'days';
  }

  init(): void {
    const start = startOfMonth(this.date);
    const end = endOfMonth(this.date);

    this.days = eachDay(start, end).map(date => {
      return {
        date: date,
        day: getDate(date),
        month: getMonth(date),
        year: getYear(date),
        inThisMonth: true,
        isToday: isToday(date),
        isSelected: isSameDay(date, this.innerValue) && isSameMonth(date, this.innerValue) && isSameYear(date, this.innerValue),
        isDisable: (differenceInDays(date, this.disable) < 0) ? true : false,
      };
    });

    for (let i = 1; i <= getDay(start) - this.firstCalendarDay; i++) {
      const date = subDays(start, i);
      this.days.unshift({
        date: date,
        day: getDate(date),
        month: getMonth(date),
        year: getYear(date),
        inThisMonth: false,
        isToday: isToday(date),
        isSelected: isSameDay(date, this.innerValue) && isSameMonth(date, this.innerValue) && isSameYear(date, this.innerValue),
        isDisable: (differenceInDays(date, this.disable) < 0) ? true : false,
      });
    }

    this.displayValue = format(this.innerValue, this.displayFormat);
    this.barTitle = format(start, this.barTitleFormat);
  }

  initYears(): void {
    const range = this.maxYear - this.minYear;
    this.years = Array.from(new Array(range), (x, i) => i + this.minYear).map(year => {
      return {
        year: year,
        isThisYear: year === getYear(this.date)
      };
    });
  }

  initDayNames(): void {
    this.dayNames = [];
    const start = this.firstCalendarDay;
    for (let i = start; i <= 6 + start; i++) {
      const date = setDay(new Date(), i);
      this.dayNames.push(format(date, 'ddd'));
    }
  }

  toggleView(): void {
    this.view = this.view === 'days' ? 'years' : 'days';
  }

  toggle(): void {
    if (!this.isOpened) {
      this.datepickerContainerRef.nativeElement.classList.add('open');
    } else {
      this.datepickerContainerRef.nativeElement.classList.remove('open');
    }
    this.isOpened = !this.isOpened;
  }

  close(): void {
    this.isOpened = false;
    this.datepickerContainerRef.nativeElement.classList.remove('open');
  }

  writeValue(val: Date) {
    if (val) {
      this.date = val;
      this.innerValue = val;
      this.init();
      this.displayValue = format(this.innerValue, this.displayFormat);
      this.barTitle = format(startOfMonth(val), this.barTitleFormat);
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  @HostListener('document:click', ['$event']) onBlur(e: MouseEvent) {
    if (!this.isOpened) {
      return;
    }

    const input = this.elementRef.nativeElement.querySelector('.ngx-datepicker-input');
    if (e.target === input || input.contains( < any > e.target)) {
      return;
    }

    const container = this.elementRef.nativeElement.querySelector('.ngx-datepicker-calendar-container');
    if (container && container !== e.target && !container.contains( < any > e.target) && !( < any > e.target).classList.contains('year-unit')) {
      this.close();
    }
  }
}
