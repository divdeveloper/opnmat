import {Component, OnInit,  ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {range, ceil, findIndex} from 'lodash';

import {ActivitiesService} from '../../../services/activity.service';
import {AcademiesService} from '../../../services/academies.service';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'opn-activities',
  templateUrl: './activities-page.component.html',
  styleUrls: ['./activities-page.component.scss', '../@theme/scss/theme.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    ActivitiesService,
    AcademiesService,
  ],
  // entryComponents: [UiPerPageComponent],
})
export class ActivitiesPageComponent implements OnInit {
  private isManager : Boolean = false;
  private academy_id;

  constructor(private academyService: AcademiesService,
              private activeRoute: ActivatedRoute,) {
    this.activeRoute.params.subscribe(params => {
      this.academy_id = params['id'];
      console.log(this.academy_id);
    });
  }

  ngOnInit() {
  }

  onCheckManager(status) {
    this.isManager = status;
  }
}
