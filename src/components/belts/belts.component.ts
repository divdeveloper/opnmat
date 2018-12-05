import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  ElementRef,
  HostListener,
  forwardRef,
} from '@angular/core';

import { ConfigService } from '../../app/services/service.config';

export interface ClolorsBelt {
  id ?: Number;
  hex ?: String;
  name ?: String;
}

export interface Belts {
  id ?: Number;
  colorId ?: Number;
  source ?: String;
  name ?: String;
  stripe ?: Number;
}

@Component({
  selector: 'opn-belts',
  templateUrl: 'belts.component.html',
  styleUrls: ['belts.component.scss'],
  providers: [],
})
export class BetlsComponent implements OnInit, OnChanges {
  @Input() colors: Array<ClolorsBelt>;

  @Input() belts: Belts;
  @Input() current: any;

  @Output()
  change: EventEmitter < number > = new EventEmitter < number > ();

  @Output()
  changeBelt: EventEmitter < any > = new EventEmitter < any > ();


  private _belts: Array<Belts>;
  private activeBelt: Belts;
  private belt_index: any;
  private current_index: Number = 0;
  private current_belt_id: Number = 0;

  ngOnInit() {
    this.belt_index = 0;
  }

  private changeCurrentColor(current): Number {
    for (let i = 0; i < this.colors.length; i ++ ) {
      if (current.belt_color.id == this.colors[i].id) {
        return i;
      }
    }
    return 0;
  }

  private changeCurrentBelt(current): Number {
    if (current && this._belts != undefined) {
      console.log('changeCurrentBelt ', current);
      console.log('changeCurrentBelt ', this._belts);
      for (let i = 0; i < this._belts.length; i ++ ) {
        if (current == this._belts[i].id) {
          return i;
        }
      }
    }
    return 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    const belts: SimpleChange = changes.belts;
    const current: SimpleChange = changes.current;
    if (changes.belts && changes.belts.currentValue) {
     
      this.belt_index = this.changeCurrentBelt(this.current_belt_id);
      
      this.activeBelt = this.belts[this.belt_index];
      this._belts = changes.belts.currentValue;
      this.changeBelt.emit(this.belts[0].id);
    }
    if (current && current.currentValue != undefined) {
      this.current_index = this.changeCurrentColor(current.currentValue);
      this.current_belt_id = current.currentValue.id;
      this.activeBelt = {
        id: current.currentValue.id,
        colorId: current.currentValue.belt_color_id,
        source: ConfigService.URL_SERVER + current.currentValue.sourse,
        name: current.currentValue.name,
        stripe: current.currentValue.stripe,
      };
      this.change.emit(current.currentValue.belt_color_id);
    }
  }

  onNext() {
    if (this._belts) {
      if (this.belt_index < (this._belts.length - 1)) {
        this.belt_index += 1;
      }else {
        this.belt_index = 0;
      }
      this.activeBelt = this._belts[`${this.belt_index}`];
      this.changeBelt.emit(this.activeBelt.id);
    }
  }

  onPrev() {
    if (this._belts) {
      if (this.belt_index > 0) {
        this.belt_index -= 1;
      }else {
        this.belt_index = (this._belts.length - 1);
      }
      this.activeBelt = this._belts[`${this.belt_index}`];
      this.changeBelt.emit(this.activeBelt.id);
    }
  }

  private onSelectColor(id, e) {
    this.belt_index = 0;
    this.current_belt_id = 0;
    const elems = document.querySelectorAll('.belt-color');
    [].forEach.call(elems, function (el) {
      el.classList.remove('active');
    });

    e.toElement.classList.add('active');
    this.change.emit(id);
  }
}
