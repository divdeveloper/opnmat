import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {Ng4GeoautocompleteModule} from 'ng4-geoautocomplete';

import {DataService} from '../../../services/data.service';
import {ConfigService} from '../../../services/service.config';

import {SettingsPageComponent} from './settings-page.component';
import {SettingsPageRoutingModule} from './settings-page.routing.module';
import {PagesModule} from '../pages.module';
import {SelectModule} from 'ng-select';
import {AcademyComponentsModule} from '../components/academy/academy.module';
import {ClickOutsideModule} from 'ng4-click-outside';

@NgModule({
    imports: [
        CommonModule,
        SettingsPageRoutingModule,
        PagesModule,
        FormsModule,
        ClickOutsideModule,
        ReactiveFormsModule,
        Ng4GeoautocompleteModule.forRoot(),
        SelectModule,
        AcademyComponentsModule,
    ],
    declarations: [
        SettingsPageComponent,
    ],
    providers: [
        DataService,
        ConfigService,
    ]
})
export class SettingsPageModule {
}
