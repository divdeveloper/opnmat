import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Select2TemplateFunction, Select2OptionData } from 'ng2-select2';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import { ActivitiesService } from '../../../services/activity.service';

@Component({
  selector: 'opn-new-teacher',
  templateUrl: '../form.activity.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewActivityComponent implements OnInit {
  contentPage: any;
  firstname: String;
  lastName: String;
  buttonText: String = 'Create';
  title: String = 'Create Activiti';
  public academies: Array<Select2OptionData>;
  public optionsAcademy: Select2Options;
  private academy: any;
  private academyVal: any;
  type: String = 'special_event';
  name: String = '';
  location: String = '';
  payment: String = 'free';
  group: String = 'junior';
  rank: Number = 1;
  date: String;
  latitude: any;
  longitude: any;

  private gaAutocompleteStings: any = {
    showSearchButton: false,
    currentLocIconUrl: 'https://cdn4.iconfinder.com/data/icons/proglyphs-traveling/512/Current_Location-512.png',
    locationIconUrl: 'http://www.myiconfinder.com/uploads/iconsets/369f997cef4f440c5394ed2ae6f8eecd.png',
    recentStorageName: 'componentData4',
    noOfRecentSearchSave: 8,
    inputPlaceholderText: 'Address',
    inputString: '',
  };
  autoCompleteCallback1(event) {
    if (event.data) {
      this.location = event.data.formatted_address;
      const location = event.data.geometry.location;
      this.latitude = location.lat;
      this.longitude = location.lng;
    }
  }

  formatDate(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let second = date.getSeconds();
    let strTime = hours + ':' + minutes + ':' + second;
    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + strTime;
  }

  showPicker = false;
  myDate: Date = new Date();
  showDate = true;
  showTime = true;

  onTogglePicker() {
      if (this.showPicker === false) {
          this.showPicker = true;
      }
  }

  onValueChange(val: Date) {
    this.date = this.formatDate(val);
    this.myDate = val;
    console.log(val);
  }

  constructor(
    private serviceActivity: ActivitiesService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private toastr: ToastsManager,
  ) {
    this.firstname = '';
    this.lastName = '';
    this.academyVal = 0;
    this.date = this.formatDate(this.myDate);
  }

  ngOnInit() {
    this.serviceActivity.getAcademies().subscribe(res => {
      this.academies = res;
    });

    this.optionsAcademy = {
      minimumResultsForSearch: 1,
      dropdownCssClass: 'academy-dropdown',
      placeholder: {
        id: '0', // the value of the option
        text: 'Academy',
      },
    };
  }

  public changeAcademy = function($e) {
    this.academy = $e.value;
  };

  onClick(el) {
    this.serviceActivity.createActivity({
      academy_id: this.academy,
      name: this.name,
      type: this.type,
      location:  this.location,
      user_age_group: this.group,
      user_ranking: this.rank,
      payment_status: this.payment,
      date: this.date,
      longitude: this.longitude,
      latitude: this.latitude,
    })
    .subscribe(
      res => {
        if (res.status) {
          this.router.navigate(['/admin/activities/list']);
        }
      },
      err => {
        const errore = JSON.parse(err._body).errors;
        const self = this;
        errore.forEach(function(el, i, arr){
          if (el.status == '400') {
            self.toastr.warning(el.description, 'Warning!');
          }
        });
      },
    );
  }
}
