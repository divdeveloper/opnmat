import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DateRenderComponent } from './date.render.component';
import { TypeRenderComponent } from './type.render.component';

import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import { ActivitiesService } from '../../../services/activity.service';

@Component({
  selector: 'opn-list-teachers',
  templateUrl: './list.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class ListActivityComponent {

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
      name: {
        title: 'Name',
        type: 'string',
      },
      location: {
        title: 'Location',
        type: 'string',
      },
      type: {
        title: 'Type',
        type: 'custom',
        renderComponent: TypeRenderComponent,
      },
      payment_status: {
        title: 'Payment',
        type: 'string',
      },
      date: {
        title: 'Date',
        type: 'custom',
        renderComponent: DateRenderComponent,
      },
      user_age_group: {
        title: 'Age Group',
        type: 'string',
      },
    },
    actions: {
      position: 'right',
      edit: false,
    },
    mode: 'external',
  };

  source: LocalDataSource = new LocalDataSource();
  constructor(private service: ActivitiesService, private router: Router, private activeRoute: ActivatedRoute) {
    this.service.getActivities().subscribe(res => {
      this.source.load(res);
    });
  }

  onCreate(event) {
     this.router.navigate(['/admin/activities/new/']);
  }

  onDelete(event) {
    this.service.removeActivity(event.data.id).subscribe(res => {
      if (res.status) {
        this.source.remove(event.data);
      }
    });
  }


  onEdit(event) {
    // this.router.navigate(['/admin/teachers/edit/' + event.data.id]);
  }
}
