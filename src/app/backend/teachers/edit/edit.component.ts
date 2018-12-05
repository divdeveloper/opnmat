import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Select2TemplateFunction, Select2OptionData } from 'ng2-select2';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import { TeachersService } from '../../../services/teachers.service';

@Component({
  selector: 'opn-edit-teachers',
  templateUrl: '../form.teachers.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class EditTeacherComponent implements OnInit, OnDestroy {
  firstname: String;
  lastName: String;
  teacherId: any;
  buttonText: String = 'Update teacher';
  public academies: Array<Select2OptionData>;
  public optionsAcademy: Select2Options;
  private academy: any;
  private academyVal: any;

  constructor(
    private serviceTeacher: TeachersService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private toastr: ToastsManager
  ) {
    this.firstname = '';
    this.lastName = '';

    this.activeRoute.params.subscribe(params => {
      this.teacherId = params['id'];
    });
  }

  ngOnInit() {
    this.serviceTeacher.getAcademies().subscribe(res => {
      this.academies = res;
    });

    this.optionsAcademy = {
      minimumResultsForSearch: 1,
      dropdownCssClass: 'academy-dropdown',
      placeholder: {
        id: '0', // the value of the option
        text: 'Academy'
      }
    };

    this.serviceTeacher.getTeacherById(this.teacherId).subscribe(res => {
      console.log(res)
      this.firstname = res.last_name;
      this.lastName = res.first_name;
      this.academyVal = res.academy_id;
    });

  }

  public changeAcademy = function($e) {
    this.academy = $e.value;
  };

  onClick(el) {
    this.serviceTeacher.updateTeacher(this.teacherId, {
      "first_name": this.firstname,
      "last_name": this.lastName,
      "academy_id": this.academy,
    }).subscribe(
      res => {
        if (res.status) {
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
  );
  }
  ngOnDestroy() {
  }
}
