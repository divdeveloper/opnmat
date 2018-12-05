import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Select2TemplateFunction, Select2OptionData } from 'ng2-select2';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import { TeachersService } from '../../../services/teachers.service';

@Component({
  selector: 'opn-new-teacher',
  templateUrl: '../form.teachers.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class NewTeacherComponent implements OnInit{
  contentPage: any;
  firstname: String;
  lastName: String;
  buttonText: String = 'New teacher';
  public academies: Array<Select2OptionData>;
  public optionsAcademy: Select2Options;
  private academy: any;
  private academyVal: any;

  constructor(
    private serviceTeacher: TeachersService, 
    private router: Router, 
    private activeRoute: ActivatedRoute,
    private toastr: ToastsManager,
  ) {
    this.firstname = '';
    this.lastName = '';
    this.academyVal = 0;
  }

  ngOnInit(){
    this.serviceTeacher.getAcademies().subscribe(res => {
      this.academies = res;
    });
  
    this.optionsAcademy = {
      minimumResultsForSearch: 1,
      dropdownCssClass: 'academy-dropdown',
      placeholder: {
        id: '0', // the value of the option
        text: 'All Academy'
      }
    };
  }
  public changeAcademy = function($e) {
    this.academy = $e.value;
  };
  onClick(el) {
    this.serviceTeacher.createTeacher({
        "first_name": this.firstname,
        "last_name": this.lastName,
        "academy_id": this.academy,
    })
    .subscribe(
      res => {
        if(res.status){
          this.router.navigate(['/admin/teachers/list']);
        }
      },
      err =>{
        const errore = JSON.parse(err._body).errors;
        const self = this;
        errore.forEach(function(el, i, arr){
          if (el.status == '400') {
            self.toastr.warning(el.description, 'Warning!');
          }
        });
      }
    )
  }
}
