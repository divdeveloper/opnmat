import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { MessagePageComponent } from './message-page.component';

const routes: Routes = [{
  path: '',
  component: MessagePageComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessagePageRouting {
}
