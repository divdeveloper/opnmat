import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';

import { ThemeModule } from '../../@theme/theme.module';
import { CmsRoutingModule, routedComponents } from './cms-routing.module';
import { CmsPagesService } from '../../services/cms.pages.service';


@NgModule({
  imports: [
    ThemeModule,
    CmsRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    CmsPagesService,
  ],
  entryComponents: [
  ],
})
export class CmsModule { }
