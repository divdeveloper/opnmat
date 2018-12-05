import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CmsComponent } from './cms.component';
import { ListPagesComponent } from './list/list.component';
import { NewPagesComponent } from './new/new.component';
import { EditPagesComponent } from './edit/edit.component';


const routes: Routes = [{
  path: '',
  component: CmsComponent,
  children: [
    {
      path: 'list',
      component: ListPagesComponent,
    },
    {
      path: 'new',
      component: NewPagesComponent,
    },
    {
      path: 'edit/:id',
      component: EditPagesComponent,
    },
],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmsRoutingModule { }

export const routedComponents = [
  CmsComponent,
  ListPagesComponent,
  NewPagesComponent,
  EditPagesComponent,
];
