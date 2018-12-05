import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

import {
  Router,
} from '@angular/router';

import { AcademiesService } from '../../../../../services/academies.service';

@Component({
  selector: 'opn-item-academy',
  templateUrl: './academy-view.component.html',
  styleUrls: ['./academy-view.component.scss'],
  providers: [AcademiesService],
})
export class ViewWidgetAcademyComponent implements OnInit {

  @Input() academy: any;

  private ServerUrl: String;
  private photoUrl: String;
  constructor(
    private service: AcademiesService,
    private router: Router,
  ) {
    this.ServerUrl = this.service.getServerUrl();
  }

  ngOnInit() {
    if (!this.academy.photo || this.academy.photo == '') {
      this.photoUrl = `url(/assets/images/academy-logo.jpg)`;
    }else {
      this.photoUrl = `url(${this.ServerUrl}${this.academy.photo}?${new Date().getTime()})`;
    }
  }
  onToAcademy() {
    this.router.navigate(['academiy-datail', this.academy.id]);
  }
}
