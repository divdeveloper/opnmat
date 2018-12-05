import { Component, Output, EventEmitter, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';


@Component({
  selector: 'opn-dropdown-visibility',
  templateUrl: './dropdown-visibility.component.html',
  styleUrls: [ './dropdown-visibility.component.scss' ],
})
export class DropdownVisibilityComponent implements OnInit {
  @ViewChild("dropdownVisibility", {read: ElementRef}) dropdownVisibility: ElementRef;
  @ViewChild("dropdownBtn", {read: ElementRef}) dropdownBtn: ElementRef;

  @Output() onSelected: EventEmitter <String> = new EventEmitter <String> ();
  @Output() onCurrent: EventEmitter <String> = new EventEmitter <String> ();

  private toggle: Boolean = false;

  @HostListener('document:mouseup', ['$event'])
  onMouseUp() {
    if (this.toggle) {
      this.onToggle();
    }
  }
  constructor() {}

  ngOnInit() {
    this.onCurrent.emit('all');
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
    this.dropdownBtn.nativeElement.innerHTML = event.toElement.innerHTML;
    this.dropdownVisibility.nativeElement.classList.remove('open');
    this.onSelected.emit(visibility);
    this.toggle = !this.toggle;
  }
}
