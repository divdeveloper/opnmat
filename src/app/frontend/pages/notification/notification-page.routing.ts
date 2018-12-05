import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { NoficationPageComponent } from './notification-page.component';

const routes: Routes = [{
  path: '',
  component: NoficationPageComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationPageRouting {
}
