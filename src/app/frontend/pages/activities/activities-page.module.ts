import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivitiesPageRouting} from './activities-page.routing';
import {AcademyComponentsModule} from '../components/academy/academy.module';
import {ActivitiesPageComponent} from './activities-page.component';
import {PagesModule} from '../pages.module';
import {UiPerPageModule} from '../../../../components/ui/ui-per-page/ui-per-page.module';
import {ActivityStudentListComponent} from './activity-student-list/activity-student-list.component';
import {ActivityListComponent} from './activities-list/activity-list.component';
import {UiBackBtnModule} from '../../../../components/ui/ui-back-btn/ui-back-btn.module';



@NgModule({
  imports: [
    CommonModule,
    ActivitiesPageRouting,
    PagesModule,
    UiPerPageModule,
    AcademyComponentsModule,
    UiBackBtnModule,
  ],
  declarations: [
    ActivitiesPageComponent,
    ActivityListComponent,
    ActivityStudentListComponent,
  ]
})
export class ActivitiesPageModule{ }
