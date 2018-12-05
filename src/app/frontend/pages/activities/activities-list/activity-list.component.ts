import 'rxjs/add/operator/debounceTime';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { range, ceil, findIndex } from 'lodash';

import { cancelSubscription } from '../../../../providers/cancelSubscription';
import { ActivitiesService } from '../../../../services/activity.service';
import { AcademiesService } from '../../../../services/academies.service';
import {
  UiPerPageComponent,
} from '../../../../../components/ui/ui-per-page/ui-per-page.component';
import { Title } from '@angular/platform-browser';

import {
  Broadcaster,
} from '../../../../services/broadcaster';
import {
  Subject,
} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'opn-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss', '../../@theme/scss/theme.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    ActivitiesService,
    AcademiesService,
  ],
  // entryComponents: [UiPerPageComponent],
})
export class ActivityListComponent implements OnInit, OnDestroy {
  private academy_id: any;
  private activitiesData: Array<any> = [];
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
    this.getActivities(this.per_page, this.page, this.academy_id);
    this.getAcademyInfo();

    this.subjectFilter.debounceTime(500).subscribe((searchValue) => {
      this.page = 1;
      this.getActivities(this.per_page, this.page, this.academy_id, searchValue);
    });
    this.registerActivitiBroadcast();
  }

  private registerActivitiBroadcast() {
    this.broadcaster.on<any>('update_event')
      .subscribe(updatedObj => {
        this.updateObjectClass(updatedObj);
      });
  }

  updateObjectClass(obj) {
    this.activitiesData[findIndex(this.activitiesData, {id: obj.id})] = obj;
  }

  private getAcademyInfo() {
    this.academyService.getAcademyById(this.academy_id).subscribe( academy => {
      this.academyProfile = academy;
    });
  }

  private getActivities(limit, page, id, filter?) {
    this.subscrips.push(
      this.activityService.getActivitiesByAcademy(limit, page, id, filter).subscribe(res => {
        this.activitiesData = res.data;
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
    this.getActivities(this.per_page, page, this.academy_id);
    this.page = page;
  }

  public onChangePerPage(e) {
    this.per_page = e.value;
    this.getActivities(e.value, this.page, this.academy_id);
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
      self.activitiesData = self.activitiesData.filter(iEvent => iEvent !== data);
    });
  }

  onCloseUpdateClass() {
    document.body.classList.remove('openModal');
    this.classModal = false;
  }

  toActivity(id){
    console.log(id);
    this.router.navigate([`academiy-datail/${this.academy_id}/activities/${id}`]);
  }

  ngOnDestroy() {
    cancelSubscription(this.subscrips);
  }
  onCheckManager(status) {
    this.isManager = status;
  }
}
