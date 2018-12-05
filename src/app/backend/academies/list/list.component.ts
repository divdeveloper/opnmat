import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import { AcademiesService } from '../../../services/academies.service';
import { NameRenderComponent } from './name-render.component';
import { DateRenderComponent } from './date-render.component';

@Component({
  selector: 'opn-list-academies',
  templateUrl: './list.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class ListComponent {

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
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: 'Name',
        type: 'custom',
        renderComponent: NameRenderComponent,
      },
      location: {
        title: 'Location',
        type: 'string',
      },
      phone: {
        title: 'Phone',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
      created_at: {
        title: 'Creation date',
        type: 'custom',
        renderComponent: DateRenderComponent,
      },
    },
    actions: {
      position: 'right',
    },
    mode: 'external',
  };

  source: LocalDataSource = new LocalDataSource();
  constructor(private service: AcademiesService, private router: Router, private activeRoute: ActivatedRoute) {
    this.service.getAcademies().subscribe(res => {
      console.log(res);
      this.source.load(res.data);
    });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onEdit(event) {
    this.router.navigate(['/admin/academies/edit/' + event.data.id]);
  }
  onCreate(event) {
    this.router.navigate(['/admin/academies/new']);
  }
  onDelete(event) {
    this.service.removeAcademyById(event.data.id).subscribe(res => {
      if (res.status) {
        this.source.remove(event.data);
      }
    });
  }
  onSelect(event) {
    this.router.navigate(['/admin/academies/detail/' + event.data.id]);
  }
}
