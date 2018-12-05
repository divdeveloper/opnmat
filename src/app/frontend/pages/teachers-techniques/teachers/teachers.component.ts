import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { TeachersService } from '../../../../services/teachers.service';
import { findIndex } from 'lodash';

@Component({
  selector: 'opn-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss'],
  providers: [
    TeachersService,
  ],
})
export class TeachersComponent implements OnInit {

  public formTeachers: FormGroup;
  public formTeacher: FormGroup;
  private teachersArr: any = [];

  @Input() academyId: Number;
  private updateTeacher: Boolean = false;
  private newTeacherShow: Boolean = false;

  constructor(
    private teacherService: TeachersService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {

    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    };
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
         this.router.navigated = false;
         window.scrollTo(0, 0);
      }
    });
  }
  ngOnInit() {
    this.buildFormTeachers();
    this.getTeachers(this.academyId);
    this.buildFormTeacher({});
  }

  getTeachers(academy_id) {
    this.teacherService.getTeachersByAcademy(academy_id).subscribe(teachers => {
      this.teachersArr = teachers;
    });
  }


  private buildFormTeachers() {
    this.formTeachers = this.fb.group({
      name: ['', Validators.required],
    });
  }

  private buildFormTeacher(teacher) {
    this.formTeacher = this.fb.group({
      id: [(teacher.id) ? teacher.id : 0],
      name: [(teacher.first_name) ? `${teacher.first_name} ${teacher.last_name}` : '', Validators.required],
    });
  }

  private onOpenEdit(e, teacher) {
    const top = e.toElement.parentElement.offsetTop - 13;
    this.buildFormTeacher(teacher);
    this.updateTeacher = true;
    document.getElementById('update-teacher').style.cssText  = `top: ${top}px; height: auto;`;
  }
  private onRemove(teacher) {
    const self = this;
    this.teacherService.removeTeacher(teacher.id).subscribe(res => {
      if (res.status) {
        self.teachersArr = self.teachersArr.filter(iTeacher => iTeacher !== teacher);
      }
    });
  }
  private onCreateTeacher(teacher) {
    const [first_name, last_name] = teacher.value.name.replace(' ', '|').split('|');
    const obj = {
      academy_id: this.academyId,
      first_name: first_name,
      last_name: (last_name) ? last_name : '',
    };
    this.teacherService.createTeacher(obj).subscribe(res => {
      if (res.status) {
        this.teachersArr.unshift(res.data);
        this.buildFormTeachers();
      }
    })
  }
  private onUpdateTeacher(teacher) {
    const [first_name, last_name] = teacher.value.name.replace(' ', '|').split('|');
    const obj = {
      academy_id: this.academyId,
      first_name: first_name,
      last_name: (last_name) ? last_name : '',
    };
    this.teacherService.updateTeacher(teacher.value.id, obj).subscribe(res => {
      if (res.status) {
        const i = findIndex(this.teachersArr, {id: teacher.value.id});
        this.teachersArr[i].first_name = first_name;
        this.teachersArr[i].last_name = (last_name) ? last_name : '';
        document.getElementById('update-teacher').style.cssText  = `top: ${top}px; height: 0;`;
        this.buildFormTeacher({});
      }
    })
  }
}
