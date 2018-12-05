import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';

@Component({
    template: `
      <a>{{renderValue}}</a>
    `,
})
export class NameRenderComponent implements OnInit {

      renderValue: string;

      @Input() value: string;
      @Input() rowData: any;

      ngOnInit() {
        this.renderValue = this.value.toString();
      }
    }