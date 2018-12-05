import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TechniquesComponent } from './techniques.component';
import { ListTechniqueComponent } from './list/list.component';
import { NewTechniqueComponent } from './new/new.component';
import { EditTechnigueComponent } from './edit/edit.component';


const routes: Routes = [{
  path: '',
  component: TechniquesComponent,
  children: [
    {
      path: 'list',
      component: ListTechniqueComponent,
    },
    {
      path: 'new',
      component: NewTechniqueComponent,
    },
    {
      path: 'edit/:id',
      component: EditTechnigueComponent,
    },
],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TechniquesRoutingModule { }

export const routedComponents = [
  TechniquesComponent,
  ListTechniqueComponent,
  NewTechniqueComponent,
  EditTechnigueComponent,
];
