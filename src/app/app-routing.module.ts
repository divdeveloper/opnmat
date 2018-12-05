import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoleGuardService as RoleGuard } from './services/auth/role-guard.service';
import { AuthGuardService as AuthGuard } from './services/auth/auth-guard.service';

const routes: Routes = [
  { path: '', loadChildren: 'app/frontend/frontend.module#FrontendModule' },
  { path: 'admin', canActivate: [RoleGuard],
    data: {
      expectedRole: 'admin',
    },
    loadChildren: 'app/backend/pages.module#PagesModule',
  },
  { path: 'admin-auth', loadChildren: 'app/backend/login/login.module#LoginModule' },
  { path: 'admin/*', redirectTo: 'admin' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
