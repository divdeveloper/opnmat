import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../@core/utils/analytics.service';

import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
  styles: [`
    body{
      width: 100% !important;
      max-width: 100% !important;
      min-width: 100% !important;
    }`,
  ],
})
export class PagesComponent implements OnInit {
  constructor(private analytics: AnalyticsService) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }
  menu = MENU_ITEMS;
}
