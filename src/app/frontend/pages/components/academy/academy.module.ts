import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterLinkActive } from '@angular/router';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';
import { CalendarModule } from 'angular-calendar';
import { NgxMaskModule } from 'ngx-mask';
import { AngularMultiSelectModule } from '../../../../../components/angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { UIDatepickerModule } from '../../../../../components/ui/ui-datepicker/';
import { UiTimeComponent } from '../../../../../components/ui/ui-time/ui-time.component';
import { NgxImageGalleryModule } from 'ngx-image-gallery';

import { PhotosAcademyComponent } from '../academy/photos/photos.component';
import { VideosAcademyComponent } from '../academy/videos/videos.component';
import { FollowersAcademyComponent } from '../academy/followers/followers.component';
import { ActivitiAcademyComponent } from '../academy/activiti/activiti.component';
import { CreateActivitiComponent } from '../academy/create-activiti/create-activiti.component';
import { UpdateActivitiComponent } from '../academy/update-activiti/update-activiti.component';
import { CreateClassComponent } from '../academy/create-class/create-class.component';
import { UpdateClassComponent } from '../academy/update-class/update-class.component';
import { UpgardeAcademyComponent } from '../academy/upgrade/upgrade.component';
import { UiSelectComponent } from '../../../../../components/ui/ui-select/ui-select.component';
import { UiCheckboxComponent } from '../../../../../components/ui/ui-checkbox/ui-checkbox.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { ManagerPanelComponent } from './manager-panel/manager-panel.component';
import { EventsAcademyComponent } from './events-widget/events-widget.component';
import { ContactsAcademyComponent } from './contacts/contacts.component';
import { PaymentStripeComponent } from '../../../../../components/payment-stripe/payment-stripe.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { ModalAcademyComponent } from './modal/modal.component';
import { ModalAcademyService } from './modal/modal.service';

@NgModule({
  declarations: [
    PhotosAcademyComponent,
    VideosAcademyComponent,
    FollowersAcademyComponent,
    ActivitiAcademyComponent,
    CreateActivitiComponent,
    CreateClassComponent,
    UpdateClassComponent,
    UpdateActivitiComponent,
    UiSelectComponent,
    UiCheckboxComponent,
    UiTimeComponent,
    UpgardeAcademyComponent,
    SubscriptionsComponent,
    ManagerPanelComponent,
    PaymentStripeComponent,
    EventsAcademyComponent,
    ContactsAcademyComponent,
    ModalConfirmComponent,
    ModalAcademyComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    InfiniteScrollModule,
    LazyLoadImagesModule,
    CalendarModule.forRoot(),
    NgxMaskModule.forRoot(),
    UIDatepickerModule,
    AngularMultiSelectModule,
    CurrencyMaskModule,
    NgxImageGalleryModule,
  ],
  exports: [
    PhotosAcademyComponent,
    VideosAcademyComponent,
    FollowersAcademyComponent,
    ActivitiAcademyComponent,
    CreateActivitiComponent,
    CreateClassComponent,
    UpdateClassComponent,
    UpdateActivitiComponent,
    UiSelectComponent,
    UiCheckboxComponent,
    UiTimeComponent,
    UpgardeAcademyComponent,
    SubscriptionsComponent,
    ManagerPanelComponent,
    PaymentStripeComponent,
    EventsAcademyComponent,
    ContactsAcademyComponent,
    ModalConfirmComponent,
    ModalAcademyComponent,
  ],
  providers: [
    ModalAcademyService,
  ],
})
export class AcademyComponentsModule { }
