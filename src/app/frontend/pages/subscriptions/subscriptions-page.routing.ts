import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { SubscriptionsPageComponent } from './subscriptions-page.component';
import { SubscriptionComponent } from './subscription/subscription.component';

const routes: Routes = [{
    path: '',
    component: SubscriptionsPageComponent,
    children: [
        {
            path: '',
            component: SubscriptionComponent,
        },
    ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionsPageRouting {
}
