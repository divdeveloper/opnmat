import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import {ShareButtonsModule} from 'ngx-sharebuttons';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MomentModule } from 'angular2-moment';

import { ActivityViewPageRouting } from './activity-view.routing';
import { ActivityViewPageComponent } from './activity-view.component';

import { Select2Module } from 'ng2-select2';


import { PagesModule } from '../pages.module';
import { AcademyComponentsModule } from '../components/academy/academy.module';
import { JoinPipe } from './pipes/join-pipe-pipe';

@NgModule({
  declarations: [
    ActivityViewPageComponent,
    JoinPipe,
  ],
  imports: [
    Select2Module,
    FormsModule,
    ReactiveFormsModule,
    ActivityViewPageRouting,
    CommonModule,
    InfiniteScrollModule,
    HttpClientModule,
    HttpModule,
    PagesModule,
    AcademyComponentsModule,
    MomentModule,
  ],
  providers: [
    CookieService,
  ],
})
export class ActivityViewPageModule { }
