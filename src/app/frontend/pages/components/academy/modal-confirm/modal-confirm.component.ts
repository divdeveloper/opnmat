import { Component, HostListener, Input, Output, OnInit, EventEmitter } from '@angular/core';
/**
 * ModalComponent - This class represents the modal component.
 * @requires Component
 */

@Component({
  selector: 'opn-confirm-modal',
  styleUrls: ['./modal-confirm.component.scss'],
  templateUrl: './modal-confirm.component.html',
})

export class ModalConfirmComponent implements OnInit {

  isOpen: Boolean = false;

  @Input() modalTitle: string;
  @Output() confirm: EventEmitter <boolean> = new EventEmitter <boolean>();
  @HostListener('document:keyup', ['$event'])

  keyup(event: KeyboardEvent): void {
    if (event.keyCode === 27) {
      this.isOpen = false;
    }
  }

  constructor() { }

  ngOnInit() {}

  onConfirm(confirm): void {
    this.confirm.emit(confirm);
    this.close();
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }
}
