import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { ConfigService } from '../../../services/service.config';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss']
})

export class ContactsPageComponent implements OnInit {
    public academyId: number;
    public formContacts: FormGroup;
    public activeProfile;
    public urlLogo = 'assets/images/no-image.png';
    public managers: Array<any> = [];
    public file;
    public user;
    public academy;
    public baseUrl;
    public hours = [];

    constructor(private route: ActivatedRoute,
                private fb: FormBuilder,
                private dataService: DataService) {
    }

    ngOnInit() {
        this.academyId = +this.route.snapshot.params['id'];
        this.user = JSON.parse(localStorage.getItem('user'));
        this.buildForm();
        this.getAcademy(this.academyId);
        this.getManagers(this.academyId);
        this.baseUrl = ConfigService.URL_SERVER;
    }

    public ngOnDestroy() {}

    public buildForm() {
        this.formContacts = this.fb.group({
            name: ['', Validators.required],
            location: ['', Validators.required],
            latitude: [''],
            longitude: [''],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            information: ['']
        });
        // this.formContacts.disable();
    }

    public getAcademy(id: number) {
        this.dataService.getResponse(`/academies/${id}?include=academy_works`)
            .subscribe((res) => {
                this.setValues(res);
                this.hours = res.academy_works;
            })
    }

    public setValues(res){
        this.academy = res;
        this.activeProfile = !!res.status_public;
        this.formContacts.controls['name'].setValue(res.name);
        this.formContacts.controls['email'].setValue(res.email);
        this.formContacts.controls['phone'].setValue(res.phone);
        this.formContacts.controls['location'].setValue(res.location);
        this.formContacts.controls['latitude'].setValue(res.latitude);
        this.formContacts.controls['longitude'].setValue(res.longitude);
        this.formContacts.controls['location'].setValue(res.location);
        this.formContacts.controls['information'].setValue(res.information);
    }

    public getManagers(id: number){
        this.dataService.getResponse(`/managers/users/${id}`)
            .subscribe((res) => {
                this.managers = res.data;
            });
    }
}
