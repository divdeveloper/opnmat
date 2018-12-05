import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { FollowingsPageComponent } from './followings-page.component';

const routes: Routes = [{
  path: '',
  component: FollowingsPageComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FollowingsPageRouting {
}
