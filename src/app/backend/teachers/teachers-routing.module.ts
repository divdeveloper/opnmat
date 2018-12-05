import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeacherComponent } from './teachers.component';
import { ListTeachersComponent } from './list/list.component';
import { NewTeacherComponent } from './new/new.component';
import { EditTeacherComponent } from './edit/edit.component';


const routes: Routes = [{
  path: '',
  component: TeacherComponent,
  children: [
    {
      path: 'list',
      component: ListTeachersComponent,
    },
    {
      path: 'new',
      component: NewTeacherComponent,
    },
    {
      path: 'edit/:id',
      component: EditTeacherComponent,
    },
],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeachersRoutingModule { }

export const routedComponents = [
  TeacherComponent,
  ListTeachersComponent,
  NewTeacherComponent,
  EditTeacherComponent,
];
