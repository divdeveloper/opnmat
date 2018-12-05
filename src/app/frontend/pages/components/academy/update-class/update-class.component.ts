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
import {
  assign,
  update,
  unset,
} from 'lodash';

import {
  Subject,
} from 'rxjs/Subject';

import 'rxjs/add/operator/debounceTime';



@Component({
  selector: 'opn-update-class',
  templateUrl: './update-class.component.html',
  styleUrls: ['./update-class.component.scss'],
  providers: [ActivitiesService, DatePipe],
  entryComponents: [UiSelectComponent],
})
export class UpdateClassComponent implements OnInit {
  private step: any = 1;
  private dateOptions: Object;
  private startDate = new Date();

  private subjectField2: Subject < string > = new Subject();
  private subjectField3: Subject < string > = new Subject();

  private createDisabled: Boolean = false;


  @Input() academy: any;
  @Input() dataSource: any;

  @Output() close: EventEmitter < any > = new EventEmitter < any > ();

  modelEvent: any;
  acceptStep2: Boolean = true;
  acceptCreate: Boolean = true;
  time: any;

  teacherList = [];
  teachersSettings = {};

  subscriptionsList = [];
  subscriptionSettings = {};

  techniqueList = [];
  techniquesSettings = {};

  constructor(
    private datePipe: DatePipe,
    private activitiService: ActivitiesService,
    private broadcaster: Broadcaster,
  ) {}

  ngOnInit() {
    this.time = {
      start_t: `${getHours(new Date(this.dataSource.start_date))}:${getMinutes(new Date(this.dataSource.start_date))}:${getSeconds(new Date(this.dataSource.start_date))}`,
      end_t: `${getHours(new Date(this.dataSource.end_date))}:${getMinutes(new Date(this.dataSource.end_date))}:${getSeconds(new Date(this.dataSource.end_date))}`,
      start: new Date(this.dataSource.start_date),
      end: new Date(this.dataSource.end_date),
    };

    this.modelEvent = {
      academy_id: this.academy.id,
      location: this.academy.location,
      longitude: this.academy.longitude,
      latitude: this.academy.latitude,
      type: 'class',
      name: '',
      status_public: '0',
      payment_status: 'fee',
      price_all: '',
      subscriptions: [],
      amount: '',
      start_date: new Date(),
      end_date: addHours(new Date(), 1),
      teachers: [],
      techniques: [],
    };


    this.dateOptions = {
      minYear: 1970,
      maxYear: 2080,
      displayFormat: 'M[/] D[/] YYYY',
      barTitleFormat: 'MMMM YYYY',
      firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    };

    this.getSubscriptions();
    this.modelEvent.subscriptions = [];
    this.subscriptionSettings = {
      singleSelection: true,
      text: "",
      enableSearchFilter: true,
      classes: 'subscription-single',
    };

    this.getTeachers();
    this.teachersSettings = {
      singleSelection: false,
      text: '',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class',
    };

    this.getTechniques();
    this.techniquesSettings = {
      singleSelection: false,
      text: '',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class',
    };

    this.subjectField2.debounceTime(500).subscribe((searchValue) => {
      this.acceptStep2 = this.checkStep2();
    });
    this.subjectField3.debounceTime(500).subscribe((searchValue) => {
      this.acceptCreate = this.checkStep3();
    });

    this.getClassById();
  }

  getClassById() {
    this.activitiService.getActivityById(this.dataSource.id).subscribe(activity => {

      assign(this.modelEvent, activity);

      update(this.modelEvent, 'subscriptions', (subscription) => {
        return subscription.map(el => {
          return {
            id: el.id,
            itemName: el.name,
          }
        });
      });
      update(this.modelEvent, 'teachers', (teacher) => {
        return teacher.map(el => {
          return {
            id: el.id,
            itemName: `${el.first_name} ${el.last_name}`,
          }
        });
      });
      update(this.modelEvent, 'techniques', (technique) => {
        return technique.map(el => {
          return {
            id: el.id,
            itemName: el.name,
          }
        });
      });
    })
  }

  getSubscriptions() {
    this.activitiService.getSubscriptionsByAcademy(this.academy.id).subscribe(subscriptions => {
      this.subscriptionsList = subscriptions;
    });
  }

  getTeachers() {
    this.activitiService.getTeachersByAcademy(this.academy.id).subscribe(teachers => {
      this.teacherList = teachers;
    })
  }

  getTechniques() {
    this.activitiService.getTechniquesByAcademy(this.academy.id).subscribe(techniques => {
      this.techniqueList = techniques;
    })
  }

  onSubscriptionSelect(item: any) {
    this.subjectField2.next();
  }
  OnSubscriptionDeSelect(item: any) {
    this.subjectField2.next();
  }

  onTeacherSelect(item: any) {
    this.subjectField3.next();
  }
  OnTeacherDeSelect(item: any) {
    this.subjectField3.next();
  }
  onSelectAllTeacher(items: any) {
    this.subjectField3.next();
  }
  onDeSelectAllTeacher(items: any) {
    this.subjectField3.next();
  }

  onTechniqueSelect(item: any) {
    this.subjectField3.next();
  }
  OnTechniqueDeSelect(item: any) {
    this.subjectField3.next();
  }
  onSelectAllTechnique(items: any) {
    this.subjectField3.next();
  }
  onDeSelectAllTechnique(items: any) {
    this.subjectField3.next();
  }

  onChangeStatusPublic(event) {
    this.modelEvent.status_public = event.value;
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
    if (
      this.modelEvent.status_public == '0' &&
      this.modelEvent.name != '' &&
      this.modelEvent.amount != '' &&
      this.modelEvent.subscriptions.length > 0
    ) {
      console.log('if ', this.modelEvent);
      return true;
    } else if (
      this.modelEvent.status_public == '1' &&
      this.modelEvent.name != '' &&
      this.modelEvent.amount != '' &&
      this.modelEvent.price_all != '' &&
      this.modelEvent.subscriptions.length > 0
    ) {
      console.log('else if ', this.modelEvent);
      return true;
    } else {
      console.log('else ', this.modelEvent);
      return false;
    }
  }
  checkStep3() {
    console.log(this.modelEvent);
    if (this.modelEvent.teachers.length > 0 && this.modelEvent.techniques.length > 0) {
      return true;
    } else {
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
      case 1:
        {
          if (this.acceptStep2) {
            this.step++;
          }
          break;
        }
    }
  }
  onPevStep() {
    this.step--;
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
  onCreateActivity() {
    if (this.acceptCreate) {
      this.createDisabled = true;
      unset(this.modelEvent, 'updated_at');
      unset(this.modelEvent, 'created_at');
      unset(this.modelEvent, 'academy');
      unset(this.modelEvent, 'total_price');
      unset(this.modelEvent, 'join_activities');
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
