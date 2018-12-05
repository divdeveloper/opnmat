import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'opn-app',
  template: ` <div class="wrap-limiter m-auto">
              <router-outlet></router-outlet>
            </div>`,
})
export class AppComponent {
  public value: Date = new Date(2000, 2, 10, 10, 30, 0);
  constructor(public toastr: ToastsManager, vRef: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vRef);
  }
}
