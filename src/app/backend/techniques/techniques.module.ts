import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';
import { Select2Module } from 'ng2-select2';

import { ThemeModule } from '../../@theme/theme.module';
import { TechniquesRoutingModule, routedComponents } from './techniques-routing.module';
import { TechniquesService } from '../../services/techniques.service';



@NgModule({
  imports: [
    ThemeModule,
    TechniquesRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
    Select2Module,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    TechniquesService,
  ],
  entryComponents: [
  ],
})
export class TechniqueModule { }
