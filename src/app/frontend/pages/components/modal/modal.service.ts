import { Injectable } from '@angular/core';

import { ModalComponent } from './modal.component';

@Injectable()
export class ModalService {
  private modals: Array<ModalComponent>;

  constructor() {
    this.modals = [];
  }


  close(modalId: string, checkBlocking = false): void {
    let modal = this.findModal(modalId);
    if (modal) {
      if (checkBlocking && modal.blocking) {
        return;
      }
      setTimeout(() => {
        modal.isOpen = false;
      }, 250);
      document.body.classList.remove('openModal');
    }
  }

  findModal(modalId: string): ModalComponent {
    for (let modal of this.modals) {
      if (modal.modalId == modalId) {
        return modal;
      }
    }
    return null;
  }

  open(modalId: string): void {
    let modal = this.findModal(modalId);
    if (modal) {
      setTimeout(() => {
        modal.isOpen = true;
        document.body.classList.add('openModal');
      }, 250);
    }
  }

  registerModal(newModal: ModalComponent): void {
    let modal = this.findModal(newModal.modalId);
    if (modal) {
      this.modals.splice(this.modals.indexOf(modal), 1);
    }
    this.modals.push(newModal);
  }
}
