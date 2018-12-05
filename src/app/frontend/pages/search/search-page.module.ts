import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { DataService } from '../../../services/data.service';
import { ConfigService } from '../../../services/service.config';
import { SearchPageService } from './search-page.service';

import { SearchPageComponent } from './search-page.component';
import { SearchPageRoutingModule } from './search-page-routing.module';
import { PagesModule } from '../pages.module';
import { SelectModule } from 'ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmSnazzyInfoWindowModule } from '../../../../components/snazzy-info-window';
import { SearchActivityComponent } from './search-activity/search-activity.component';
import { SearchAcademyComponent } from './search-academy/search-academy.component';
import { SearchUsersComponent } from './search-users/search-users.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};


import { D3SliderDirective } from 'ng-d3-slider/d3-slider.directive';
import {UsersService} from '../../../services/users.service';
import {AngularMultiSelectModule} from '../../../../components/angular2-multiselect-dropdown';
import {DirectivesModule} from '../../../../directives/directives.module';
import {ClickOutsideModule} from 'ng4-click-outside';
import {ModalService} from '../components/modal/modal.service';
import { AcademyComponentsModule } from '../components/academy/academy.module';


@NgModule({
    imports: [
        CommonModule,
        SearchPageRoutingModule,
        PagesModule,
        DirectivesModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        NgbModule,
        AcademyComponentsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyB6CM0-9thYLeJAC5xFTOw-cQem-Y6cQPI',
            libraries: ['places'],
            language: 'en-US',
        }),
        PerfectScrollbarModule,
        AgmJsMarkerClustererModule,
        AgmSnazzyInfoWindowModule,
        AngularMultiSelectModule,
        ClickOutsideModule,
    ],
    declarations: [
        SearchPageComponent,
        SearchActivityComponent,
        SearchAcademyComponent,
        SearchUsersComponent,
        D3SliderDirective,
    ],
    providers: [
        ModalService,
        DataService,
        ConfigService,
        UsersService,
        SearchPageService,
        GoogleMapsAPIWrapper,
        {
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
        },
    ],
})
export class SearchPageModule { }
