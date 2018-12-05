import { Injectable } from '@angular/core';

import { ModalAcademyComponent } from './modal.component';

@Injectable()
export class ModalAcademyService {
  private modals: Array<ModalAcademyComponent>;

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

  findModal(modalId: string): ModalAcademyComponent {
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

  registerModal(newModal: ModalAcademyComponent): void {
    let modal = this.findModal(newModal.modalId);
    if (modal) {
      this.modals.splice(this.modals.indexOf(modal), 1);
    }
    this.modals.push(newModal);
  }
}
