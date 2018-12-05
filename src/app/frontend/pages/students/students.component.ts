import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { AcademiesService } from '../../../services/academies.service';

@Component({
  selector: 'opn-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss', '../@theme/scss/theme.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [AcademiesService],
})
export class StudentsComponent implements OnInit {
  private academyId: any;
  private isManager: Boolean = false;

  constructor(
    private academyService: AcademiesService,
    private activeRoute: ActivatedRoute,
  ) {
    this.activeRoute.params.subscribe(params => {
      this.academyId = params['id'];
    });
  }

  ngOnInit() {
  }

  onCheckManager(status) {
    this.isManager = status;
  }
}
