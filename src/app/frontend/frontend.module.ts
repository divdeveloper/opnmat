import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FrontendRoutingModule } from './frontend-routing.module';

import { FrontendComponent } from './frontend.component';
import { NgxStripeModule } from 'ngx-stripe';
import { SocketService } from '../services/socket.service';



@NgModule({
  declarations: [
    FrontendComponent,
  ],
  imports: [
    FrontendRoutingModule,
    NgxStripeModule.forRoot('pk_test_qTO5U0NlOMwzO99Db9XSBZPJ'),
  ],
  providers: [
    SocketService,
  ],
})
export class FrontendModule { }
