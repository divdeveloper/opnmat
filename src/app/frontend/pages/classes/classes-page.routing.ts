import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { ClassesPageComponent } from './classes-page.component';
import {ClassesListComponent} from './classes-list/classes-list.component';
import {ClassesStudentsListComponent} from './classes-students-list/classes-students-list.component';

const routes: Routes = [{
  path: '',
  component: ClassesPageComponent,
  children: [
    {
      path: '',
      component: ClassesListComponent,
    },
    {
      path: ':class',
      component: ClassesStudentsListComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassesPageRouting {
}
