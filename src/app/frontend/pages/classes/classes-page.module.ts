import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassesPageComponent } from './classes-page.component';
import { ClassesPageRouting } from './classes-page.routing';
import { PagesModule } from '../pages.module';
import { AcademyComponentsModule } from '../components/academy/academy.module';
import {UiPerPageModule} from '../../../../components/ui/ui-per-page/ui-per-page.module';
import {ClassesListComponent} from './classes-list/classes-list.component';
import {ClassesStudentsListComponent} from './classes-students-list/classes-students-list.component';
import {UiBackBtnModule} from '../../../../components/ui/ui-back-btn/ui-back-btn.module';


@NgModule({
  imports: [
    CommonModule,
    ClassesPageRouting,
    PagesModule,
    AcademyComponentsModule,
    UiPerPageModule,
    UiBackBtnModule
  ],
  declarations: [
    ClassesPageComponent,
    ClassesListComponent,
    ClassesStudentsListComponent,
  ]
})
export class ClassesPageModule { }
