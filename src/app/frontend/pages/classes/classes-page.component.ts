import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { range, ceil, findIndex } from 'lodash';

import { ActivitiesService } from '../../../services/activity.service';
import { AcademiesService } from '../../../services/academies.service';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'opn-classes',
  templateUrl: './classes-page.component.html',
  styleUrls: ['./classes-page.component.scss', '../@theme/scss/theme.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    ActivitiesService,
    AcademiesService,
  ],
  // entryComponents: [UiPerPageComponent],
})
export class ClassesPageComponent implements OnInit {
  private isManager : Boolean = false;
  private academy_id;

  constructor(private academyService: AcademiesService,
              private activeRoute: ActivatedRoute,) {
    this.activeRoute.params.subscribe(params => {
      this.academy_id = params['id'];
    });
  }

  ngOnInit() {
  }

  onCheckManager(status) {
    this.isManager = status;
  }
}
