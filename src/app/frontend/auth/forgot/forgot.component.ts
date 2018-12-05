import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AuthService } from '../../../services/auth/auth.service';
import { HeaderComponent } from '../inc/header/header.component';

@Component({
  selector: 'opn-academy',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.d.scss'],
})
export class ForgotComponent implements OnInit, OnDestroy {
  public title = 'Forgot password';
  public form: FormGroup;
  private kode: String;
  private subKode: any;
  public emailTmp: String;
  public sended = false;
  public slides : Array<any> = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private titleService: Title,
    private router: Router,
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

    this.titleService.setTitle( this.title );
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
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
      this.emailTmp = this.form.get('email').value;
      this.authService.forgotSend({
        email: this.form.get('email').value,
      }).subscribe(res => {
        if (res.status) {
          this.toastr.custom('An email has been sent to your rescure email address, ' + this.emailTmp + '. Follow the directions in the email to reset your password.', '');
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

  ngOnDestroy() {
  }
}
