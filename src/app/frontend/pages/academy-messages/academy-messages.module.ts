import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import {ShareButtonsModule} from 'ngx-sharebuttons';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { PostService } from '../../../services/posts.service';

import { Select2Module } from 'ng2-select2';
import { ReactiveFormsModule } from '@angular/forms';
import { NgDatepickerModule } from '../../../../components/ng-datepicker';
import { BeltsModule } from '../../../../components/belts';
import { SelectAcademiesModule } from '../../../../components/select-acadimies';
import { TooltipModule } from 'ng2-tooltip';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

import { PagesModule } from '../pages.module';
import {UsersService} from '../../../services/users.service';
import {AcademyChatComponent} from './chat/academy-chat.component';
import {AcademyDialogComponent} from './dialog/academy-dialog.component';
import {AcademyMessagesComponent} from './academy-messages.component';
import {AcademyMessagesService} from './academy-messages.service';
import {AcademyMessagesRouting} from './academy-messages.routing';
import {AcademyComponentsModule} from '../components/academy/academy.module';

@NgModule({
  declarations: [
    AcademyMessagesComponent,
    AcademyChatComponent,
    AcademyDialogComponent,
  ],
  imports: [
    AcademyComponentsModule,
    Select2Module,
    ReactiveFormsModule,
    NgDatepickerModule,
    BeltsModule,
    SelectAcademiesModule,
    TooltipModule,
    CommonModule,
    AcademyMessagesRouting,
    InfiniteScrollModule,
    HttpClientModule,
    HttpModule,
    Ng4GeoautocompleteModule.forRoot(),
    // ShareButtonsModule.forRoot(),
    PagesModule,
  ],
  providers: [
    PostService,
    CookieService,
    AcademyMessagesService,
    UsersService,
  ],
})
export class AcademyMessagesModule { }
