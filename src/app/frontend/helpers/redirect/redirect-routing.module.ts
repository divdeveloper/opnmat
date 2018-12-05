import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectComponent } from './redirect.component';

const redirectRoutes: Routes = [
    {
        path: '',
        component:  RedirectComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(redirectRoutes),
    ],
    exports: [RouterModule],
})

export class RedirectRoutingModule {

}
