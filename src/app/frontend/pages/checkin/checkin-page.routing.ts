import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { CheckinPageComponent } from './checkin-page.component';

const routes: Routes = [{
  path: '',
  component: CheckinPageComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckinPageRouting {
}
