import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import {ShareButtonsModule} from 'ngx-sharebuttons';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { ProfilePageRouting } from './profile-page.routing';
import { ProfilePageComponent } from './profile-page.component';
import { PostService } from '../../../services/posts.service';
import { ProfileService } from '../../../services/profile.service';

import { Select2Module } from 'ng2-select2';
import { ReactiveFormsModule } from '@angular/forms';
import { NgDatepickerModule } from '../../../../components/ng-datepicker';
import { BeltsModule } from '../../../../components/belts';
import { SelectAcademiesModule } from '../../../../components/select-acadimies';
import { TooltipModule } from 'ng2-tooltip';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

import { PagesModule } from '../pages.module';
import { ProfileComponentsModule } from '../components/profile/profile.module';

@NgModule({
  declarations: [
    ProfilePageComponent,
  ],
  imports: [
    Select2Module,
    ReactiveFormsModule,
    NgDatepickerModule,
    BeltsModule,
    SelectAcademiesModule,
    TooltipModule,
    ProfilePageRouting,
    CommonModule,
    InfiniteScrollModule,
    HttpClientModule,
    HttpModule,
    Ng4GeoautocompleteModule.forRoot(),
    PagesModule,
    ProfileComponentsModule,
  ],
  providers: [
    PostService,
    ProfileService,
    CookieService,
  ],
})
export class ProfilePageModule { }
