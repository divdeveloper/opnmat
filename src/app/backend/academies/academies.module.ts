import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { AcademiesRoutingModule, routedComponents } from './academies-routing.module';
import { AcademiesService } from '../../services/academies.service';
import { NameRenderComponent } from './list/name-render.component';
import { DateRenderComponent } from './list/date-render.component';


@NgModule({
  imports: [
    ThemeModule,
    AcademiesRoutingModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    ...routedComponents,
    NameRenderComponent,
    DateRenderComponent,
  ],
  providers: [
    AcademiesService,
  ],
  entryComponents: [
    NameRenderComponent,
    DateRenderComponent,
  ],
})
export class AcademiesModule { }
