import { NgModule } from '@angular/core';
import {TooltipModule} from 'ng2-tooltip';


import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { BackendRoutingModule } from './pages-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../@theme/theme.module';
import { CoreModule } from '../@core/core.module';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    BackendRoutingModule,
    ThemeModule.forRoot(),
    DashboardModule,
    CoreModule.forRoot(),
    NgbModule.forRoot(),
    TooltipModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
