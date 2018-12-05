import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsPageComponent } from './contacts-page.component';

const ContactsPageRoutes: Routes = [
    {
        path: '',
        component: ContactsPageComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(ContactsPageRoutes),
    ],
    exports: [
        RouterModule,
    ],
})

export class ContactsPageRoutingModule { }
