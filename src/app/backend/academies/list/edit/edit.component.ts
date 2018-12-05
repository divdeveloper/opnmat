import {
  Component,
  OnInit
} from '@angular/core';
import {
  LocalDataSource
} from 'ng2-smart-table';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl
} from '@angular/forms';
import {
  Title
} from '@angular/platform-browser';

import {
  AcademiesService
} from '../../../../services/academies.service';

@Component({
  selector: 'opn-edit-academy',
  templateUrl: '../form.component.html',
})
export class EditComponent implements OnInit {
  public form1: FormGroup;
  academyModel: Object;
  user: any;
  academyId: any;
  title: String = 'Edit Academy';
  button: String = 'Edit';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private academyService: AcademiesService,
    private titleService: Title,
    private activeRoute: ActivatedRoute) {
    this.titleService.setTitle('Edit Academy');
  }

  ngOnInit() {
    const self = this;
    /*this.academyService.getAcademyById().subscribe(res => {

    })*/
    this.activeRoute.params.subscribe(params => {
      this.academyId = params['id'];
    });

    this.form1 = this.formBuilder.group({
      name: [null, [Validators.required]],
      location: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, Validators.required],
    });
    this.user = this.academyService.getMe();
    this.academyService.getAcademyById(this.academyId).subscribe(res => {
      this.form1.patchValue({
        name:    res.name,
        location: res.location,
        phone: res.phone,
        email: res.email,
      });
    });
  }

  isFieldValid1(field: string) {
    return !this.form1.get(field).valid && this.form1.get(field).touched;
  }

  displayFieldCss1(field: string) {
    return {
      'form-control-danger': this.isFieldValid1(field),
    };
  }

  onSubmit() {
    if (this.form1.valid) {
      this.academyModel = {
        email: this.form1.get('email').value,
        name: this.form1.get('name').value,
        location: this.form1.get('location').value,
        phone: this.form1.get('phone').value,
        user_id: this.user.id,
      };
      this.academyService.updateAcademies(this.academyId, this.academyModel).subscribe(res => {
        this.router.navigate(['/admin/academies/list']);
      });
    } else {
      this.validateAllFormFields(this.form1);
    }
  }

  onCancel() {
    this.router.navigate(['/admin/academies/list']);
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({
          onlySelf: true
        });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
