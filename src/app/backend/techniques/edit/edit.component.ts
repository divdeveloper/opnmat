import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Select2TemplateFunction, Select2OptionData } from 'ng2-select2';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import { TechniquesService } from '../../../services/techniques.service';

@Component({
  selector: 'opn-edit-teachers',
  templateUrl: '../form.techniques.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class EditTechnigueComponent implements OnInit, OnDestroy {
  name: String;
  techniqueId: any;
  buttonText: String = 'Update technique';
  public academies: Array<Select2OptionData>;
  public optionsAcademy: Select2Options;
  private academy: any;
  private academyVal: any;

  constructor(
    private techniqueSrv: TechniquesService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private toastr: ToastsManager,
  ) {
    this.name = '';

    this.activeRoute.params.subscribe(params => {
      this.techniqueId = params['id'];
    });
  }

  ngOnInit() {
    this.techniqueSrv.getAcademies().subscribe(res => {
      this.academies = res;
    });

    this.optionsAcademy = {
      minimumResultsForSearch: 1,
      dropdownCssClass: 'academy-dropdown',
      placeholder: {
        id: '0', // the value of the option
        text: 'All Academy',
      },
    };

    this.techniqueSrv.getTechniqueById(this.techniqueId).subscribe(res => {
      this.name = res.name;
      this.academyVal = res.academy_id;
    });

  }

  public changeAcademy = function($e) {
    this.academy = $e.value;
  };

  onClick(el) {
    this.techniqueSrv.updateTechnique(this.techniqueId, {
      'name': this.name,
      'academy_id': this.academy,
    }).subscribe(
      res => {
        if (res.status) {
          this.router.navigate(['/admin/techniques/list']);
        }
      },
      err => {
        const errore = JSON.parse(err._body).errors;
        const self = this;
        errore.forEach(function(el){
          if (el.status == '400') {
            self.toastr.warning(el.description, 'Warning!');
          }
        });
      },
    );
  }
  ngOnDestroy() {
  }
}
