import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  Location,
  DatePipe,
} from '@angular/common';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';

import {
  addHours,
  setHours,
  setMinutes,
  setSeconds,
  getTime,
  getHours,
  getMinutes,
  getSeconds,
  format,
  differenceInDays,
} from 'date-fns';

import {
  ActivitiesService,
} from '../../../../../services/activity.service';
import {
  Broadcaster,
} from '../../../../../services/broadcaster';
import {
  UiSelectComponent,
} from '../../../../../../components/ui/ui-select/ui-select.component';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'opn-update-activity',
  templateUrl: './update-activiti.component.html',
  styleUrls: ['./update-activiti.component.scss'],
  providers: [ActivitiesService, DatePipe],
  entryComponents: [UiSelectComponent],
})
export class UpdateActivitiComponent implements OnInit {
  private step: any = 1;
  private dateOptions: Object;
  private startDate = new Date();

  private subjectField2: Subject<string> = new Subject();
  private subjectField3: Subject<string> = new Subject();

  private createDisabled: Boolean = false;
  @Input() dataSource: any;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  modelEvent: any;
  acceptStep2: Boolean = true;
  acceptCreate: Boolean = true;
  time: any;

  constructor(
    private datePipe: DatePipe,
    private activitiService: ActivitiesService,
    private broadcaster: Broadcaster,
  ) {
  }

  ngOnInit() {
    this.time = {
      start_t: `${getHours(new Date(this.dataSource.start_date))}:${getMinutes(new Date(this.dataSource.start_date))}:${getSeconds(new Date(this.dataSource.start_date))}`,
      end_t: `${getHours(new Date(this.dataSource.end_date))}:${getMinutes(new Date(this.dataSource.end_date))}:${getSeconds(new Date(this.dataSource.end_date))}`,
      start: new Date(this.dataSource.start_date),
      end: new Date(this.dataSource.end_date),
    };
    this.modelEvent = {
      academy_id: this.dataSource.academy_id,
      type: this.dataSource.type,
      name: this.dataSource.name,
      status_public: this.dataSource.status_public,
      payment_status: this.dataSource.payment_status,
      price_all: this.dataSource.price_all,
      about: this.dataSource.about,
      amount: this.dataSource.amount,
      start_date: new Date(this.dataSource.start_date),
      end_date: new Date(this.dataSource.end_date),
    };
    this.dateOptions = {
      minYear: 1970,
      maxYear: 2080,
      displayFormat: 'M[/] D[/] YYYY',
      barTitleFormat: 'MMMM YYYY',
      firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    };

    this.subjectField2.debounceTime(500).subscribe( (searchValue) => {
      this.acceptStep2 = this.checkStep2();
    });
    this.subjectField3.debounceTime(500).subscribe( (searchValue) => {
      this.acceptCreate = this.checkStep3();
    });
  }

  onChangeTypeEvent(event, type) {
    event.target.classList.add('active');
    this.modelEvent.type = type;
  }

  onChangePayment(event: Boolean) {
    this.modelEvent.payment_status = (!event) ? 'free' : 'fee';
    this.modelEvent.price_all = '';
    this.acceptStep2 = this.checkStep2();
  }

  onChangeStartDate(event) {
    if (differenceInDays(new Date(event), this.modelEvent.end_date) > 0) {
      this.modelEvent.end_date = new Date(event);
    }
    this.setTimeToStartDate(this.time.start_t);
  }

  onChangeEndDate(event) {
    if (differenceInDays(this.modelEvent.start_date, new Date(event)) > 0) {
      this.modelEvent.start_date = new Date(event);
    }
    this.setTimeToEndDate(this.time.end_t);
  }

  checkStep2() {
    if (this.modelEvent.payment_status == 'free' && this.modelEvent.name != '' && this.modelEvent.about != '') {
      return true;
    }else if (this.modelEvent.payment_status == 'fee' && this.modelEvent.price_all != '' && this.modelEvent.name != '' && this.modelEvent.about != '') {
      return true;
    }else {
      return false;
    }
  }
  checkStep3() {
    if (this.modelEvent.amount != '') {
      return true;
    }else {
      return false;
    }
  }
  onChangeField2() {
    this.subjectField2.next();
  }

  onChangeField3() {
    this.subjectField3.next();
  }
  onNextStep() {
    switch (this.step) {
      case 1: {
        if (this.modelEvent.type != '') {
          this.step ++;
        }
        break;
      }
      case 2: {
        if (this.acceptStep2) {
          this.step ++;
        }
        break;
      }
    }
  }
  onPevStep() {
    this.step --;
    if (this.step == 1) {
      this.modelEvent.type = '';
    }
    if (this.step == 2) {
      this.acceptStep2 = this.checkStep2();
    }
  }

  setTimeToStartDate(time) {
    const [hours, minutes, seconds] = time.split(':');
    this.modelEvent.start_date = setHours(this.modelEvent.start_date, hours);
    this.modelEvent.start_date = setMinutes(this.modelEvent.start_date, minutes);
    this.modelEvent.start_date = setSeconds(this.modelEvent.start_date, seconds);
  }

  setTimeToEndDate(time) {
    const [hours, minutes, seconds] = time.split(':');
    this.modelEvent.end_date = setHours(this.modelEvent.end_date, hours);
    this.modelEvent.end_date = setMinutes(this.modelEvent.end_date, minutes);
    this.modelEvent.end_date = setSeconds(this.modelEvent.end_date, seconds);
  }

  onChangeStartTime(time) {
    this.time.start_t = time;
    this.setTimeToStartDate(time);
  }
  onChangeEndTime(time) {
    this.time.end_t = time;
    this.setTimeToEndDate(time);
  }
  onUpdateActivity() {
    if (this.acceptCreate) {
      this.createDisabled = true;
      this.modelEvent.end_date = format(this.modelEvent.end_date, 'YYYY-MM-DD HH:mm:ss');
      this.modelEvent.start_date = format(this.modelEvent.start_date, 'YYYY-MM-DD HH:mm:ss');
      this.activitiService.updateActivity(this.modelEvent, this.dataSource.id).subscribe(res => {
        if (res.status) {
          this.broadcaster.broadcast('update_event', res.activity);
          this.close.emit();
        }
      });
    }
  }
  onClose() {
    this.close.emit();
  }
}
