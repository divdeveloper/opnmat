import { Component, HostListener, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ModalService } from './modal.service';

/**
 * ModalComponent - This class represents the modal component.
 * @requires Component
 */

@Component({
  selector: 'opn-modal',
  styleUrls: ['./modal.component.scss'],
  templateUrl: './modal.component.html',
})

export class ModalComponent implements OnInit {

  isOpen: Boolean = false;

  @Input() closebtn: boolean;
  @Input() modalId: string;
  @Input() modalTitle: string;
  @Input() blocking: boolean;
  @Output() onClose: EventEmitter <boolean> = new EventEmitter <boolean>();
  @HostListener('document:keyup', ['$event'])

  keyup(event: KeyboardEvent): void {
    if (event.keyCode === 27) {
      this.modalService.close(this.modalId, true);
    }
  }

  constructor(private modalService: ModalService) { }

  ngOnInit() {
    this.modalService.registerModal(this);
  }

  close(checkBlocking = false): void {
    this.onClose.emit(true);
    this.modalService.close(this.modalId, checkBlocking);
  }

}
