import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'opn-ui-checkbox',
  templateUrl: './ui-checkbox.component.html',
  styleUrls: ['./ui-checkbox.component.scss'],
})
export class UiCheckboxComponent implements OnInit {

  @Input() check: Boolean = false;

  @Output()
  changeCheckbox: EventEmitter < Boolean > = new EventEmitter < Boolean > ();

  private model: any;

  constructor() {}

  ngOnInit() {
    if (this.check) {
      this.model = this.check;
    }
  }
  onChange(event) {
    this.changeCheckbox.emit(this.model);
  }
}
