import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import { CmsPagesService } from '../../../services/cms.pages.service';

@Component({
  selector: 'opn-list-pages',
  templateUrl: '../form.cms.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class EditPagesComponent implements OnInit, OnDestroy {
  contentPage: any;
  titlePage: String;
  pageId: any;
  buttonText: String = 'Update Page';

  constructor(private service: CmsPagesService, private router: Router, private activeRoute: ActivatedRoute) {
    this.contentPage = localStorage.getItem('pageContent');
    this.titlePage = '';

    this.activeRoute.params.subscribe(params => {
      this.pageId = params['id'];
    });
  }

  ngOnInit() {
    this.service.getPageById(this.pageId).subscribe(res => {
      this.contentPage = res.content;
      this.titlePage = res.title;
    });
  }

  onClick(el) {
    this.service.updatePage(this.pageId, {
      title: this.titlePage,
      content: el.editor.getContent(),
    }).subscribe(res => {
      if (res.status) {
        this.router.navigate(['/admin/cms/list']);
      }
    });
  }
  ngOnDestroy() {
    localStorage.removeItem('pageContent');
  }
}
