import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
  SimpleChange,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { TooltipModule } from 'ng2-tooltip';

import { AuthService } from '../../app/services/auth/auth.service';

@Component({
  selector: 'opn-academies-select',
  templateUrl: 'select-academies.component.html',
  styleUrls: ['select-academies.component.scss'],
  providers: [],
})

export class SelectAcademiesComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() data: any;
  @Input() valid: Boolean;
  @Input() setCurrent: any;
  @Input() exclamation: Boolean = true;

  @Output()
  selected: EventEmitter < any > = new EventEmitter < any > ();

  @ViewChild("academyInput", {read: ElementRef}) academyInput: ElementRef;
  @ViewChild("results", {read: ElementRef}) resultsRef: ElementRef;

  private _academies: any = [];
  private _selected: any;
  private searchTerms = new Subject<string>();
  public academyName: String;
  private curent: String;
  private dropdownBox: any;
  private disabledButton: Boolean;

  constructor(private authService: AuthService) {
    this.curent = '';
    this.dropdownBox = document.getElementsByClassName('academies-results');
  }

  ngOnInit() {
    this.data = [];
    this.academyName = '';
    this.disabledButton = true;
  }
  ngAfterViewInit() {

  }
  onLoadAcademies(event) {
    const name = event.target.value;
   
    this.authService.getAcademiesLimit(5).subscribe(res => {
      this._academies = res;
      this.dropdownBox[0].setAttribute("style", "display:block")
    });
  }

  onBlur() {
    this._academies = [];
    this.dropdownBox[0].setAttribute("style", "display:none;");
  }

  ngOnChanges(changes: SimpleChanges) {
    const academy: SimpleChange = changes.setCurrent;
    if (academy && academy.currentValue) {
      this.academyInput.nativeElement.value = academy.currentValue.text;
    }
  }

  searchAcademy(event) {
    const name = event.target.value;
    if (name != '') {
      this.authService.getAcademiesByName(name).subscribe(res => {
        this._academies = res;
      });
      this.disabledButton = false;
    }else {
      this.authService.getAcademiesLimit(5).subscribe(res => {
        this._academies = res;
      });
      this.disabledButton = true;
    }
  }
  onSetMyAcademy() {
    const academyName = this.academyInput.nativeElement.value;
    if (academyName != '') {
      this.selected.emit({
        id: 0,
        text: academyName,
      });
    }
  }

  private selectAcademy(event, academy) {
    event.target.classList.add('active');
    this.curent = academy.text;
    this.selected.emit(academy);
  }
}
