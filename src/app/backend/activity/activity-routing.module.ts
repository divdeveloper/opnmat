import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityComponent } from './activity.component';
import { ListActivityComponent } from './list/list.component';
import { NewActivityComponent } from './new/new.component';
import { EditActivityComponent } from './edit/edit.component';


const routes: Routes = [{
  path: '',
  component: ActivityComponent,
  children: [
    {
      path: 'list',
      component: ListActivityComponent,
    },
    {
      path: 'new',
      component: NewActivityComponent,
    },
    {
      path: 'edit/:id',
      component: EditActivityComponent,
    },
],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityRoutingModule { }

export const routedComponents = [
  ActivityComponent,
  ListActivityComponent,
  NewActivityComponent,
  EditActivityComponent,
];
