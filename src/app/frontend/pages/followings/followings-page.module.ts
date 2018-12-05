import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import {ShareButtonsModule} from 'ngx-sharebuttons';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { FollowingsPageComponent } from './followings-page.component';
import { FollowingsPageRouting } from './followings-page.routing';
import { ProfileService } from '../../../services/profile.service';
import { PostService } from '../../../services/posts.service';

import { ReactiveFormsModule } from '@angular/forms';

import { PagesModule } from '../pages.module';
import { ProfileComponentsModule } from '../components/profile/profile.module';

@NgModule({
  declarations: [
    FollowingsPageComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FollowingsPageRouting,
    CommonModule,
    InfiniteScrollModule,
    HttpClientModule,
    HttpModule,
    PagesModule,
    ProfileComponentsModule,
  ],
  providers: [
    ProfileService,
    PostService,
    CookieService,
  ],
})
export class FollowingsPageModule { }
