import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import { TechniquesService } from '../../../services/techniques.service';

@Component({
  selector: 'opn-list-technique',
  templateUrl: './list.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class ListTechniqueComponent {

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
      },
      name: {
        title: 'Last Name',
        type: 'string',
      },
    },
    actions: {
      position: 'right',
    },
    mode: 'external',
  };

  source: LocalDataSource = new LocalDataSource();
  constructor(private service: TechniquesService, private router: Router, private activeRoute: ActivatedRoute) {
    this.service.getTechniques().subscribe(res => {
      this.source.load(res);
    });
  }

  onCreate(event) {
    this.router.navigate(['/admin/techniques/new/']);
  }

  onDelete(event) {
    this.service.removeTechnique(event.data.id).subscribe(res => {
      if (res.status) {
        this.source.remove(event.data);
      }
    });
  }


  onEdit(event) {
    this.router.navigate(['/admin/techniques/edit/' + event.data.id]);
  }
}
