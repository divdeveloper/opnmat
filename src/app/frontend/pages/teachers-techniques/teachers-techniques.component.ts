import { Component, OnInit,  ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { AcademiesService } from '../../../services/academies.service';

@Component({
  selector: 'opn-teachers-techniques',
  templateUrl: './teachers-techniques.component.html',
  styleUrls: ['./teachers-techniques.component.scss', '../@theme/scss/theme.scss'],
  providers: [
    AcademiesService,
  ],
})
export class TeachersTechniquesPageComponent implements OnInit {
  title = 'Teachers & Techniques';
  private isManager: Boolean = false;
  private academyId: Number;
  private isPro: Boolean = false;
  private openPro: Boolean = false;

  public formTeachers: FormGroup;
  public formTeacher: FormGroup;

  constructor(
    private titleService: Title,
    private academyService: AcademiesService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.titleService.setTitle(this.title);
    this.activeRoute.params.subscribe(params => {
      this.academyId = params['id'];
    });

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
  ngOnInit() {}

  onCheckManager(status) {
    this.isManager = status;
  }
}
