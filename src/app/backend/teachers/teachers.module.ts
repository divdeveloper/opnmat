import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';
import { Select2Module } from 'ng2-select2';

import { ThemeModule } from '../../@theme/theme.module';
import { TeachersRoutingModule, routedComponents } from './teachers-routing.module';
import { TeachersService } from '../../services/teachers.service';



@NgModule({
  imports: [
    ThemeModule,
    TeachersRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
    Select2Module,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    TeachersService,
  ],
  entryComponents: [
  ],
})
export class TeacherModule { }
