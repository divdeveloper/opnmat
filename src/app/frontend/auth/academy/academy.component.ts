import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select2TemplateFunction, Select2OptionData } from 'ng2-select2';
import { DatepickerOptions } from '../../../../components/ng-datepicker';
import { ClolorsBelt, Belts } from '../../../../components/belts';
import { TooltipModule } from 'ng2-tooltip';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AuthService } from '../../../services/auth/auth.service';

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
  selector: 'opn-academy',
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.d.scss'],
})

export class AcademyComponent implements OnInit, OnDestroy {

  public title = 'Registration';
  public belts: Array<Select2OptionData>;
  public academies: Array<Select2OptionData>;
  public weights: Array<Select2OptionData>;
  public optionsBelt: Select2Options;
  public optionsAcademy: Select2Options;
  public optionsWeight: Select2Options;
  private selected = {};

  public birthDay: Date;
  public dateOptions: DatepickerOptions;
  public form1: FormGroup;
  public form2: FormGroup;
  private belt: any = '0';
  private academy: any;
  private academyModel: any;
  private weight: any;

  public stape2: boolean;

  public slides : Array<any> = [];

  colorsBelt: Array<ClolorsBelt>;
  arrBelts: Array<Belts>;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private titleService: Title,
    private router: Router,
    private toastr: ToastsManager,
  ) {
    this.titleService.setTitle( this.title );
    this.stape2 = false;
  }

  private addNewSlide() {
    this.slides.push(
        {text:'Lorem Ipsum is simply dummy text of the printing and typesettin',title: 'You are what you opn mat 1'},
        {text:'Lorem Ipsum is simply dummy text of the printing and typesettin',title: 'You are what you opn mat 2'},
        {text:'Lorem Ipsum is simply dummy text of the printing and typesettin',title: 'You are what you opn mat 3',}
    );
  }

  ngOnInit() {
    this.addNewSlide();
    this.authService.getBeltColors('').subscribe(res => {
      this.colorsBelt = res;
      this.authService.getBeltStipiesBycolorId(res[0].id).subscribe(res => {
        this.arrBelts = res;
        this.belt = res[0].id;
      });
    });
    this.academies = [];
    this.titleService.setTitle( this.title );
    this.form1 = this.formBuilder.group({
      name: [null, [Validators.required]],
      location: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, Validators.required],
    });

    this.form2 = this.formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, Validators.required],
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

    this.belts = [
      {
        id: '0',
        text: 'Template 1',
        additional: {
            image: 'assets/images/belt.png',
            winner: '4',
        },
      },
      {
        id: '1',
        text: 'Template 2',
        additional: {
          image: 'assets/images/belt.png',
          winner: '3',
        },
      },
    ];
    this.weights = [{
      id: '0',
      text: 'Weight',
    }];

    for (let i = 1; i <= 250; i++) {
      this.weights.push({
        id: `${i}`,
        text: `${i}`,
      });
    }

    this.optionsBelt = {
      templateResult: this.templateResult,
      templateSelection: this.templateSelection,
      minimumResultsForSearch: -1,
    };

    this.optionsAcademy = {
      minimumResultsForSearch: 1,
      dropdownCssClass: 'academy-dropdown',
      disabled: true,
    };

    this.optionsWeight = {
      minimumResultsForSearch: 1,
      dropdownCssClass: 'academy-dropdown',
      placeholder: {
        id: '0', // the value of the option
        text: 'Weight',
      },
    };
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

  public changeAcademy = function($e) {
    this.academy = $e.value;
  };

  public changeWeight = function($e) {
    this.weight = $e.value;
  };

  public changeBeltColor = function(id) {
    this.belt = id;
  };

  isFieldValid1(field: string) {
    return !this.form1.get(field).valid && this.form1.get(field).touched;
  }

  displayFieldCss1(field: string) {
    return {
      'has-error': this.isFieldValid1(field),
    };
  }

  isFieldValid2(field: string) {
    return !this.form2.get(field).valid && this.form2.get(field).touched;
  }

  displayFieldCss2(field: string) {
    return {
      'has-error': this.isFieldValid2(field),
    };
  }

  onSubmit1() {
    if (this.form1.valid) {
      this.academyModel = {
        email: this.form1.get('email').value,
        name: this.form1.get('name').value,
        location: this.form1.get('location').value,
        phone: this.form1.get('phone').value,
      };
      this.academies.push({id: '0', text: this.form1.get('name').value});
      this.stape2 = true;
    }else {
      this.validateAllFormFields(this.form1);
    }
  }

  onSubmit2() {
    if (this.form2.valid) {
      this.authService.signup({
        user : {
          email: this.form2.get('email').value,
          password: this.form2.get('password').value,
          first_name: this.form2.get('firstName').value,
          last_name: this.form2.get('lastName').value,
          belt_id: this.belt,
          academy_id: 0,
          weight: this.weight,
          date: this.birthDay,
        },
        academy: this.academyModel,
      }).subscribe(res => {
        if (res.access_token) {
          if (this.authService.setToken(res.access_token, res.user.active_kode)) {
            this.router.navigate(['/auth/success']);
          }
        }
      },
      err => {
        const errore = JSON.parse(err._body).errors;
        const self = this;
        errore.forEach(function(el, i, arr){
          if (el.status === '400') {
            self.toastr.custom(el.description, 'Warning!');
          }
        });
      });
    } else {
      this.validateAllFormFields(this.form2);
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
      console.log('getBeltStipiesBycolorId: ', res);
      this.arrBelts = res;
    });
  }

  ngOnDestroy() {}
}
