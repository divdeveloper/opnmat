import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { AcademyMessagesComponent} from './academy-messages.component';

const routes: Routes = [{
  path: '',
  component: AcademyMessagesComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademyMessagesRouting {
}
