import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import {ShareButtonsModule} from 'ngx-sharebuttons';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { CreateSubscriptionsPageRouting } from './create-subscriptions.routing';
import { CreateSubscriptionsComponent } from './create-subscriptions.component';
import { PostService } from '../../../services/posts.service';

import { Select2Module } from 'ng2-select2';
import { ReactiveFormsModule } from '@angular/forms';
import { NgDatepickerModule } from '../../../../components/ng-datepicker';
import { BeltsModule } from '../../../../components/belts';
import { SelectAcademiesModule } from '../../../../components/select-acadimies';
import { TooltipModule } from 'ng2-tooltip';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

import { PagesModule } from '../pages.module';
import { DataService } from '../../../services/data.service';
import { SelectModule } from 'ng-select';
import { FormErrorsService } from '../../../providers/form-errors.service';
import { AcademyComponentsModule } from '../components/academy/academy.module';

@NgModule({
  declarations: [
    CreateSubscriptionsComponent,
  ],
  imports: [
    Select2Module,
    FormsModule,
    ReactiveFormsModule,
    NgDatepickerModule,
    BeltsModule,
    SelectAcademiesModule,
    TooltipModule,
    CreateSubscriptionsPageRouting,
    CommonModule,
    InfiniteScrollModule,
    HttpClientModule,
    HttpModule,
    Ng4GeoautocompleteModule.forRoot(),
    // ShareButtonsModule.forRoot(),
    PagesModule,
    SelectModule,
    AcademyComponentsModule,
  ],
  providers: [
    PostService,
    CookieService,
    DataService,
    FormErrorsService,
  ],
})
export class CreateSubscriptionsPageModule { }
