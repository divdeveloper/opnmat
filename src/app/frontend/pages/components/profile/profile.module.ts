import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';
import { NgxImageGalleryModule } from 'ngx-image-gallery';

import { PhotosProfileComponent } from '../profile/photos/photos.component';
import { VideosProfileComponent } from '../profile/videos/videos.component';
import { FollowersProfileComponent } from '../profile/followers/followers.component';
import { FollowingProfileComponent } from '../profile/following/following.component';



@NgModule({
  declarations: [
    PhotosProfileComponent,
    VideosProfileComponent,
    FollowersProfileComponent,
    FollowingProfileComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    InfiniteScrollModule,
    LazyLoadImagesModule,
    NgxImageGalleryModule,
  ],
  exports: [
    PhotosProfileComponent,
    VideosProfileComponent,
    FollowersProfileComponent,
    FollowingProfileComponent,
  ],
})
export class ProfileComponentsModule { }
