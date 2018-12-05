import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { RoadmapPageComponent } from './roadmap-page.component';

const routes: Routes = [{
  path: '',
  component: RoadmapPageComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoadmapPageRouting {
}
