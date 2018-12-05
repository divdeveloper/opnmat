import { Component, Input, EventEmitter, OnInit, OnChanges, SimpleChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { ConfigService } from '../../../../services/service.config';


@Component({
  selector: 'opn-view-logo-academy',
  templateUrl: './view-logo-academy.component.html',
  styleUrls: [ './view-logo-academy.component.scss' ],
})
export class ViewLogoAcademyComponent implements OnInit, OnChanges {
  @Input() src: String;
  @Input() defaultSrc: String;
  @Input() widthImg: String;
  @Input() md: String = '';

  private bg: String = '';

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    const src: SimpleChange = changes.src;
    if (!src.currentValue) {
      this.bg = `url(${this.defaultSrc}) center no-repeat`;
    }else {
      if (src.currentValue.indexOf('data:') >= 0 ) {
        this.bg = `url(${src.currentValue}) center no-repeat, white`;
      }else {
        this.bg = `url(${ConfigService.URL_SERVER + src.currentValue}?${new Date().getTime()}) center no-repeat, white`;
      }
    }
  }
  ngOnInit() {
    if (!this.defaultSrc) {
      this.defaultSrc = '/assets/images/academy-logo.jpg';
    }
    if (!this.widthImg) {
      this.widthImg = '128px';
    }
    if (!this.src) {
      this.bg = `url(${this.defaultSrc}) center no-repeat`;
    }else {
      if (this.src.indexOf('data:') >= 0 ) {
        this.bg = `url(${this.src}) center no-repeat, white`;
      }else {
        this.bg = `url(${ConfigService.URL_SERVER + this.src}?${new Date().getTime()}) center no-repeat, white`;
      }
    }
  }
}
