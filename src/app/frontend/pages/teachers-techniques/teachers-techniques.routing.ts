import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { TeachersTechniquesPageComponent } from './teachers-techniques.component';

const routes: Routes = [{
  path: '',
  component: TeachersTechniquesPageComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeachersTechniquesPageRouting {
}
