import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';

import {
  Location,
} from '@angular/common';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'opn-ui-select-type',
  templateUrl: './ui-select.component.html',
  styleUrls: ['./ui-select.component.scss'],
})
export class UiSelectTypeComponent implements OnInit {

  @Input() dataSource: Array < Object > = [];

  @Input() currentValue: any;

  @Output()
  change: EventEmitter < number > = new EventEmitter < number > ();

  @ViewChild('uiSelect', {
    read: ElementRef,
  }) selectRef: ElementRef;

  private open = false;
  private carrent: String = '';

  @HostListener('document:mouseup', ['$event'])
  onMouseUp() {
    if (this.open) {
      this.changeState();
    }
  }

  constructor() {}

  ngOnInit() {
    if (this.currentValue) {
      this.setCurrent(this.currentValue);
    }else {
      this.carrent = this.dataSource[0]['title'];
    }
  }
  private setCurrent(key) {
    for (let i = 0; i < this.dataSource.length; i++) {
      if (this.dataSource[i]['value'] == this.currentValue) {
        this.carrent = this.dataSource[i]['title'];
      }
    }
  }

  private changeState() {
    if (!this.open) {
      this.selectRef.nativeElement.classList.add('open');
    } else {
      this.selectRef.nativeElement.classList.remove('open');
    }
    this.open = !this.open;
  }

  onClick(event) {
    this.changeState();
  }
  onSelect(option) {
    this.carrent = option.title;
    this.change.emit(option);
  }
}
