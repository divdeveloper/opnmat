import {
  Component,
  OnInit,
} from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'opn-ui-back-btn',
  templateUrl: './ui-back-btn.html',
  styleUrls: ['./ui-back-btn.scss'],
})
export class UiBackBtn implements OnInit {

  constructor(private _location: Location) {}

  ngOnInit() {
  }

  goBack(){
    this._location.back();
  }
}
