import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';
import { DateRenderComponent } from './date-render.component';

import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'opn-list-academies',
  templateUrl: './list.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class ListUsersComponent {

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
      first_name: {
        title: 'First name',
        type: 'string',
      },
      last_name: {
        title: 'Last Name',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
        editable: false,
        editor: {
          type: 'text',
        },
      },
      created_at: {
        title: 'Registration date',
        type: 'custom',
        renderComponent: DateRenderComponent,
      },
    },
    actions: {
      position: 'right',
      add: false,
      delete: false,
      custom: [{ name: 'Edit', title: `<i  class="fa fa-edit"></i>` },
      { name: 'Activate', title: `<i class="fa fa-toggle-on"></i>` },
      { name: 'Deactivate', title: `<i  class="fa fa-toggle-off"></i>` }
    ],
    },
    mode: 'inline',
  };

  source: LocalDataSource = new LocalDataSource();
  constructor(private service: UsersService, private router: Router, private activeRoute: ActivatedRoute) {
    this.service.getUsers().subscribe(res => {
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
    // this.service.removeAcademyById(event.data.id).subscribe(res => {
    //   if (res.status) {
    //     this.source.remove(event.data);
    //   }
    // });
  }
  onEditConfirm(event) {
    this.service.updateUsers(event.newData.id, {
      first_name: event.newData.first_name,
      last_name: event.newData.last_name,
    }).subscribe(row => {
      event.confirm.resolve();
    });
  }
  onSelect(event) {
    this.router.navigate(['/admin/users/detail/' + event.data.id]);
  }
}
