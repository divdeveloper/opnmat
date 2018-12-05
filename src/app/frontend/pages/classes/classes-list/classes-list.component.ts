import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { range, ceil, findIndex } from 'lodash';

import { cancelSubscription } from '../../../../providers/cancelSubscription';
import { ActivitiesService } from '../../../../services/activity.service';
import { AcademiesService } from '../../../../services/academies.service';
import { Title } from '@angular/platform-browser';

import {
  Broadcaster,
} from '../../../../services/broadcaster';
import {
  Subject,
} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'opn-classes-list',
  templateUrl: './classes-list.component.html',
  styleUrls: ['./classes-list.component.scss', '../../@theme/scss/theme.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    ActivitiesService,
    AcademiesService,
  ],
  // entryComponents: [UiPerPageComponent],
})
export class ClassesListComponent implements OnInit, OnDestroy {
  private academy_id: any;
  private classesData: Array<any> = [];
  public subscrips: Subscription[] = [];
  private per_page: any = 10;
  private page: any = 1;
  public academyProfile: any;
  public classModal: Boolean = false;
  public isManager: Boolean = false;
  private editClassSource: any;

  private pagintion: any;
  private subjectFilter: Subject < string > = new Subject();

  constructor(
    private activityService: ActivitiesService,
    private academyService: AcademiesService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private broadcaster: Broadcaster,
    private titleService: Title,
  ) {
    this.titleService.setTitle('List classes');
    this.activeRoute.params.subscribe(params => {
      this.academy_id = params['id'];
    });

    this.pagintion = {
      show: false,
      pages: [],
    };
  }

  ngOnInit() {
    this.getClasses(this.per_page, this.page, this.academy_id);
    this.getAcademyInfo();

    this.subjectFilter.debounceTime(500).subscribe((searchValue) => {
      this.page = 1;
      this.getClasses(this.per_page, this.page, this.academy_id, searchValue);
    });
    this.registerActivitiBroadcast();
  }

  private registerActivitiBroadcast() {
    this.broadcaster.on<any>('update_event')
      .subscribe(updatedObj => {
        updatedObj.subscriptions = [];
        this.updateObjectClass(updatedObj);
      });
  }

  updateObjectClass(obj) {
    this.classesData[findIndex(this.classesData, {id: obj.id})] = obj;
  }

  private getAcademyInfo() {
    this.academyService.getAcademyById(this.academy_id).subscribe( academy => {
      this.academyProfile = academy;
    });
  }

  private getClasses(limit, page, id, filter?) {
    this.subscrips.push(
      this.activityService.getClasssesByAcademy(limit, page, id, filter).subscribe(res => {
        this.classesData = res.data;
        this.Paginations(res.total);
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
    this.getClasses(this.per_page, page, this.academy_id);
    this.page = page;
  }

  public onChangePerPage(e) {
    this.per_page = e.value;
    this.getClasses(e.value, this.page, this.academy_id);
  }

  public onFilter(name) {
    this.subjectFilter.next(name);
  }

  onEditClass(data) {
    this.editClassSource = data;
    document.body.classList.add('openModal');
    this.classModal = true;
  }

  onRemoveClass(data) {
    const self = this;
    this.activityService.removeActivity(data.id).subscribe(res => {
      self.classesData = self.classesData.filter(iEvent => iEvent !== data);
    });
  }

  onCloseUpdateClass() {
    document.body.classList.remove('openModal');
    this.classModal = false;
  }

  toClass(id){
    this.router.navigate([`academiy-datail/${this.academy_id}/classes/${id}`]);
  }

  ngOnDestroy() {
    cancelSubscription(this.subscrips);
  }
  onCheckManager(status) {
    this.isManager = status;
  }
}
