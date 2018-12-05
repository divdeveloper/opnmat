import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import {ShareButtonsModule} from 'ngx-sharebuttons';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { MessagePageRouting } from './message-page.routing';
import { MessagePageComponent } from './message-page.component';
import { PostService } from '../../../services/posts.service';

import { Select2Module } from 'ng2-select2';
import { ReactiveFormsModule } from '@angular/forms';
import { NgDatepickerModule } from '../../../../components/ng-datepicker';
import { BeltsModule } from '../../../../components/belts';
import { SelectAcademiesModule } from '../../../../components/select-acadimies';
import { TooltipModule } from 'ng2-tooltip';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

import { PagesModule } from '../pages.module';
import { ChatComponent } from './chat/chat.component';
import { DialogComponent } from './dialog/dialog.component';
import { MessagePageService } from './message-page.service';
import {UsersService} from '../../../services/users.service';

@NgModule({
  declarations: [
    MessagePageComponent,
    ChatComponent,
    DialogComponent,
  ],
  imports: [
    Select2Module,
    ReactiveFormsModule,
    NgDatepickerModule,
    BeltsModule,
    SelectAcademiesModule,
    TooltipModule,
    MessagePageRouting,
    CommonModule,
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
    MessagePageService,
    UsersService,
  ],
})
export class MessagePageModule { }
