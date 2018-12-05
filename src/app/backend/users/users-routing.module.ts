import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users.component';
import { ListUsersComponent } from './list/list.component';
import { DetailUserComponent } from './detail/detail.component';





const routes: Routes = [{
  path: '',
  component: UsersComponent,
  children: [
    {
      path: 'list',
      component: ListUsersComponent,
    }, {
      path: 'detail/:id',
      component: DetailUserComponent,
    },
],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademiesRoutingModule { }

export const routedComponents = [
  UsersComponent,
  ListUsersComponent,
  DetailUserComponent,
];
