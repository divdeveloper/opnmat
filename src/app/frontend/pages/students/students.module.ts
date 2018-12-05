import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StudentsComponent } from './students.component';
import { StudentDatailComponent } from './student-datail/student-datail.component';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentsRoutingModule } from './students.routing.module';
import { PagesModule } from '../pages.module';
import { AcademyComponentsModule } from '../components/academy/academy.module';
import { RoundProgressModule } from '../../../../components/angular-round-progressbar/';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    StudentsRoutingModule,
    PagesModule,
    AcademyComponentsModule,
    RoundProgressModule,
  ],
  declarations: [
    StudentsComponent,
    StudentDatailComponent,
    StudentListComponent,
  ],
})
export class StudentsModule { }
