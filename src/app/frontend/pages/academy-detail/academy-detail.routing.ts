import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { AcademyDetailPageComponent } from './academy-detail.component';

const routes: Routes = [{
  path: '',
  component: AcademyDetailPageComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademyDetailPageRouting {
}
