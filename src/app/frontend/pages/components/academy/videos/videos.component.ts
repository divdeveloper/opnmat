import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { AcademiesService } from '../../../../../services/academies.service';


@Component({
  selector: 'opn-academy-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosAcademyComponent implements OnInit {
  private videos: Array<any> = [];
  private limit: any = 10;
  private page: any = 1;
  private maxPage: Number;
  private total: Number;
  private load: Boolean = true;

  private academy_id: any;
  private serverUrl: String;

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
    this.academyService.getAcademyVideos(this.academy_id, this.limit, this.page).subscribe(videos => {
      this.total = videos.total;
      this.maxPage = Math.ceil(videos.total / this.limit);
      this.videos = this.videos.concat(videos.data);
      this.load = true;
    });
    this.serverUrl = this.academyService.getServerUrl();
  }
  onScrollDown () {
    if (this.load && this.page <= this.maxPage) {
      this.page += 1;
      this.load = false;
      this.academyService.getAcademyVideos(this.academy_id, this.limit, this.page).subscribe(videos => {
        this.videos = this.videos.concat(videos.data);
        this.load = true;
      });
    }
  }
}
