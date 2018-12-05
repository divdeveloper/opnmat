import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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
  selector: 'opn-academy',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.d.scss'],
})
export class ResetComponent implements OnInit, OnDestroy {
  public title = 'Forgot password';
  public form: FormGroup;
  private kode: String;
  private subKode: any;
  public slides: Array<any> = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private titleService: Title,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private toastr: ToastsManager,
  ) {}
  private addNewSlide() {
    this.slides.push(
        {text:'Lorem Ipsum is simply dummy text of the printing and typesettin',title: 'You are what you opn mat 1'},
        {text:'Lorem Ipsum is simply dummy text of the printing and typesettin',title: 'You are what you opn mat 2'},
        {text:'Lorem Ipsum is simply dummy text of the printing and typesettin',title: 'You are what you opn mat 3',}
    );
  }

  ngOnInit() {
    this.addNewSlide();
    this.subKode = this.activeRoute.params.subscribe(params => {
        this.kode = params['kode'];
    });

    this.titleService.setTitle( this.title );
    this.form = this.formBuilder.group({
      password: [null, [Validators.required, Validators.pattern('((?=.*[0-9])(?=.*[a-zA-Z]).{8,50})')]],
      passwordConfirm: [null, [Validators.required, Validators.pattern('((?=.*[0-9])(?=.*[a-zA-Z]).{8,50})')]],
    }, {
      validator: PasswordValidation.MatchPassword,
    });

  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
    };
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.ResetPassword({
        password: this.form.get('password').value,
      }, this.kode ).subscribe(res => {
        if (res) {
            this.router.navigate(['/auth/login']);
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

  ngOnDestroy() {}
}
