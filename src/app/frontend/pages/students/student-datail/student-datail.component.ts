import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';


import { cancelSubscription } from '../../../../providers/cancelSubscription';

import { StudentsService } from '../../../../services/students.service';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'opn-student-datail',
  templateUrl: './student-datail.component.html',
  styleUrls: ['./student-datail.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    StudentsService,
    AuthService,
  ],
})
export class StudentDatailComponent implements OnInit, OnDestroy {
  studentId: any;
  public subscrips: Subscription[] = [];
  private userData: any;
  private belt: any;
  private avatar: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private studentsService: StudentsService,
  ) {
    this.activeRoute.params.subscribe(params => {
      this.studentId = params['student'];
    });
  }
  
  ngOnInit() {
    this.getUserData(this.studentId);
  }

  getUserData(id) {
    this.subscrips.push(
      this.studentsService.getUserData().subscribe(res => {
        this.userData = res;
      }),
    );
  }

  ngOnDestroy() {
    cancelSubscription(this.subscrips);
  }
}
