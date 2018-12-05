import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgxImageGalleryComponent, GALLERY_IMAGE, GALLERY_CONF } from 'ngx-image-gallery';

import { AcademiesService } from '../../../../../services/academies.service';


@Component({
  selector: 'opn-academy-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosAcademyComponent implements OnInit {
  private photos: Array<any> = [];
  private limit: any = 10;
  private page: any = 1;
  private maxPage: Number;
  private total: Number;
  private load: Boolean = true;

  private academy_id: any;
  private serverUrl: String;

  @ViewChild(NgxImageGalleryComponent) ngxImageGallery: NgxImageGalleryComponent;

  conf: GALLERY_CONF = {
    imageOffset: '0px',
    showDeleteControl: false,
    showImageTitle: false,
  };
  images: GALLERY_IMAGE[] = [];

  constructor(
    private academyService: AcademiesService,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.activeRoute.params.subscribe(params => {
      this.academy_id = params['id'];
    });
  }
  ngOnInit() {
    this.load = false;
    this.academyService.getAcademyPhotos(this.academy_id, this.limit, this.page).subscribe(photos => {
      this.total = photos.total;
      this.maxPage = Math.ceil(photos.total / this.limit);
      this.photos = this.photos.concat(photos.data);
      this.load = true;

      photos.data.forEach(image => {
        this.images.push({
          url: `${this.academyService.getServerUrl() + image.url}`,
          thumbnailUrl: `${this.academyService.getServerUrl() + image.url}?w=60`,
        });
      });
    });
    this.serverUrl = this.academyService.getServerUrl();
  }
  openGallery(index: number = 0) {
    console.log('index ', index);
    this.ngxImageGallery.open(index);
  }
  onScrollDown () {
    if (this.page <= this.maxPage) {
      this.load = false;
      this.page += 1;
      this.academyService.getAcademyPhotos(this.academy_id, this.limit, this.page).subscribe(photos => {
        this.photos = this.photos.concat(photos.data);
        this.load = true;
        photos.data.forEach(image => {
          this.images.push({
            url: `${this.serverUrl + image.url}`,
          });
        });
      });
    }
  }
}
