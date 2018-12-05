import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../../services/data.service';
import {ConfigService} from '../../../services/service.config';
import {IOption} from 'ng-select';
import {isEqual} from 'lodash';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'app-settings',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss', '../@theme/scss/theme.scss'],
})
export class SettingsPageComponent implements OnInit, OnDestroy {
    public academyId: number;
    public formSettings: FormGroup;
    public activeProfile;
    managersDropDownIsActive: Boolean = false;
    public managers: Array<any> = [];
    public listSearch: Array<any> = [];
    public urlLogo;
    public noPhotoImg = 'assets/images/no-image.png';
    public file;
    public user;
    public academy;
    savedRecently = false;
    managerInput = '';
    public baseUrl;
    public locationInputSettings = {
        showSearchButton: false,
        locationIconUrl: 'http://www.myiconfinder.com/uploads/iconsets/369f997cef4f440c5394ed2ae6f8eecd.png',
        inputString: ''
    };
    public days: Array<IOption> = [
        {label: 'Mon', value: 'Mon'},
        {label: 'Tue', value: 'Tue'},
        {label: 'Wed', value: 'Wed'},
        {label: 'Thu', value: 'Thu'},
        {label: 'Fri', value: 'Fri'},
        {label: 'Sat', value: 'Sat'},
        {label: 'Sun', value: 'Sun'}
    ];
    public h_start: Array<IOption> = [
        {label: '1:00 a.m.', value: '1:00'},
        {label: '2:00 a.m.', value: '2:00'},
        {label: '3:00 a.m', value: '3:00'},
        {label: '4:00 a.m.', value: '4:00'},
        {label: '5:00 a.m.', value: '5:00'},
        {label: '6:00 a.m.', value: '6:00'},
        {label: '7:00 a.m.', value: '7:00'},
        {label: '8:00 a.m.', value: '8:00'},
        {label: '9:00 a.m.', value: '9:00'},
        {label: '10:00 a.m.', value: '10:00'},
        {label: '11:00 a.m.', value: '11:00'},
        {label: '12:00 a.m.', value: '12:00'}
    ];
    public h_end: Array<IOption> = [
        {label: '1:00 p.m.', value: '1:00'},
        {label: '2:00 p.m.', value: '2:00'},
        {label: '3:00 p.m', value: '3:00'},
        {label: '4:00 p.m.', value: '4:00'},
        {label: '5:00 p.m.', value: '5:00'},
        {label: '6:00 p.m.', value: '6:00'},
        {label: '7:00 p.m.', value: '7:00'},
        {label: '8:00 p.m.', value: '8:00'},
        {label: '9:00 p.m.', value: '9:00'},
        {label: '10:00 p.m.', value: '10:00'},
        {label: '11:00 p.m.', value: '11:00'},
        {label: '12:00 p.m.', value: '12:00'}
    ];
    public hours = [];
    private subjectSearch: Subject<string> = new Subject();
    @ViewChild('fileInputLogo') public fileInputLogo: ElementRef;


    constructor(private route: ActivatedRoute,
                private fb: FormBuilder,
                private activeRoute: ActivatedRoute,
                private dataService: DataService,) {
        this.activeRoute.params.subscribe(params => {
            this.academyId = params['id'];
        });
        console.log('this.academyId ', this.academyId);
    }

    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.buildForm();
        this.getAcademy(this.academyId);
        this.getManagers(this.academyId);
        this.baseUrl = ConfigService.URL_SERVER;

        this.subjectSearch.debounceTime(100)
            .subscribe((searchValue) => {
                this.searchManagers(searchValue);
            });
    }

    public ngOnDestroy() {
    }

    public buildForm() {
        this.formSettings = this.fb.group({
            status_public: [''],
            name: ['', Validators.required],
            location: ['', Validators.required],
            latitude: [''],
            longitude: [''],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            information: ['']
        })
    }

    public getAcademy(id: number) {
        this.dataService.getResponse(`/academies/${id}?include=academy_works`)
            .subscribe((res) => {
                this.setValues(res);
                this.hours = res.academy_works;
            })
    }

    public removeHours(id: number) {
        this.dataService.delResponse(`/academy_works/${id}`)
            .subscribe((res) => {
                if (res.status == true) {
                    this.hours = this.hours.filter((el) => {
                        return el.id != id;
                    });
                }
            })
    }

    public addHour(day, start, end) {
        const body = {
            academy_id: this.academyId,
            day: day,
            start: start,
            end: end
        };
        this.dataService.postResponse(`/academy_works`, body)
            .subscribe((res) => {
                if (res.status == true) {
                    this.hours.push(res.data)
                }
            })
    }

    public setValues(res) {
        this.academy = res;
        this.urlLogo = res.photo;
        this.activeProfile = !!res.status_public;
        this.formSettings.controls['status_public'].setValue(this.activeProfile);
        this.formSettings.controls['name'].setValue(res.name);
        this.formSettings.controls['email'].setValue(res.email);
        this.formSettings.controls['phone'].setValue(res.phone);
        this.formSettings.controls['location'].setValue(res.location);
        this.formSettings.controls['latitude'].setValue(res.latitude);
        this.formSettings.controls['longitude'].setValue(res.longitude);
        this.locationInputSettings.inputString = res.location;
        this.locationInputSettings = Object.assign({}, this.locationInputSettings);
        this.formSettings.controls['information'].setValue(res.information);
    }

    public getManagers(id: number) {
        this.dataService.getResponse(`/managers/users/${id}`)
            .subscribe((res) => {
                this.managers = res.data;
            });
    }

    public addManager(item) {
        const body = {
            'user_id': item.id,
            'academy_id': this.academyId
        };
        this.dataService.postResponse(`/managers/add/`, body)
            .subscribe((res) => {
                const result = this.managers.indexOf(item);
                if (result == -1) {
                    this.managers.unshift(item);
                }
                this.managersDropDownIsActive = false;
            });
    }

    public removeManager(item) {
        console.log(item);
        const body = {
            'user_id': item.id,
            'academy_id': this.academyId
        };

        this.dataService.postResponse(`/managers/remove`, body)
            .subscribe((res) => {
                console.log(res);
                this.managers = this.managers.filter((el) => {
                    return el.id !== item.id;
                });
            });
    }

    public onSearch(value) {
        this.subjectSearch.next(value);
        this.managersDropDownIsActive = true;
    }

    public searchManagers(value: string) {
        this.dataService.getResponse(`/users?filter[full_name][like]=%${value}%`)
            .subscribe((res) => {
                this.listSearch = this.removeAlreadyManagers(res.data);
            })
    }

    removeAlreadyManagers(users) {
        return users.filter(user => {
            let notManager = true;
            this.managers.forEach(manager => {
                if (isEqual(manager.id, user.id)) {
                    notManager = false;
                }
            });
            return notManager;
        });
    }

    public onCloseSearch() {
        this.listSearch = [];
        this.managerInput = '';
        this.managersDropDownIsActive = false;
    }

    public autoCompleteCallback(selectedData: any) {
        if (selectedData.data) {
            const location = selectedData.data.geometry.location;
            this.locationInputSettings.inputString = selectedData.data.formatted_address;
            this.locationInputSettings = Object.assign({}, this.locationInputSettings);
            this.formSettings.controls['latitude'].setValue(location.lat);
            this.formSettings.controls['longitude'].setValue(location.lng);
        }
    }

    public onUpdateForm(form) {
        const body = form.value;
        body.location = this.locationInputSettings.inputString;
        if (this.newLogoInBase64()) {
            body.photo_base = this.urlLogo;
        }
        this.updateAcademy(body);
    }

    newLogoInBase64 = () => this.urlLogo.length > 1000;

    private updateAcademy(body) {
        this.dataService.putResponse(`/academies/${this.academyId}`, body, true)
            .subscribe((res) => {
                this.setValues(res);
                this.savedRecently = true;
                setTimeout(() => this.savedRecently = false, 4000);
            });
    }

    public toggleProfile() {
        this.dataService.putResponse(`/academies/${this.academyId}`, {status_public: this.activeProfile ? 1 : 0});
        this.activeProfile = !this.activeProfile;
    }


    public toggleManagersDropDown(event) {
        this.managersDropDownIsActive = false;
    }

    public setAvatar($event) {
        this.urlLogo = $event;
    }

}
