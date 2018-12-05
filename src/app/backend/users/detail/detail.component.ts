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

import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';

import {
  UsersService,
} from '../../../services/users.service';

@Component({
  selector: 'opn-edit-academy',
  templateUrl: './detail.component.html',
})
export class DetailUserComponent implements OnInit {
  user: any;
  userId: any;
  title: String = 'Edit Academy';
  button: String = 'Edit';
  userModel: any;
  email: String;

  constructor(
    private router: Router,
    private userService: UsersService,
    private titleService: Title,
    private toasterService: ToasterService,
    private activeRoute: ActivatedRoute) {
    this.titleService.setTitle('Edit Academy');
    this.userModel = {
      firstName: '',
      lastName: '',
      email: '',
      id: '',
    };
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.userId = params['id'];
    });

    this.userService.getUserById(this.userId).subscribe(res => {
      this.userModel = {
        firstName: res.first_name,
        lastName: res.last_name,
        email: res.email,
        id: res.id,
      };
    });
  }

  noResetPassword(id) {
    const self = this;
    this.userService.resetPasword({email: this.userModel.email}).subscribe(res => {
      if (res.status) {
        alert('success!');
      }
    });
  }

  onCancel() {
    this.router.navigate(['/admin/users/list']);
  }
}
