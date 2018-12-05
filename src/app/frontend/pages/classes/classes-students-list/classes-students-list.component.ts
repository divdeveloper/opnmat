import {Component, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {Subscription} from 'rxjs/Subscription';
import {range, ceil, findIndex} from 'lodash';
import { ActivitiesService } from '../../../../services/activity.service';

import {cancelSubscription} from '../../../../providers/cancelSubscription';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'opn-classes-students-list',
  templateUrl: './classes-students-list.component.html',
  styleUrls: ['./classes-students-list.component.scss', '../../@theme/scss/theme.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    ActivitiesService,
  ],
})
export class ClassesStudentsListComponent implements OnInit, OnDestroy {
  public subscrips: Subscription[] = [];
  private status: any = 'all';
  private filterName: any = '';
  studentsData: any = [];
  academy_id: any;
  activity_id: any;


  pagintion: any;
  private per_page: any = 8;
  private page: any = 1;
  private activity: any;

  constructor(private activitiesService: ActivitiesService,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private titleService: Title,) {
    this.activeRoute.params.subscribe(params => {
      this.activity_id = params['class'];
    });
    this.pagintion = {
      show: false,
      pages: [],
    };
  }

  ngOnInit() {
    this.getActivityStudents()
  }

  getActivityStudents() {
    this.subscrips.push(
      this.activitiesService.getActivityById(this.activity_id).subscribe(activity => {
        this.titleService.setTitle(activity.name);
        this.activity = activity;
        console.log(activity);
        this.Paginations(activity.total);
      }),
    );
  }

  Paginations(total) {
    if (total > this.per_page) {
      this.pagintion.pages = range(1, ceil(total / this.per_page) + 1, 1);
      this.pagintion.show = true;
    } else {
      this.pagintion.show = false;
    }
  }

  onLoadPage(page) {
    this.getActivityStudents();
    this.page = page;
  }

  ngOnDestroy() {
    cancelSubscription(this.subscrips);
  }
}
