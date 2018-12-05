import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

import { DataService } from '../../../services/data.service';
import { ConfigService } from '../../../services/service.config';
import { ContactsPageService } from './contacts-page.service';

import { ContactsPageComponent } from './contacts-page.component';
import { ContactsPageRoutingModule } from './contacts-page-routing.module';
import { PagesModule } from '../pages.module';
import { SelectModule } from 'ng-select';

@NgModule({
    imports: [
        CommonModule,
        ContactsPageRoutingModule,
        PagesModule,
        FormsModule,
        ReactiveFormsModule,
        Ng4GeoautocompleteModule.forRoot(),
        SelectModule
    ],
    declarations: [
        ContactsPageComponent
    ],
    providers: [
        DataService,
        ConfigService,
        ContactsPageService
    ]
})
export class ContactsPageModule { }
