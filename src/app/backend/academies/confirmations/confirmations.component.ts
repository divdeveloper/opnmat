import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import { AcademiesService } from '../../../services/academies.service';

@Component({
  selector: 'opn-confirmations-academies',
  templateUrl: './Confirmations.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class ConfirmationsComponent {

  settings = {
    edit: {
      editButtonContent: '<i class="ion-checkmark-round"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="ion-close-round"></i>',
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      name: {
        title: 'name',
        type: 'string',
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
    },
    actions: {
      position: 'right',
      add: false,
    },
    mode: 'external',
  };

  source: LocalDataSource = new LocalDataSource();
  constructor(private service: AcademiesService, private router: Router, private activeRoute: ActivatedRoute) {
    this.service.getAcademyByStatus('In_process').subscribe(res => {
      this.source.load(res);
    });
  }


  onConfirm(event) {
    this.service.confirmAcademy( {id: event.data.id, status: 'Accepted'}).subscribe(res => {
      if (res.status) {
        alert(res.status);
        this.source.remove(event.data);
      }
    });
  }

  onDelete(event) {
    this.service.confirmAcademy( {id: event.data.id, status: 'Rejected'}).subscribe(res => {
      if (res.status) {
      }
    });
  }
}
