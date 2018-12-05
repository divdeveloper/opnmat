import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import { CmsPagesService } from '../../../services/cms.pages.service';

@Component({
  selector: 'opn-list-pages',
  templateUrl: './list.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class ListPagesComponent {

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
      title: {
        title: 'Title',
        type: 'string',
      },
    },
    actions: {
      position: 'right',
    },
    mode: 'external',
  };

  source: LocalDataSource = new LocalDataSource();
  constructor(private service: CmsPagesService, private router: Router, private activeRoute: ActivatedRoute) {
    this.service.getPages().subscribe(res => {
      this.source.load(res.data);
    });
  }

  onCreate(event) {
    this.router.navigate(['/admin/cms/new/']);
  }

  onDelete(event) {
    this.service.removePage(event.data.id).subscribe(res => {
      if (res.status) {
        this.source.remove(event.data);
      }
    });
  }


  onEdit(event) {
    localStorage.setItem('pageContent', event.data.content);
    this.router.navigate(['/admin/cms/edit/' + event.data.id]);
  }
}
