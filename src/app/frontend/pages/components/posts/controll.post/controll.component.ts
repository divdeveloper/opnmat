import { Component, Output, Input, EventEmitter, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';


@Component({
  selector: 'opn-controlls-post',
  templateUrl: './controll.component.html',
  styleUrls: [ './controll.component.scss' ],
})
export class ControllsPostComponent implements OnInit {
  @Input() direction: String;
  @Input() current: String;

  @ViewChild('dropdownVisibility', {read: ElementRef}) dropdownVisibility: ElementRef;

  @Output() onSelected: EventEmitter <any> = new EventEmitter <any> ();

  @HostListener('document:mouseup', ['$event'])
  onMouseUp() {
    if (this.toggle) {
      this.onToggle();
    }
  }

  private toggle: Boolean = false;
  constructor() {}

  ngOnInit() {
    if (!this.direction) {
      this.direction = '';
    }
  }

  onToggle() {
    const element = this.dropdownVisibility.nativeElement;
    if (!this.toggle) {
      element.classList.add('open');
    }else {
      element.classList.remove('open');
    }
    this.toggle = !this.toggle;
  }

  onSelect(event, visibility) {
    this.dropdownVisibility.nativeElement.classList.remove('open');
    if (visibility == 'remove') {
      this.onSelected.emit({action: 'remove'});
    }else {
      this.onSelected.emit({action: 'update', share_from: visibility});
    }
    this.toggle = !this.toggle;
  }
}
