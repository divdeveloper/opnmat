import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsPageComponent } from './settings-page.component';

const SettingsPageRoutes: Routes = [
    {
        path: '',
        component: SettingsPageComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(SettingsPageRoutes),
    ],
    exports: [
        RouterModule,
    ],
})

export class SettingsPageRoutingModule { }
