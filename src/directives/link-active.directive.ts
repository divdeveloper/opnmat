import { Directive, Input, OnInit, ElementRef} from '@angular/core';

@Directive({
   selector: '[opnActiveRoute]',
})

export class OpnActiveRouteDirective implements OnInit {
  @Input() routerLink: any;
  @Input() opnActiveRoute: any;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const path = document.location.href;

    if (this.routerLink === '/' && document.location.hash === '#/') {
      this.el.nativeElement.classList.add('active-link');
    }
    if (this.routerLink !== '/' && path.lastIndexOf((this.routerLink) ? this.routerLink : this.opnActiveRoute) >= 0 ) {
      this.el.nativeElement.classList.add('active-link');
    }
  }
}
