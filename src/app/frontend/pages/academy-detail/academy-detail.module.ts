import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import {ShareButtonsModule} from 'ngx-sharebuttons';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { AcademyDetailPageRouting } from './academy-detail.routing';
import { AcademyDetailPageComponent } from './academy-detail.component';
import { PostService } from '../../../services/posts.service';
import { ProfileService } from '../../../services/profile.service';

import { Select2Module } from 'ng2-select2';
import { ReactiveFormsModule } from '@angular/forms';
import { NgDatepickerModule } from '../../../../components/ng-datepicker';
import { BeltsModule } from '../../../../components/belts';
import { SelectAcademiesModule } from '../../../../components/select-acadimies';
import { TooltipModule } from 'ng2-tooltip';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';

import { PagesModule } from '../pages.module';
import { AcademyComponentsModule } from '../components/academy/academy.module';


@NgModule({
  declarations: [
    AcademyDetailPageComponent,
  ],
  imports: [
    Select2Module,
    ReactiveFormsModule,
    NgDatepickerModule,
    BeltsModule,
    SelectAcademiesModule,
    TooltipModule,
    AcademyDetailPageRouting,
    CommonModule,
    InfiniteScrollModule,
    HttpClientModule,
    HttpModule,
    Ng4GeoautocompleteModule.forRoot(),
    PagesModule,
    AcademyComponentsModule,
    LazyLoadImagesModule,
  ],
  providers: [
    PostService,
    ProfileService,
    CookieService,
  ],
})
export class AcademyDetailPageModule { }
