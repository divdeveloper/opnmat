import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ActiveComponent } from './login/active.component';
import { RegistrationComponent } from './registration/registration.component';
import { SuccessComponent } from './success/success.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';
import { AcademyComponent } from './academy/academy.component';

import { AuthGuardService as AuthGuard } from '../../services/auth/auth-guard.service';
import { RoleGuardService as RoleGuard } from '../../services/auth/role-guard.service';

const routes: Routes = [{
  path: '',
  component: AuthComponent,
  children: [{
    path: 'login',
    component: LoginComponent,
    // canActivate: [AuthGuard],
  }, {
    path: 'welcome',
    component: WelcomeComponent,
    // canActivate: [AuthGuard],
  }, {
    path: 'login/:kode',
    component: ActiveComponent,
    // canActivate: [AuthGuard],
  }, {
    path: 'registration',
    component: RegistrationComponent,
    // canActivate: [AuthGuard],
  }, {
    path: 'success',
    component: SuccessComponent,
    // canActivate: [AuthGuard],
  }, {
    path: 'forgot',
    component: ForgotComponent,
    // canActivate: [AuthGuard],
  }, {
    path: 'reset/:kode',
    component: ResetComponent,
    // canActivate: [AuthGuard],
  }, {
    path: 'academy',
    component: AcademyComponent,
    // canActivate: [AuthGuard],
  }, {
    path: '*',
    redirectTo: '',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
