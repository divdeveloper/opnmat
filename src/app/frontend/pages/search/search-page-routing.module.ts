import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPageComponent } from './search-page.component';
import { SearchActivityComponent } from './search-activity/search-activity.component';
import { SearchAcademyComponent } from './search-academy/search-academy.component';
import { SearchUsersComponent } from './search-users/search-users.component';

const SearchPageRoutes: Routes = [
    {
        path: '',
        component: SearchPageComponent,
        children: [
            {
                path: '',
                redirectTo: 'activity',
                pathMatch: 'full'
            },
            {
                path: 'activity',
                component: SearchActivityComponent
            },
            {
                path: 'academy',
                component: SearchAcademyComponent
            },
            {
                path: 'users',
                component: SearchUsersComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(SearchPageRoutes),
    ],
    exports: [
        RouterModule,
    ],
})

export class SearchPageRoutingModule { }
