import { Component, Input, OnInit } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';

@Component({
  template: `
    {{renderValue}}
  `,
})
export class TypeRenderComponent implements ViewCell, OnInit {

  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  ngOnInit() {
    switch (this.value) {
      case 'special_event': this.renderValue = 'Special event'; break;
      case 'class': this.renderValue = 'Class'; break;
      case 'mat_event': this.renderValue = 'Open mat event'; break;
    }
  }

}
