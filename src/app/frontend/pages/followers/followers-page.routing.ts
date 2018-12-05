import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { FollowersPageComponent } from './followers-page.component';

const routes: Routes = [{
  path: '',
  component: FollowersPageComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FollowersPageRouting {
}
