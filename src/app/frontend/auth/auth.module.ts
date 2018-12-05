import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AuthRoutingModule } from './auth-routing.module';
import { Select2Module } from 'ng2-select2';
import { ReactiveFormsModule } from '@angular/forms';
import { NgDatepickerModule } from '../../../components/ng-datepicker';
import { BeltsModule } from '../../../components/belts';
import { SelectAcademiesModule } from '../../../components/select-acadimies';
import {TooltipModule} from 'ng2-tooltip';
import { NgxMaskModule } from 'ngx-mask';

import { AuthService } from '../../services/auth/auth.service';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ActiveComponent } from './login/active.component';
import { RegistrationComponent } from './registration/registration.component';
import { SuccessComponent } from './success/success.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';
import { AcademyComponent } from './academy/academy.component';
import { HeaderComponent } from './inc/header/header.component';
import { Carousel } from './carousel/carousel.component';
import {Slide} from './carousel/slide.component';
import {UiSelectTypeComponent} from '../../../components/ui/ui-select-type/ui-select.component';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    WelcomeComponent,
    ActiveComponent,
    RegistrationComponent,
    SuccessComponent,
    ForgotComponent,
    ResetComponent,
    AcademyComponent,
    HeaderComponent,
    Carousel,
    Slide,
    UiSelectTypeComponent,
  ],
  imports: [
    AuthRoutingModule,
    ReactiveFormsModule,
    Select2Module,
    NgDatepickerModule,
    TooltipModule,
    HttpModule,
    BeltsModule,
    SelectAcademiesModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [
    AuthService,
  ],
})
export class AuthModule { }
