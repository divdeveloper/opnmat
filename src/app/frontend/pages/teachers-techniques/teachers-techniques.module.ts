import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import {ShareButtonsModule} from 'ngx-sharebuttons';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';

import { TeachersTechniquesPageRouting } from './teachers-techniques.routing';
import { TeachersTechniquesPageComponent } from './teachers-techniques.component';
import { TeachersComponent } from './teachers/teachers.component';
import { TechniquesComponent } from './techniques/techniques.component';
import { PostService } from '../../../services/posts.service';
import { ProfileService } from '../../../services/profile.service';

import { ReactiveFormsModule } from '@angular/forms';

import { PagesModule } from '../pages.module';
import { AcademyComponentsModule } from '../components/academy/academy.module';

@NgModule({
  declarations: [
    TeachersTechniquesPageComponent,
    TeachersComponent,
    TechniquesComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InfiniteScrollModule,
    HttpClientModule,
    HttpModule,
    PagesModule,
    AcademyComponentsModule,
    TeachersTechniquesPageRouting,
    FormsModule,
  ],
  providers: [
    PostService,
    ProfileService,
    CookieService,
  ],
  entryComponents: [
    TeachersComponent,
    TechniquesComponent,
  ],
})
export class TeachersTechniquesPageModule { }
