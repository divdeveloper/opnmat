import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TooltipModule} from 'ng2-tooltip';
import { SelectAcademiesComponent } from './select-academies.component';

@NgModule({
  declarations: [ SelectAcademiesComponent ],
  imports: [ 
    CommonModule,
    TooltipModule,
  ],
  exports: [ SelectAcademiesComponent, CommonModule ],
})
export class SelectAcademiesModule { }
