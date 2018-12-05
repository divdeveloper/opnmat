import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
// import { ShareButtonsModule } from 'ngx-sharebuttons';
import {ShareButtonModule} from '@ngx-share/button';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {TooltipModule} from 'ng2-tooltip';
import {Ng4GeoautocompleteModule} from 'ng4-geoautocomplete';
import {NgPipesModule} from 'ngx-pipes';

import {Select2Module} from 'ng2-select2';
import {NgDatepickerModule} from '../../../components/ng-datepicker';
import {BeltsModule} from '../../../components/belts';
import {SelectAcademiesModule} from '../../../components/select-acadimies';
import {MomentModule} from 'angular2-moment';
import {ImageCropperComponent} from 'ng2-img-cropper';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import {NgxMaskModule} from 'ngx-mask';

import {PARTS_COMPONENTS} from './parts';
import {NewPostFormComponent} from './components/posts/new-post/new-post.component';
import {ViewPostComponent} from './components/posts/view-post/view-post.component';
import {PopupPostComponent} from './components/posts/popup-post/popup-post.component';
import {DropdownVisibilityComponent} from './components/posts/dropdown/dropdown-visibility.component';
import {AccountVisibilityComponent} from './components/posts/dropdown.account/account-visibility.component';
import {ControllsPostComponent} from './components/posts/controll.post/controll.component';
import {NewAcademyComponent} from './components/academy/new-academy/new-academy.component';
import {NotificationInformerComponent} from './components/notification-informer/notification-informer.component';

import {niceDateFormatPipe} from './pipes/DateFormatPipe.pipe';
import {AvatarPipe} from './pipes/avatarPipe.pipe';
import {ViewAvatarComponent} from './components/view-avatar/view-avatar.component';
import {ViewLogoAcademyComponent} from './components/view-logo-academy/view-logo-academy.component';
import {ViewWidgetAcademyComponent} from './components/academy/academy-widget/academy-view.component';
import {CropCoverPhotoComponent} from './components/crop-cover-photo/crop-cover-photo.component';
import {CropLogoPhotoComponent} from './components/crop-logo-photo/crop-logo-photo.component';
import {Broadcaster} from '../../services/broadcaster';
// import { SocketService } from '../../services/socket.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from './components/modal/modal.component';
import {ModalService} from './components/modal/modal.service';
import {OpnActiveRouteDirective} from '../../../directives/link-active.directive';
import {UiSelectTypeSettingComponent} from '../../../components/ui/ui-select-type.1/ui-select.component';

const config: SocketIoConfig = {
    url: 'http://34.214.211.44:3000',
    options: {},
};

@NgModule({
    declarations: [
        ...PARTS_COMPONENTS,
        NewPostFormComponent,
        ViewPostComponent,
        PopupPostComponent,
        DropdownVisibilityComponent,
        AccountVisibilityComponent,
        niceDateFormatPipe,
        AvatarPipe,
        ViewAvatarComponent,
        ViewLogoAcademyComponent,
        ViewWidgetAcademyComponent,
        ControllsPostComponent,
        NewAcademyComponent,
        CropCoverPhotoComponent,
        CropLogoPhotoComponent,
        ImageCropperComponent,
        NotificationInformerComponent,
        ModalComponent,
        OpnActiveRouteDirective,
        UiSelectTypeSettingComponent,
    ],
    entryComponents: [
        ViewAvatarComponent,
        ViewLogoAcademyComponent,
        ViewWidgetAcademyComponent,
        CropCoverPhotoComponent,
        ModalComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        InfiniteScrollModule,
        HttpClientModule,
        HttpModule,
        TooltipModule,
        Select2Module,
        ReactiveFormsModule,
        NgDatepickerModule,
        BeltsModule,
        SelectAcademiesModule,
        Ng4GeoautocompleteModule.forRoot(),
        ShareButtonModule.forRoot(),
        NgbModule.forRoot(),
        SocketIoModule.forRoot(config),
        NgxMaskModule.forRoot(),
        NgPipesModule,
        MomentModule,
    ],
    exports: [
        ...PARTS_COMPONENTS,
        NewPostFormComponent,
        ViewPostComponent,
        CropLogoPhotoComponent,
        PopupPostComponent,
        DropdownVisibilityComponent,
        AccountVisibilityComponent,
        niceDateFormatPipe,
        AvatarPipe,
        ViewAvatarComponent,
        ViewLogoAcademyComponent,
        ViewWidgetAcademyComponent,
        ControllsPostComponent,
        NewAcademyComponent,
        CropCoverPhotoComponent,
        NotificationInformerComponent,
        ModalComponent,
        OpnActiveRouteDirective,
        UiSelectTypeSettingComponent,
    ],
    providers: [
        CookieService,
        Broadcaster,
        ModalService,
        // SocketService,
    ],
})
export class PagesModule {
}
