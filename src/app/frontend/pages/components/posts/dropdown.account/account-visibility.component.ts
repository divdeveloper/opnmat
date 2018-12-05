import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  ViewChild,
  ElementRef,
} from '@angular/core';


@Component({
  selector: 'opn-account-visibility',
  templateUrl: './account-visibility.component.html',
  styleUrls: ['./account-visibility.component.scss'],
})
export class AccountVisibilityComponent implements OnInit, OnChanges {
  @ViewChild("dropdownVisibility", {
    read: ElementRef
  }) dropdownVisibility: ElementRef;
  @ViewChild("dropdownBtn", {
    read: ElementRef
  }) dropdownBtn: ElementRef;


  @Input() current: any;
  @Output() onSelected: EventEmitter < String > = new EventEmitter < String > ();

  private toggle: Boolean = false;
  constructor() {}

  ngOnInit() {}

  onToggle() {
    const element = this.dropdownVisibility.nativeElement;
    if (!this.toggle) {
      element.classList.add('open');
    } else {
      element.classList.remove('open');
    }
    this.toggle = !this.toggle;
  }

  onSelect(event, visibility) {
    this.dropdownBtn.nativeElement.innerHTML = event.toElement.innerHTML;
    this.dropdownVisibility.nativeElement.classList.remove('open');
    this.current = visibility;
    this.onSelected.emit(visibility);
    this.toggle = !this.toggle;
  }

  ngOnChanges(changes: SimpleChanges) {
    const current: SimpleChange = changes.current;
    if (current.currentValue) {
      this.current = current.currentValue;
      switch (this.current) {
        case 1: {
          this.dropdownBtn.nativeElement.innerHTML = 'Public';
          break;
        }
        case 0: {
          this.dropdownBtn.nativeElement.innerHTML = 'Private';
          break;
        }
      }
    }
  }
}
