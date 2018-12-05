import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {UiPerPageComponent} from './ui-per-page.component';

@NgModule({
  declarations: [ UiPerPageComponent ],
  imports: [ CommonModule, FormsModule ],
  exports: [ UiPerPageComponent, CommonModule, FormsModule ],
})
export class UiPerPageModule { }
