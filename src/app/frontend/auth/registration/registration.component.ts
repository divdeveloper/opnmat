import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { Select2TemplateFunction, Select2OptionData } from 'ng2-select2';
import { DatepickerOptions } from '../../../../components/ng-datepicker';
import { ClolorsBelt, Belts } from '../../../../components/belts';
import { TooltipModule } from 'ng2-tooltip';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {
  CookieService,
} from 'ngx-cookie-service';
import {
  split,
} from 'lodash';

import { AuthService } from '../../../services/auth/auth.service';
import { HeaderComponent } from '../inc/header/header.component';

export class PasswordValidation {
      static MatchPassword(AC: AbstractControl) {
        const password = AC.get('password').value; // to get value in input tag
        const confirmPassword = AC.get('passwordConfirm').value; // to get value in input tag
        if (password !== confirmPassword) {
            AC.get('passwordConfirm').setErrors( {MatchPassword: true} );
        } else {
            return null;
        }
      }
  }

@Component({
  selector: 'opn-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.d.scss'],
  providers: [ CookieService ],
})

export class RegistrationComponent implements OnInit, OnDestroy {

  public title = 'Registration';
  public belts: Array<Select2OptionData>;
  public academies: Array<Select2OptionData>;
  // public weights: Array<Select2OptionData>;
  public optionsBelt: Select2Options;
  public optionsAcademy: Select2Options;
  public optionsWeight: Select2Options;
  private selected = {};

  public birthDay: Date;
  public dateOptions: DatepickerOptions;
  public form: FormGroup;
  private belt: any = '0';
  private academy: any;
  private academyName: String;
  private weight: any;
  private validErrAcademy: Boolean;
  private ageType: String = 'junior';

  public slides: Array<any> = [];

  colorsBelt: Array<ClolorsBelt>;
  arrBelts: Array<Belts>;

  constructor(
    private _cookieService: CookieService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private titleService: Title,
    private router: Router,
    private toastr: ToastsManager) {
    this.titleService.setTitle( this.title );
    this.validErrAcademy = false;
  }
  private addNewSlide() {
    this.slides.push(
        {text: 'Lorem Ipsum is simply dummy text of the printing and typesettin', title: 'You are what you opn mat 1'},
        {text: 'Lorem Ipsum is simply dummy text of the printing and typesettin', title: 'You are what you opn mat 2'},
        {text: 'Lorem Ipsum is simply dummy text of the printing and typesettin', title: 'You are what you opn mat 3'},
    );
  }

  ngOnInit() {
    this.addNewSlide();
    this.authService.getBeltColors(`all,${this.ageType}`).subscribe(res => {
      this.colorsBelt = res;
      this.authService.getBeltStipiesBycolorId(res[0].id).subscribe(belts => {
        this.arrBelts = belts;
        this.belt = belts[0].id;
      });
    });

    this.titleService.setTitle( this.title );
    this.form = this.formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, Validators.required],
      weight: [null, Validators.required],
      // birthDay: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern('((?=.*[0-9])(?=.*[a-zA-Z]).{8,50})')]],
      passwordConfirm: [null, [Validators.required, Validators.pattern('((?=.*[0-9])(?=.*[a-zA-Z]).{8,50})')]],
    }, {
      validator: PasswordValidation.MatchPassword,
    });

    this.dateOptions = {
      minYear: 1970,
      maxYear: 2080,
      displayFormat: 'M[/] D[/] YYYY',
      barTitleFormat: 'MMMM YYYY',
      firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    };

    this.birthDay = new Date();


    // this.weights = [{
    //   id: '0',
    //   text: '',
    // }];

    // for (let i = 1; i <= 250; i++) {
    //   this.weights.push({
    //     id: `${i}`,
    //     text: `${i} lbs`,
    //   });
    // }

    this.optionsBelt = {
      templateResult: this.templateResult,
      templateSelection: this.templateSelection,
      minimumResultsForSearch: -1,
    };

    this.optionsAcademy = {
      minimumResultsForSearch: 1,
      dropdownCssClass: 'academy-dropdown',
      placeholder: {
        id: '0', // the value of the option
        text: 'Academy',
      },
    };

    this.optionsWeight = {
      minimumResultsForSearch: 1,
      dropdownCssClass: 'academy-dropdown',
      placeholder: {
        id: '0', // the value of the option
        text: '',
      },
    };
  }
  onChangeAge (e) {
    this.authService.getBeltColors(`all,${e.value}`).subscribe(res => {
      this.colorsBelt = res;
      this.authService.getBeltStipiesBycolorId(res[0].id).subscribe(belts => {
        this.arrBelts = belts;
        this.belt = belts[0].id;
      });
    });
  }

  private getAge(dateString): String {
      const today = new Date();
      const birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      return `${age}`;
  }

  // function for result template
  public templateResult: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
    if (!state.id) {
      return state.text;
    }
    let image = '<span class="image"></span>';
    if (state.additional.image) {
      image = '<span class="image select-belt"><img src="' + state.additional.image + '"/></span>';
    }
    return jQuery(image);
  }

  // function for selection template
  public templateSelection: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
    let image = '<span class="image"></span>';
    if (!state.id) {
      return state.text;
    }
    if (state.additional.image) {
      image = '<span class="image select-belt"><img src="' + state.additional.image + '"/></span>';
    }
    return jQuery(image);
  }

  public changeBelt = function($e) {
    this.belt = $e.value;
  };

  public setAcademy = function(academy) {
    this.academy = academy.id;
    this.academyName = academy.text;
    this.validErrAcademy = false;
  };

  public changeWeight = function($e) {
    this.weight = $e.value;
  };

  public changeBeltColor = function(id) {
    this.belt = id;
  };

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
    };
  }


  onSubmit() {
    if (this.form.valid && !this.validErrAcademy) {
      // const [month, day, year] = split(this.form.get('birthDay').value, '/');
      this.authService.signup({
        academy_name: this.academyName,
        user : {
          email: this.form.get('email').value,
          password: this.form.get('password').value,
          first_name: this.form.get('firstName').value,
          last_name: this.form.get('lastName').value,
          belt_id: `${this.belt}`,
          academy_id: this.academy,
          weight: this.form.get('weight').value,
          date: this.birthDay,
          // date: new Date(`${year}-${month}-${day}`),
        },
      }).subscribe(res => {
        if (res.access_token) {
          if (this.authService.setToken(res.access_token, res.user.active_kode)) {
            localStorage.setItem('email', res.user.email);
            localStorage.setItem('user', JSON.stringify(res.user));
            this._cookieService.delete('first_login');
            this.router.navigate(['/auth/success']);
          }
        }
      },
      err => {
        const errore = JSON.parse(err._body).errors;
        const self = this;
        errore.forEach(function(el, i, arr){
          if (el.status == '400') {
            self.toastr.custom(el.description, 'Warning!');
          }
        });
      });
    } else {
      this.validateAllFormFields(this.form);
    }
    if (this.academy == undefined) {
      this.validErrAcademy = true;
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onChangeColor(e) {
    this.authService.getBeltStipiesBycolorId(e).subscribe(res => {
      this.arrBelts = res;
    });
  }

  ngOnDestroy() {}
}
