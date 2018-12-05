import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { TechniquesService } from '../../../../services/techniques.service';
import { findIndex } from 'lodash';

@Component({
  selector: 'opn-techniques',
  templateUrl: './techniques.component.html',
  styleUrls: ['./techniques.component.scss'],
  providers: [
    TechniquesService,
  ],
})
export class TechniquesComponent implements OnInit {

  public formTechniques: FormGroup;
  public formTechnique: FormGroup;
  private techniquesArr: any = [];

  @Input() academyId: Number;
  private updateTechnique: Boolean = false;
  private newTechniquesShow: Boolean = false;

  constructor(
    private techniquesService: TechniquesService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {

    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    };
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
         this.router.navigated = false;
         window.scrollTo(0, 0);
      }
    });
  }
  ngOnInit() {
    this.buildFormTechniques();
    this.getTechniques(this.academyId);
    this.buildFormTechnique({});
  }

  getTechniques(academy_id) {
    this.techniquesService.getTechniquesByAcademy(academy_id).subscribe(Techniques => {
      console.log('Techniques', Techniques);
      this.techniquesArr = Techniques;
    });
  }


  private buildFormTechniques() {
    this.formTechniques = this.fb.group({
      name: ['', Validators.required],
    });
  }

  private buildFormTechnique(technique) {
    this.formTechnique = this.fb.group({
      id: [(technique.id)?technique.id:0],
      name: [(technique.name)?technique.name:'', Validators.required],
    });
  }

  private onOpenEdit(e, technique) {
    const top = e.toElement.parentElement.offsetTop - 13;    
    this.buildFormTechnique(technique);
    this.updateTechnique = true;
    document.getElementById("update-technique").style.cssText  = `top: ${top}px; height: auto;`;
   
  }
  private onRemove(technique) {
    const self = this;
    this.techniquesService.removeTechnique(technique.id).subscribe(res => {
      if(res.status){
        self.techniquesArr = self.techniquesArr.filter(iTechnique => iTechnique !== technique);
      }
    });
    
  }
  private onCreateTechnique(technique) {
    const obj = {
      academy_id: this.academyId,
      name: technique.value.name,
    };
    this.techniquesService.createTechnique(obj).subscribe(res => {
      if (res.status) {
        this.techniquesArr.unshift(res.data);
        this.buildFormTechniques();
      }
    })
  }
  private onUpdateTechnique(tchnique) {
    const obj = {
      academy_id: this.academyId,
      name: tchnique.value.name,
    };
    this.techniquesService.updateTechnique(tchnique.value.id, obj).subscribe(res => {
      if (res.status) {
        const i = findIndex(this.techniquesArr, {id: tchnique.value.id});
        this.techniquesArr[i].name = tchnique.value.name;
        document.getElementById("update-technique").style.cssText  = `top: ${top}px; height: 0;`;
        this.buildFormTechnique({});
      }
    })
  }
}
