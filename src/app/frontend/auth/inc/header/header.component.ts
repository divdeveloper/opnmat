import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'opn-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.d.scss'],
})
export class HeaderComponent implements OnInit {
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastsManager,
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern('((?=.*[0-9])(?=.*[a-zA-Z]).{8,50})')]],
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
      this.authService.login({
        email: this.form.get('email').value,
        password: this.form.get('password').value,
      }).subscribe(res => {
        if (res.access_token) {
          if (this.authService.setToken(res.access_token, res.user.active_kode)) {
            this.router.navigate(['/']);
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
}
