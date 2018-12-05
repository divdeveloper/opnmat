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
} from '@angular/common';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AcademiesService } from '../../../../../services/academies.service';

@Component({
  selector: 'opn-new-academy',
  templateUrl: './new-academy.component.html',
  styleUrls: ['./new-academy.component.scss'],
  providers: [AcademiesService],
})
export class NewAcademyComponent implements OnInit {

  public form: FormGroup;
  private latitude: any;
  private longitude: any;
  private addres: any;
  private me: any;
  private created: any = false;
  private academyId: any;

  private gaAutocompleteStings: any = {
    showSearchButton: false,
    showCurrentLocation: false,
    currentLocIconUrl: 'https://cdn4.iconfinder.com/data/icons/proglyphs-traveling/512/Current_Location-512.png',
    locationIconUrl: 'http://www.myiconfinder.com/uploads/iconsets/369f997cef4f440c5394ed2ae6f8eecd.png',
    recentStorageName: 'componentData4',
    noOfRecentSearchSave: 8,
    inputPlaceholderText: 'Address',
    inputString: '',
  };

  @ViewChild('newCtegoryModalRef', {read: ElementRef}) newCtegoryModalRef: ElementRef;
  @Output() addedAcademy: EventEmitter <any> = new EventEmitter <any> ();
  @Output() closedModal: EventEmitter <any> = new EventEmitter <any> ();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private serviceAcademy: AcademiesService,
  ) {
    this.me = this.serviceAcademy.getMe();
  }

  ngOnInit() {
    this.modalOpen();
  }

  autoCompleteCallback1(event) {
    if (event.data) {
      this.addres = event.data.formatted_address;
      const location = event.data.geometry.location;
      this.latitude = location.lat;
      this.longitude = location.lng;
    }
  }

  private modalOpen() {
    this.form = this.formBuilder.group({
      name:  [null, Validators.required],
      phone: [null, Validators.required],
      email: [null , [Validators.email, Validators.required]],
      // password: [{ value: null }, [Validators.pattern('((?=.*[0-9])(?=.*[a-zA-Z]).{8,50})'), Validators.required]],
    });
    document.body.classList.add('openModal');
  }

  private closeModal() {
    this.newCtegoryModalRef.nativeElement.style.display = 'none';
    document.body.classList.remove('openModal');
    this.form.reset();
    this.closedModal.emit();
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
    };
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({
          onlySelf: true,
        });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onSubmit() {
    if (this.form.valid && this.addres != '') {
      this.serviceAcademy.addAcademies({
        email: this.form.get('email').value,
        name: this.form.get('name').value,
        phone: this.form.get('phone').value,
        location: this.addres,
        user_id: this.me.id,
        latitude: this.latitude,
        longitude: this.longitude,
      }).subscribe(res => {
        this.addedAcademy.emit(res);
        this.created = true;
        this.academyId = res.id;
      });
    } else {
      this.validateAllFormFields(this.form);
    }
  }
  onDone() {
    if (this.academyId) {
      document.body.classList.remove('openModal');
      this.router.navigate([`/academiy-datail/${this.academyId}`]);
    }else {
      this.closeModal();
    }
  }
}
