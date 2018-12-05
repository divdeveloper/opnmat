import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { CreateSubscriptionsComponent } from './create-subscriptions.component';

const routes: Routes = [{
    path: '',
    component: CreateSubscriptionsComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateSubscriptionsPageRouting {
}
