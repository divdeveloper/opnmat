import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { AcademyPageComponent } from './academy-page.component';

const routes: Routes = [{
  path: '',
  component: AcademyPageComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademyPageRouting {
}
