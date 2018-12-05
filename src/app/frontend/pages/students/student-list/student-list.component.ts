import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { range, ceil, findIndex } from 'lodash';

import { cancelSubscription } from '../../../../providers/cancelSubscription';
import { StudentsService } from '../../../../services/students.service';
import {
  Subject,
} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'opn-students-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss', '../../@theme/scss/theme.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    StudentsService,
  ],
})
export class StudentListComponent implements OnInit, OnDestroy {
  public subscrips: Subscription[] = [];
  private status: any = 'all';
  private filterName: any = '';
  studentsData: any = [];
  academy_id: any;

  private subjectFilter: Subject < string > = new Subject();

  pagintion: any;
  private per_page: any = 8;
  private page: any = 1;

  constructor(
    private studentsSrv: StudentsService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
  ) {
    this.titleService.setTitle('List students');
    this.activeRoute.params.subscribe(params => {
      this.academy_id = params['id'];
    });
    this.pagintion = {
      show: false,
      pages: [],
    };
  }

  ngOnInit() {
    this.getStudents(this.academy_id, this.per_page, this.page);
    this.subjectFilter.debounceTime(500).subscribe((searchValue) => {
      this.getStudents(this.academy_id, this.per_page, this.page, (this.status == 'all') ? null : this.status, searchValue);
    });
  }

  getStudents(id, per_page, page, status?, name?) {
    this.subscrips.push(
      this.studentsSrv.getStudents(id, per_page, page, status, name).subscribe(students => {
        this.studentsData = students.data;
        this.Paginations(students.total);
      }),
    );
  }

  Paginations(total) {
    if (total > this.per_page) {
      this.pagintion.pages = range(1, ceil(total / this.per_page) + 1, 1);
      this.pagintion.show = true;
    }else {
      this.pagintion.show = false;
    }
  }

  onLoadPage(page) {
    this.getStudents(this.academy_id, this.per_page, page, this.status, this.filterName);
    this.page = page;
  }

  onChangeFilterStatus(val) {
    switch (val) {
      case 'all': {
        this.getStudents(this.academy_id, this.per_page, this.page, null, this.filterName);
        break;
      }
      case '0': {
        this.getStudents(this.academy_id, this.per_page, this.page, val, this.filterName);
        break;
      }
      case '1': {
        this.getStudents(this.academy_id, this.per_page, this.page, val, this.filterName);
        break;
      }
    }
  }
  onActivate(student) {
    this.subscrips.push(
      this.studentsSrv.setAcademyStatus(student.id, {
        'academy_status': 1,
      }).subscribe(res => {
        student.academy_status = 1;
      }),
    );
  }
  onDeactivate(student) {
    this.subscrips.push(
      this.studentsSrv.setAcademyStatus(student.id, {
        'academy_status': 0,
      }).subscribe(res => {
        student.academy_status = 0;
      }),
    );
  }
  onFilterName(name) {
    this.filterName = name;
    this.subjectFilter.next(name);
  }
  toDashboard(id) {
    this.router.navigate([`academiy-datail/${this.academy_id}/students/${id}/detail`]);
  }
  ngOnDestroy() {
    cancelSubscription(this.subscrips);
  }
}
