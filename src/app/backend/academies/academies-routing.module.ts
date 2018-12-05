import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademiesComponent } from './academies.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './list/edit/edit.component';
import { NewComponent } from './list/new/new.component';
import { DetailComponent } from './list/detail/detail.component';
import { ConfirmationsComponent } from './confirmations/confirmations.component';




const routes: Routes = [{
  path: '',
  component: AcademiesComponent,
  children: [
    {
      path: 'list',
      component: ListComponent,
    },
    {
      path: 'edit/:id',
      component: EditComponent,
    },
    {
      path: 'new',
      component: NewComponent,
    },
    {
      path: 'detail/:id',
      component: DetailComponent,
    },
    {
      path: 'confirmations',
      component: ConfirmationsComponent,
    },
],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademiesRoutingModule { }

export const routedComponents = [
  AcademiesComponent,
  ListComponent,
  EditComponent,
  NewComponent,
  ConfirmationsComponent,
  DetailComponent,
];
