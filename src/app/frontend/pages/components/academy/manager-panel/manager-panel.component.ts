import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AcademiesService } from '../../../../../services/academies.service';
import { DataService } from '../../../../../services/data.service';

@Component({
  selector: 'opn-manager-panel',
  templateUrl: './manager-panel.component.html',
  styleUrls: ['./manager-panel.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    AcademiesService,
  ],
})
export class ManagerPanelComponent implements OnInit {
  private openPro: Boolean = false;
  private isManager: Boolean = false;
  private isPro: Boolean = false;
  private academyLink: String = '';

  @Input() academyId?: any;

  @Output() checkManager: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCheckPro: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    private academyService: AcademiesService,
    private router: Router,
    private dataServices: DataService,
  ) {
  }

  ngOnInit() {
    this.academyLink = `/academiy-datail/${this.academyId}`;
    this.statusManager();
    this.checkPro();
  }

  public onEventMessage () {
      this.dataServices.eventMessage.emit({
          type: 'manager',
          academy_id: this.academyId
      });
  }
  checkPro() {
    this.academyService.checkPro(this.academyId).subscribe(res => {
      if (res === 1) {
        this.isPro = true;
        this.onCheckPro.emit(true);
      }else {
        this.onCheckPro.emit(false);
      }
    });
  }
  statusManager() {
    this.academyService.checkUserInManager(this.academyId).subscribe(res => {
      if (res) {
        this.isManager = true;
        this.checkManager.emit(true);
      }
    });
  }

  onOpenPro() {
    document.body.classList.add('openModal');
    this.openPro = true;
  }

  onClosePro() {
    document.body.classList.remove('openModal');
    this.openPro = false;
  }

  goToLink(link) {
    if (this.isPro) {
      this.router.navigate([this.academyLink + link]);
    }
  }
  onSetPro() {
    this.isPro = true;
    this.onCheckPro.emit(true);
  }
}
