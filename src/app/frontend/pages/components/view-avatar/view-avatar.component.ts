import { Component, Input, EventEmitter, OnInit, OnChanges, SimpleChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { ConfigService } from '../../../../services/service.config';


@Component({
  selector: 'opn-view-avatar',
  templateUrl: './view-avatar.component.html',
  styleUrls: [ './view-avatar.component.scss' ],
})
export class ViewAvatarComponent implements OnInit, OnChanges {
  @Input() src: String;
  @Input() defaultSrc: String;
  @Input() widthImg: String;
  @Input() belt: String;
  @Input() md: String = '';

  private bg: String = '';

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    const src: SimpleChange = changes.src;
    const belt: SimpleChange = changes.belt;
    let beltBg = '';
    if (belt && belt.currentValue) {
      beltBg = `url(${ConfigService.URL_SERVER + belt.currentValue}) center no-repeat, `;
    }
    if (!src.currentValue) {
      this.bg = beltBg + `url(${this.defaultSrc}) center no-repeat`;
    }else {
      if (src.currentValue.indexOf('data:') >= 0 ) {
        this.bg = beltBg +  `url(${src.currentValue}) center no-repeat, white`;
      }else {
        this.bg = beltBg +  `url(${ConfigService.URL_SERVER + src.currentValue}) center no-repeat, white`;
      }
    }

    if (belt && belt.currentValue) {
      beltBg = `url(${ConfigService.URL_SERVER + belt.currentValue}) center no-repeat, `;
    }
    if (!src.currentValue) {
      this.bg = beltBg + `url(${this.defaultSrc}) center no-repeat`;
    }else {
      if (src.currentValue.indexOf('data:') >= 0 ) {
        this.bg = beltBg +  `url(${src.currentValue}) center no-repeat, white`;
      }else {
        this.bg = beltBg +  `url(${ConfigService.URL_SERVER + src.currentValue}?${new Date().getTime()}) center no-repeat, white`;
      }
    }
  }
  ngOnInit() {
    if (!this.defaultSrc) {
      this.defaultSrc = '/assets/images/user-dafault.png';
    }
    if (!this.widthImg) {
      this.widthImg = '128px';
    }
    let beltBg = '';
    if (this.belt) {
      beltBg = `url(${ConfigService.URL_SERVER + this.belt}) center no-repeat, `;
    }
    if (!this.src) {
      this.bg = beltBg + `url(${this.defaultSrc}) center no-repeat`;
    }else {
      if (this.src.indexOf('data:') >= 0 ) {
        this.bg = beltBg +  `url(${this.src}) center no-repeat, white`;
      }else {
        this.bg = beltBg +  `url(${ConfigService.URL_SERVER + this.src}?${new Date().getTime()}) center no-repeat, white`;
      }
    }
  }
}
