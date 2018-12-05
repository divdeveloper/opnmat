import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgxImageGalleryComponent, GALLERY_IMAGE, GALLERY_CONF } from 'ngx-image-gallery';

import { ProfileService } from '../../../../../services/profile.service';


@Component({
  selector: 'opn-profile-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosProfileComponent implements OnInit {
  private photos: Array<any> = [];
  private limit: any = 10;
  private page: any = 1;
  private maxPage: Number;
  private total: Number;
  private load: Boolean = true;

  private user: any;
  private serverUrl: String;

  @ViewChild(NgxImageGalleryComponent) ngxImageGallery: NgxImageGalleryComponent;

  conf: GALLERY_CONF = {
    imageOffset: '0px',
    showDeleteControl: false,
    showImageTitle: false,
  };
  images: GALLERY_IMAGE[] = [];

  constructor(
    private profileService: ProfileService,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.activeRoute.params.subscribe(params => {
      this.user = params['id'];
    });
  }
  ngOnInit() {
    this.load = false;
    this.profileService.getUserPhotos(this.user, this.limit, this.page).subscribe(photos => {
      this.total = photos.total;
      this.maxPage = Math.ceil(photos.total / this.limit);
      this.photos = this.photos.concat(photos.data);
      this.load = true;
      photos.data.forEach(image => {
        this.images.push({
          url: `${this.profileService.getServerUrl() + image.url}`,
          thumbnailUrl: `${this.profileService.getServerUrl() + image.url}?w=60`,
        });
      });
    });
    this.serverUrl = this.profileService.getServerUrl();
  }
  openGallery(index: number = 0) {
    console.log('index ', index);
    this.ngxImageGallery.open(index);
  }
  onScrollDown () {
    if (this.page <= this.maxPage) {
      this.load = false;
      this.page += 1;
      this.profileService.getUserPhotos(this.user, this.limit, this.page).subscribe(photos => {
        this.photos = this.photos.concat(photos.data);
        this.load = true;
        photos.data.forEach(image => {
          this.images.push({
            url: `${this.profileService.getServerUrl() + image.url}`,
            thumbnailUrl: `${this.profileService.getServerUrl() + image.url}?w=60`,
          });
        });
      });
    }
  }
}
