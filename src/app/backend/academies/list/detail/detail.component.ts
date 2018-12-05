import {
  Component,
  OnInit,
} from '@angular/core';
import {
  LocalDataSource,
} from 'ng2-smart-table';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';
import {
  Title,
} from '@angular/platform-browser';

import {
  AcademiesService,
} from '../../../../services/academies.service';

@Component({
  selector: 'opn-edit-academy',
  templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit {
  user: any;
  academyId: any;
  title: String = 'Edit Academy';
  button: String = 'Edit';
  public row: Object = {
    name: '',
    location: '',
    phone: '',
    email: '',
  };

  constructor(
    private router: Router,
    private academyService: AcademiesService,
    private titleService: Title,
    private activeRoute: ActivatedRoute) {
    this.titleService.setTitle('Edit Academy');
  }

  ngOnInit() {
    const self = this;
    /*this.academyService.getAcademyById().subscribe(res => {

    })*/
    this.activeRoute.params.subscribe(params => {
      this.academyId = params['id'];
    });

    this.user = this.academyService.getMe();
    this.academyService.getAcademyById(this.academyId).subscribe(res => {
      this.row = {
        name: res.name,
        location: res.location,
        phone: res.phone,
        email: res.email,
      };
    });
  }

  onCancel() {
    this.router.navigate(['/admin/academies/list']);
  }
}
