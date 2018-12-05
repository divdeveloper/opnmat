import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from 'ng-select';
import { Subscription } from 'rxjs/Subscription';
import { cancelSubscription } from '../../../providers/cancelSubscription';
import { SubscriptionsService } from './subscriptions.service';
import { FormErrorsService } from '../../../providers/form-errors.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'opn-create-subscriptions',
    templateUrl: './create-subscriptions.component.html',
    styleUrls: ['./create-subscriptions.component.scss', '../@theme/scss/theme.scss'],
    providers: [ SubscriptionsService ],
})
export class CreateSubscriptionsComponent implements OnInit, OnDestroy {
  public checkbox: boolean = false;
  public isLoading: boolean = false;
  public membership: Array<IOption> = [
    {label: 'One day', value: '1_day'},
    {label: 'Month', value: '1_month'},
    {label: '3 Months', value: '3_month'},
    {label: '6 Months', value: '6_month'},
    {label: 'Year', value: '1_year'},
  ];
  public subscriptions = [];
  public idAcademy: number;
  public formSubscription: FormGroup;
  public user;
  public trial: boolean = false;
  public edit: boolean = false;
  public editId;
  public subscrips: Subscription[] = [];


  public formErrors = {
      name: '',
      price: '',
      membership: '',
      registration_fee: '',
      trial_days: '',
      age: ''
  };

  @ViewChild('elMembership') public elMembership;

  constructor(private fb: FormBuilder,
              private subService: SubscriptionsService,
              private formErrorsService: FormErrorsService,
              private activeRoute: ActivatedRoute,
              private router: Router) {
      this.activeRoute.params.subscribe(params => {
          this.idAcademy = params['id'];
      });

  }

  ngOnInit() {
      this.user = JSON.parse(localStorage.getItem('user'));
      console.log(this.user);
      this.getSubscriptions(this.user.id, this.idAcademy);
      this.buildForm(this.idAcademy);
  }

  public getSubscriptions(id: number, academyId: number) {
      this.subscrips.push(this.subService.getSubscriptions(id, academyId)
          .subscribe( (res) => {
              this.subscriptions = res.data;
          }, (err) => {
              console.log(err);
          })
    )
  }

  public buildForm(academyId) {
    this.formSubscription = this.fb.group({
      academy_id: [academyId],
      name: ['', Validators.required],
      price: ['', [
          Validators.required,
          Validators.pattern('[0-9]*')
      ]],
      membership: ['', Validators.required],
      registration_fee: ['100', [Validators.required]],
      trial_days: [null, Validators.pattern('[0-9]*')],
      age: ['5-10'],
      information: ['']
    });

    this.formSubscription.valueChanges.subscribe((data) => this.onValueChange(data));
  }

  public toggleTrial() {
      this.trial = !this.trial;
  }

  public onValueChange (data?) {
      this.formErrors = this.formErrorsService.getErrors(this.formSubscription, this.formErrors, data);
  }

  ngOnDestroy() {
      cancelSubscription(this.subscrips);
  }

  public setValue(data) {
      this.editId = data.id;
      this.formSubscription.controls['name'].setValue(data.name);
      this.formSubscription.controls['price'].setValue(data.price);
      this.formSubscription.controls['registration_fee'].setValue(data.registration_fee);
      this.formSubscription.controls['trial_days'].setValue(data.trial_days);
      this.formSubscription.controls['age'].setValue(data.age);
      this.formSubscription.controls['information'].setValue(data.information);
      this.trial = !!data.trial_days;
      const membership = data.membership;
      this.elMembership.select(membership);
      this.formSubscription.controls['membership'].setValue(membership);
  }

  public editSubscription(subscribe){
    this.edit = true;
    this.setValue(subscribe);
  }

  public updateSubscription(form){
      this.isLoading = true;
      this.subscrips.push(this.subService.updateSubscription(this.editId, form.value)
          .subscribe((res)=> {
              const data = res.subscription;
              const i = this.subscriptions.findIndex( (el) => {
                  return el.id === data.id;
              });
              this.subscriptions[i] = data;
              this.resetForm();
              this.isLoading = false;
          }, (err) => {
              console.log(err);
          })
      );
  }

  public deleteSubscription(id: number){
      this.subscrips.push(this.subService.deleteSubscription(id)
        .subscribe((res) => {
            this.subscriptions = this.subscriptions.filter((el) => {
                return el.id !== id;
            });
        }, (err) => {
            console.log(err);
        })
      );
  }

  public resetForm (){
      this.formSubscription.reset();
      this.formSubscription.controls['academy_id'].setValue(this.idAcademy);
      this.formSubscription.controls['age'].setValue('5-10');
      this.edit = false;
      this.editId = '';
  }

  public onSendForm(form) {
      this.isLoading = true;
      this.subscrips.push(this.subService.createSubscription(form.value)
          .subscribe((res)=> {
              this.subscriptions.unshift(res.subscription);
              this.isLoading = false;
              this.resetForm();
          }, (err) => {
              console.log(err);
          })
      );
  }

}
