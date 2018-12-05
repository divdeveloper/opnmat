import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import {ShareButtonsModule} from 'ngx-sharebuttons';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { FollowersPageComponent } from './followers-page.component';
import { FollowersPageRouting } from './followers-page.routing';
import { ProfileService } from '../../../services/profile.service';
import { PostService } from '../../../services/posts.service';

import { ReactiveFormsModule } from '@angular/forms';

import { PagesModule } from '../pages.module';
import { ProfileComponentsModule } from '../components/profile/profile.module';

@NgModule({
  declarations: [
    FollowersPageComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FollowersPageRouting,
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
export class FollowersPageModule { }
