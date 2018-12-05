import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import { CmsPagesService } from '../../../services/cms.pages.service';

@Component({
  selector: 'opn-new-page',
  templateUrl: '../form.cms.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class NewPagesComponent {
  contentPage: any;
  titlePage: String;
  buttonText: String = 'Add Page';
  constructor(private service: CmsPagesService, private router: Router, private activeRoute: ActivatedRoute) {
    this.contentPage = '';
    this.titlePage = '';
  }
  onClick(el) {
    this.service.createPage({
      title: this.titlePage,
      content: el.editor.getContent(),
    }).subscribe(res => {
      if (res.status) {
        this.router.navigate(['/admin/cms/list']);
      }
    });
  }
}
