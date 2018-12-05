import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { FeedPageComponent } from './feed-page.component';

const routes: Routes = [{
  path: '',
  component: FeedPageComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedPageRouting {
}
