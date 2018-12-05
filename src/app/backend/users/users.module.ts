import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';

import { ThemeModule } from '../../@theme/theme.module';
import { AcademiesRoutingModule, routedComponents } from './users-routing.module';
import { UsersService } from '../../services/users.service';
import { DateRenderComponent } from './list/date-render.component';


@NgModule({
  imports: [
    ThemeModule,
    AcademiesRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
  ],
  declarations: [
    ...routedComponents,
    DateRenderComponent,
  ],
  providers: [
    UsersService,
  ],
  entryComponents: [
    DateRenderComponent,
  ],
})
export class UsersModule { }
