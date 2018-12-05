import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'oth-accounting',
  template: `<h1></h1>`,
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent {

  constructor(private route: ActivatedRoute,
              private router: Router) {
    const url = decodeURIComponent(this.route.snapshot.queryParams['url']);
    const location = this.route.snapshot.queryParams['location'];
    if(location) {
        router.navigate([`${url}`], {relativeTo: this.route, queryParams: {location: location}});
    } else {
        router.navigate([`${url}`], {relativeTo: this.route});
    }
  }

}
