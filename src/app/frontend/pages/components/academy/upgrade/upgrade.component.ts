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
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';

import { AcademiesService } from '../../../../../services/academies.service';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'opn-upgrade-academy',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss'],
  providers: [ AcademiesService ],
})
export class UpgardeAcademyComponent implements OnInit {
  @Input() academyId: any;
  @Input() isPro: Boolean;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSetPro: EventEmitter<any> = new EventEmitter<any>();
  private step: any = 1;
  private promotion: String = '';
  private acceptStep2: Boolean = false;
  private acceptCreate: Boolean = false;
  private price: String = '';
  private subjectField: Subject<string> = new Subject();
  private subjectFieldType: Subject<any> = new Subject();
  private createDisabled: Boolean = false;

  private time: any = '';
  private attendance: any = '';

  constructor(private academyService: AcademiesService) {
  }

  ngOnInit() {
    this.subjectField.debounceTime(500).subscribe( (searchValue) => {
      this.acceptCreate = this.checkCreate();
      this.createDisabled = !this.checkCreate();
    });

    this.subjectFieldType.debounceTime(500).subscribe( (response) => {
      if (response.val && response.val != '') {
        this.acceptStep2 = true;
      }else {
        this.acceptStep2 = false;
      }
    });

    if (this.isPro) {
      this.getAcademyData();
      this.step = 2;
    }
  }
  getAcademyData() {
    this.academyService.getAcademyById(this.academyId).subscribe(res => {
      this.promotion = res.promotion_method;
      this.attendance = res.promotion_attendance;
      this.time = res.promotion_time;
      this.time = res.promotion_time;
      this.price = res.reg_price;
      this.onChangeTypeEvent('', this.promotion);
      this.acceptCreate = this.checkCreate();
    });
  }
  onChangeTypeEvent(event, type) {
    this.promotion = type;
    switch (type) {
      case 'time': {
        if (this.time && this.time != '') {
          this.acceptStep2 = true;
        }else {
          this.acceptStep2 = false;
        }
        break;
      }
      case 'attendance': {
        if (this.attendance && this.attendance != '') {
          this.acceptStep2 = true;
        }else {
          this.acceptStep2 = false;
        }
        break;
      }
    }
  }

  checkCreate(): Boolean {
    if (this.price != '') {
      return true;
    }
    return false;
  }

  onChangeField() {
    this.subjectField.next();
  }
  onChangeFieldType(val, type) {
    this.subjectFieldType.next({val: val, type: type});
  }

  onNextStep() {
    switch (this.step) {
      case 1: {
        this.step ++;
        break;
      }
      case 2: {
        if (this.promotion != '' && this.acceptStep2) {
          this.step ++;
        }
        break;
      }
    }
  }

  onPevStep() {
    this.step --;
  }

  onUpgrade() {
    let data = {
      promotion_method: this.promotion,
      is_pro: 1,
      reg_price: this.price
    };
    switch (this.promotion) {
      case 'time': {
        data[`promotion_${this.promotion}`] = this.time;
        break;
      }
      case 'attendance': {
        data[`promotion_${this.promotion}`] = this.attendance;
        break;
      }
    }

    this.academyService.upgradeToPro(this.academyId, data).subscribe(res => {
      if (res.status) {
        this.onSetPro.emit();
        this.step = 4;
      }
    });
  }
  onClose() {
    this.close.emit();
  }
}
