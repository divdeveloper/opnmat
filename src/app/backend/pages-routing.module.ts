import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [/*{
  path: 'login',
  component: NbLoginComponent,
},{
  path: 'register',
  component: NbRegisterComponent,
},{
  path: 'logout',
  component: NbLogoutComponent,
},*/{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'dashboard',
    component: DashboardComponent,
  }, {
    path: 'ui-features',
    loadChildren: './ui-features/ui-features.module#UiFeaturesModule',
  }, {
    path: 'academies',
    loadChildren: './academies/academies.module#AcademiesModule',
  }, {
    path: 'users',
    loadChildren: './users/users.module#UsersModule',
  }, {
    path: 'cms',
    loadChildren: './cms/cms.module#CmsModule',
  }, {
    path: 'teachers',
    loadChildren: './teachers/teachers.module#TeacherModule',
  }, {
    path: 'techniques',
    loadChildren: './techniques/techniques.module#TechniqueModule',
  }, {
    path: 'activities',
    loadChildren: './activity/activity.module#ActivityModule',
  }, {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackendRoutingModule {
}
