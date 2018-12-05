import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';
import {TooltipModule} from 'ng2-tooltip';

import { ThemeModule } from '../../@theme/theme.module';
import { LoginRoutingModule, routedComponents } from './login-routing.module';
import { AuthGuardService } from '../../services/auth/auth-guard.service';
import { AuthService} from '../../services/auth/auth.service';


@NgModule({
  imports: [
    ThemeModule,
    LoginRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
    TooltipModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    AuthGuardService,
    AuthService,
  ],
  entryComponents: [
  ],
})
export class LoginModule { }
