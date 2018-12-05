import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import { TeachersService } from '../../../services/teachers.service';

@Component({
  selector: 'opn-list-teachers',
  templateUrl: './list.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class ListTeachersComponent {

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
      first_name: {
        title: 'First Name',
        type: 'string',
      },
      last_name: {
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
  constructor(private service: TeachersService, private router: Router, private activeRoute: ActivatedRoute) {
    this.service.getTeachers().subscribe(res => {
      this.source.load(res);
    })
    
  }

  onCreate(event) {
    this.router.navigate(['/admin/teachers/new/']);
  }

  onDelete(event) {
    this.service.removeTeacher(event.data.id).subscribe(res => {
      if (res.status) {
        this.source.remove(event.data);
      }
    });
  }


  onEdit(event) {
    this.router.navigate(['/admin/teachers/edit/' + event.data.id]);
  }
}
