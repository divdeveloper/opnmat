import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { UiDatepickerComponent } from './ng-datepicker.component';

@NgModule({
  declarations: [ UiDatepickerComponent ],
  imports: [ CommonModule, FormsModule, NgSlimScrollModule ],
  exports: [ UiDatepickerComponent, CommonModule, FormsModule, NgSlimScrollModule ],
})
export class UIDatepickerModule { }
