import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';
import { Select2Module } from 'ng2-select2';
import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

import { ThemeModule } from '../../@theme/theme.module';
import { ActivityRoutingModule, routedComponents } from './activity-routing.module';
import { ActivitiesService } from '../../services/activity.service';
import { Broadcaster } from '../../services/broadcaster';
import { DateRenderComponent } from './list/date.render.component';
import { TypeRenderComponent } from './list/type.render.component';



@NgModule({
  imports: [
    ThemeModule,
    ActivityRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
    Select2Module,
    DatetimePopupModule,
    Ng4GeoautocompleteModule.forRoot(),
  ],
  declarations: [
    DateRenderComponent,
    TypeRenderComponent,
    ...routedComponents,
  ],
  providers: [
    ActivitiesService,
    Broadcaster,
  ],
  entryComponents: [
    DateRenderComponent,
    TypeRenderComponent,
  ],
})
export class ActivityModule { }
