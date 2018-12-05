import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { ActivityViewPageComponent } from './activity-view.component';

const routes: Routes = [{
  path: '',
  component: ActivityViewPageComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityViewPageRouting {
}
