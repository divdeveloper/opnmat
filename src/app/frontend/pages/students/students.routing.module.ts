import {
  NgModule,
} from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import {
  StudentsComponent,
} from './students.component';
import {
  StudentDatailComponent,
} from './student-datail/student-datail.component';
import {
  StudentListComponent,
} from './student-list/student-list.component';

const StudentsRoutes: Routes = [
  {
    path: '',
    component: StudentsComponent,
    children: [
      {
        path: '',
        component: StudentListComponent,
      },
      {
        path: ':student/detail',
        component: StudentDatailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(StudentsRoutes),
  ],
  exports: [
    RouterModule,
  ],
})

export class StudentsRoutingModule {}
