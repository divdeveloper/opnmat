import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';
import {ActivitiesPageComponent} from './activities-page.component';
import {ActivityListComponent} from './activities-list/activity-list.component';
import {ActivityStudentListComponent} from './activity-student-list/activity-student-list.component';


const routes: Routes = [{
  path: '',
  component: ActivitiesPageComponent,
  children: [
    {
      path: '',
      component: ActivityListComponent,
    },
    {
      path: ':activity',
      component: ActivityStudentListComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitiesPageRouting {
}
