import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { HeaderComponent } from '../inc/header/header.component';


@Component({
  selector: 'opn-login',
  template: '',
  styleUrls: ['./login.component.d.scss'],
})
export class ActiveComponent implements OnInit, OnDestroy {
  private kode: String;
  private subKode: any;

  constructor(
      private router: Router,
      private authService: AuthService,
      private activeRoute: ActivatedRoute ) {
  }

  ngOnInit() {
    this.subKode = this.activeRoute.params.subscribe(params => {
        this.kode = params['kode'];
    });
    this.authService.activeUser(this.kode).subscribe(res => {
        if (res.status) {
            localStorage.setItem('email', res.user.email);
            this.router.navigate(['/auth/welcome']);
        }
    });
  }
  ngOnDestroy() {
  }
}
