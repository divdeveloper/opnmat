import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    ElementRef,
    SimpleChange,
} from '@angular/core';

import {
    CookieService,
} from 'ngx-cookie-service';

import {
    Select2TemplateFunction,
    Select2OptionData,
} from 'ng2-select2';

import {
    DatepickerOptions,
} from '../../../../../../components/ng-datepicker';

import {
    ClolorsBelt,
    Belts,
} from '../../../../../../components/belts';

import {
    TooltipModule,
} from 'ng2-tooltip';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
    AbstractControl,
} from '@angular/forms';

import {
    Router, ActivatedRoute,
} from '@angular/router';

import {
    Title,
} from '@angular/platform-browser';

import {
    ToastsManager,
} from 'ng2-toastr/ng2-toastr';

import {Observable} from 'rxjs/Observable';

import {
    AuthService,
} from '../../../../../services/auth/auth.service';
import {
    AcademiesService,
} from '../../../../../services/academies.service';

import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import {DataService} from '../../../../../services/data.service';
import {ConfigService} from '../../../../../services/service.config';
import {SocketService} from '../../../../../services/socket.service';

import {indexOf, split} from 'lodash';
import {NotificationsService} from '../../../../../services/notifications.service';

// import { CropLogoPhotoComponent } from '../../../components/crop-logo-photo/crop-logo-photo.component';

@Component({
    selector: 'opn-right-sidebar',
    templateUrl: './right-sidebar.component.html',
    styleUrls: ['./right-sidebar.component.scss'],
    providers: [AcademiesService, NotificationsService],
})
export class RightSidebarComponent implements OnInit, OnChanges {
    public itemsSearchActive: boolean = false;
    public academiesSearch = [];
    public usersSearch = [];
    public eventsSearch = [];
    public baseUrl;
    public defaultUserIcon = '/assets/images/user-dafault.png';
    public defaultAcademyIcon = 'assets/images/academy-logo-transparent.png';
    public today = new Date();
    public notificationSound = new Audio('assets/sounds/definite.mp3');
    public emptySearch: any = true;
    public isLoading: boolean = false;
    public subjectSearch: Subject<string> = new Subject();
    public subjectNewMessage: Subject<string> = new Subject();
    public title = 'Registration';
    public belts: Array<Select2OptionData>;
    public academies: Array<Select2OptionData>;
    public weights: Array<Select2OptionData>;
    public optionsBelt: Select2Options;
    public optionsAcademy: Select2Options;
    public optionsWeight: Select2Options;
    public newMessage: boolean = false;
    public openChat: boolean = false;
    public openAcademyChat: boolean = false;
    public dialogs = [];
    public messages = [];
    public myId;
    public isMessages: any;
    public dialogActive;
    public activeDialog;
    public listSearch: Array<any> = [];
    public typeUser = 'user';
    public academyId;
    private selected = {};
    private subjectSearchChat: Subject<string> = new Subject();
    private subjectSearchAcademyChat: Subject<string> = new Subject();
    @ViewChild('searchChat') public inputSearchChat: ElementRef;
    @ViewChild('search') public search: ElementRef;

    public birthDay: Date;
    public dateOptions: DatepickerOptions;
    public form: FormGroup;
    public chatType = 'user';
    private belt: any = '0';
    private academy: any;
    private academyName: String;
    private weight: any;
    private validErrAcademy: Boolean;

    colorsBelt: Array<ClolorsBelt>;
    arrBelts: Array<Belts>;

    private weightCurrent: any;
    private latitude: any;
    private longitude: any;
    private addres: any = '';
    private short_address: any = '';
    private profile: Boolean = false;

    private currentBelt: any;
    private currentAcademy: any;
    private userAvatar: any;

    private avatarFile: any;
    private changeEmail: Boolean = false;
    private changePassword: Boolean = false;
    private status_public: Boolean;

    private gaAutocompleteStings: any = {
        showSearchButton: false,
        currentLocIconUrl: 'https://cdn4.iconfinder.com/data/icons/proglyphs-traveling/512/Current_Location-512.png',
        locationIconUrl: 'http://www.myiconfinder.com/uploads/iconsets/369f997cef4f440c5394ed2ae6f8eecd.png',
        recentStorageName: 'componentData4',
        noOfRecentSearchSave: 8,
        geoTypes: ['address'],
        inputPlaceholderText: '',
        inputString: '',
    };

    private firstLogin: Boolean = false;
    private modalAcademy = false;
    private myAcademies: Array<any> = [];
    private me: any;
    private allSaved: Boolean = false;
    private changeAddres: Boolean = true;
    private addresEmpty: Boolean = false;
    private ageType: String = 'junior';

    @Input() isManager?: any;

    // @ViewChild('cropAvatar', undefined) cropAvatar: CropLogoPhotoComponent;

    constructor(private _cookieService: CookieService,
                private formBuilder: FormBuilder,
                private authService: AuthService,
                private serviceAcademy: AcademiesService,
                private titleService: Title,
                private router: Router,
                private route: ActivatedRoute,
                private toastr: ToastsManager,
                private dataService: DataService,
                private configService: ConfigService,
                private socketService: SocketService,
                private notificationsService: NotificationsService) {
        this.validErrAcademy = false;
        this.me = this.serviceAcademy.getMe();
        this.subjectSearchChat.debounceTime(500)
            .subscribe((searchValue) => {
                this.searchChatUsers(searchValue);
            });
        this.subjectSearchAcademyChat.debounceTime(500)
            .subscribe((searchValue) => {
                this.searchChatAcademy(searchValue);
            });
        this.subjectNewMessage.subscribe((dialog) => {
            this.openMessage(dialog)
        });
        this.getDialogs();
        this.socketService.onGetMessages()
            .subscribe((data) => {
                if (!data.academy_id) {
                    if (data.user.id == this.me.id) {
                        this.notificationSound.play();
                        this.newMessage = true;
                        this.dataService.eventMessage.emit({
                            type: 'user',
                            user_id: data.user_sender.id,
                        })
                    }
                    let element = this.dialogs.find((el) => {
                        return el.id == data.conversation_id;
                    });
                    const index = this.dialogs.indexOf(element);
                    let newDialog;
                    if (index !== -1) {
                        if (this.dialogs[index].last_message) {
                            this.dialogs[index].last_message.content = data.content;
                        }
                        newDialog = this.dialogs[index];
                        this.dialogs = this.dialogs.filter((el) => {
                            return el.id != data.conversation_id;
                        });
                        this.dialogs.unshift(newDialog);
                    } else {
                        if (data.user.id == this.me.id) {
                            this.dialogs.unshift(data);
                            // this.onChangeDialog(data);
                        }
                    }
                }
            }, (error) => {
                console.log('Error', error);
            });
        this.dataService.eventMessage.debounceTime(500)
            .subscribe((event) => {
                // this.dataService.getResponse(`/managers?filter[academy_id]=${event.academy_id}&filter[user_id]=${this.me.id}`).toPromise()
                //     .then((res) => {
                //         console.log(event);
                //         if(res.data.length){
                //             this.typeUser = 'manager';
                //         }
                //         this.chatType = event.type;
                //         this.academyId = event.academy_id;
                //         this.toggleAcademyChat(event.academy_id);
                //     }, (err)=> {
                //         console.log(err);
                //         this.isLoading = false;
                //     });
                this.chatType = event.type;
                if (event.type === 'academy') {
                    this.toAcademyMessages(event.user_id, event.academy_id);
                } else {
                    this.toMessages(event.user_id);
                }
                this.openChat = true;
            });
    }

    public openItemsSearch(){
        this.itemsSearchActive = true;
        document.body.classList.add('openModal');
        setTimeout(()=>this.search.nativeElement.focus());
    }

    public closeItemsSearch(){
        this.itemsSearchActive = false;
        document.body.classList.remove('openModal');
        this.academiesSearch = [];
        this.eventsSearch = [];
        this.usersSearch = [];
    }

    public resetChat() {
        this.listSearch = [];
        this.messages = [];
        this.dialogs = [];
    }

    public toggleAcademyChat(id?) {
        this.openChat = false;
        this.resetChat();
        if (this.openAcademyChat) {
            this.closeAcademyMessage();
        } else {
            this.getAcademyDialogs(id);
        }
        this.openAcademyChat = !this.openAcademyChat;
    }

    public toggleChat() {
        this.openAcademyChat = false;
        this.resetChat();
        if (this.openChat) {
            this.closeMessage();
        } else {
            this.getDialogs();
        }
        this.openChat = !this.openChat;
    }

    public onSearchChat(value: string) {
        this.subjectSearchChat.next(value);
    }

    public onSearchAcademyChat(value: string) {
        this.subjectSearchAcademyChat.next(value);
    }

    public searchChatUsers(value: string) {
        if (value.trim()) {
            const url = `/users?page[number]=1&page[size]=10000&filter[id][not]=${this.me.id}&filter[full_name][like]=%${value.trim()}%`;
            this.dataService.getResponse(url).toPromise()
                .then((res) => {
                    this.listSearch = res.data;
                }, (err) => {
                    console.log(err);
                })
        } else {
            this.listSearch = [];
        }
    }

    public searchChatAcademy(value: string) {
        const data = value.trim();
        if (value.trim()) {
            console.log('search by', this.chatType);
            let url;
            if (this.chatType == 'user') {
                url = `/academies?page[number]=1&page[size]=10000&filter[name][like]=%${data}%`;
            } else {
                url = `/users?page[number]=1&page[size]=10000&filter[full_name][like]=%${data}%`;
            }
            this.dataService.getResponse(url).toPromise()
                .then((res) => {
                    console.log(res);
                    this.listSearch = res.data;
                }, (err) => {
                    console.log(err);
                })
        } else {
            this.listSearch = [];
        }
    }

    public closeSearch() {
        this.listSearch = [];
        this.inputSearchChat.nativeElement.value = '';
    }

    public getAcademyDialogs(id?) {
        console.log('this.academyId-----', this.academyId);
        this.isLoading = true;
        let url = `/conversations?page[number]=1&page[size]=10000&sort=-updated_at&include=users.user,academy&filter[academy_id]=${this.academyId}`;
        console.log(url);
        // if (this.typeUser == 'manager') {
        //     url = url + `,academy&filter[academy_id]=${id}`
        // }
        // if (this.typeChat == 'user') {
        //     url = url + `,academy&filter[type]=academy%`;
        // }
        this.dataService.getResponse(url).toPromise()
            .then((res) => {
                console.log(res);
                this.dialogs = res.data;
                this.isLoading = false;
            }, (err) => {
                console.log(err);
            })
    }

    public getDialogs() {
        if (!this.isLoading) {
            this.isLoading = true;
            this.dataService.getResponse(`/conversations?page[number]=1&page[size]=10000&include=users.user,academy&sort=-updated_at`).toPromise()
                .then((res) => {
                    this.dialogs = res.data;
                    this.isLoading = false;
                }, (err) => {
                    console.log(err);
                })
        }
    }

    public toMessages(userId) {
        const url = `/conversations/by_user`;
        let data = {
            'user_id': userId
        };
        // if (this.typeUser == 'user' && this.typeChat == 'user') {
        //     data['user_id'] = user.id;
        // }
        // if (this.typeUser == 'manager' && this.typeChat == 'manager') {
        //     data['academy_id'] = this.chatAcademyId;
        //     url = `/conversations/academy/by_user`;
        // }
        // this.inputSearchChat.nativeElement.value = '';
        this.dataService.postResponse(url, data).toPromise()
            .then((res) => {
                console.log(res);
                this.openMessage(res);
            }, (err) => {
                console.log(err);
            });
    }

    public openMessage(dialog) {
        this.activeDialog = dialog;
        this.listSearch = [];
        this.isMessages = true;
        this.newMessage = false;
    }

    public closeMessage() {
        this.isMessages = false;
        this.dialogs = [];
        this.getDialogs();

    }

    private toAcademyMessages(userId, academyId) {
        const url = `/conversations/academy/by_user`;
        let data = {
            'user_id': userId,
            'academy_id': academyId,
        };
        console.log(data);
        this.dataService.postResponse(url, data).toPromise()
            .then((res) => {
                console.log(res);
                this.openAcademyMessage(res);
            }, (err) => {
                console.log(err);
            });
    }

    public openAcademyMessage(dialog) {
        this.activeDialog = dialog;
        this.listSearch = [];
        this.isMessages = true;
        this.newMessage = false;
    }

    public closeAcademyMessage() {
        this.isMessages = false;
        this.dialogs = [];
        this.getAcademyDialogs();
    }

    selectPrivate(event) {
        this.status_public = event;
    }

    searchinputCallback(e) {
        this.addres = e.target.value;
        this.changeAddres = false;
        if(this.addres != ''){
            this.addresEmpty = false;
        }
    }

    autoCompleteCallback1(event) {
        if (event.data) {
            this.changeAddres = true;
            this.setShortAddres(event.data);
            this.addres = event.data.formatted_address;
            const location = event.data.geometry.location;
            this.latitude = location.lat;
            this.longitude = location.lng;
        }else {
            this.changeAddres = false;
        }
    }

    setShortAddres(data) {
        data.address_components.forEach(el => {
            if (indexOf(['locality', 'administrative_area_level_1', 'postal_code'], el.types[0]) >= 0) {
                this.short_address += this.formatAddress(this.short_address, el.short_name);
            }
        });
        this.changeAddres = true;
    }

    formatAddress(short_address, short_name): String {
        return (short_address == '') ? short_name : `, ${short_name}`;
    }

    private onClickOverlay() {
        /*this.closeModal();*/
    }

    openProfile() {
        this.modalOpen();
    }

    // InputChangeAvatar(e) {
    //   const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    //   this.avatarFile = file;
    //   const reader = new FileReader();
    //   reader.onload = this._ReaderLoadedPhoto.bind(this);

    //   reader.readAsDataURL(file);

    // }

    setAvatar(foto) {
        this.userAvatar = foto;
        this.avatarFile = foto;
    }

    // saveAvatar(): Observable<any> {
    //   const formData = new FormData();
    //   formData.append('avatar_base', this.avatarFile, this.avatarFile.name);

    //   return this.authService.editProfile(formData);
    // }

    private modalOpen() {
        this.profile = true;
        this.form = this.formBuilder.group({
            firstName: [null, [Validators.required]],
            lastName: [null, Validators.required],
            weight: [null, Validators.required],
            email: [{value: null}, [Validators.email, Validators.required]],
            password: [{value: null}, [Validators.pattern('((?=.*[0-9])(?=.*[a-zA-Z]).{8,50})'), Validators.required]],
        });
        document.body.classList.add('openModal');
        this.firstLogin = true;
        this.serviceAcademy.getUserMe().subscribe(res => {
            this.currentBelt = res.belt;
            this.status_public = res.status_public;
            this.form.patchValue({
                firstName: res.first_name,
                lastName: res.last_name,
                weight: res.weight,
                email: res.email,
                password: '1111111a',
            });
            if (res.address != '') {
                this.addres = (res.address) ? res.address : '';
            }

            this.gaAutocompleteStings.inputString = (res.address) ? res.address : '';
            this.weightCurrent = res.weight;
            this.birthDay = new Date(res.date);
            this.authService.getBeltStipiesBycolorId(res.belt.belt_color.id).subscribe(belts => {
                this.arrBelts = belts;
            });
            this.currentAcademy = {
                id: res.academy.id,
                text: res.academy.name,
            };
            this.setAcademy(this.currentAcademy);
            this.userAvatar = res.avatar;
        });
    }

    private closeModal() {
        document.body.classList.remove('openModal');
        this.profile = false;
        this.firstLogin = false;
    }

    ngOnInit() {
        if (!this._cookieService.get('first_login')) {
            this.modalOpen();
        }
        this.baseUrl = ConfigService.URL_SERVER;
        this.authService.getBeltColors(`all,${this.ageType}`).subscribe(res => {
            this.colorsBelt = res;
        });

        this.dateOptions = {
            minYear: 1970,
            maxYear: 2080,
            displayFormat: 'M[/] D[/] YYYY',
            barTitleFormat: 'MMMM YYYY',
            firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
        };

        this.weights = [{
            id: '0',
            text: 'Weight',
        }];

        for (let i = 1; i <= 250; i++) {
            this.weights.push({
                id: `${i}`,
                text: `${i}`,
            });
        }

        this.optionsBelt = {
            templateResult: this.templateResult,
            templateSelection: this.templateSelection,
            minimumResultsForSearch: -1,
        };

        this.optionsAcademy = {
            minimumResultsForSearch: 1,
            dropdownCssClass: 'academy-dropdown',
            placeholder: {
                id: '0', // the value of the option
                text: 'Academy',
            },
        };

        // this.optionsWeight = {
        //   minimumResultsForSearch: 1,
        //   dropdownCssClass: 'academy-dropdown',
        //   placeholder: {
        //     id: '0', // the value of the option
        //     text: 'Weight',
        //   },
        // };
        this.serviceAcademy.getManagerAcademies(this.me.id).toPromise().then(res => {
            this.myAcademies = res;
        });


        this.subjectSearch.debounceTime(500)
            .subscribe((searchValue) => {
                this.onSearchItems(searchValue.trim());
            });

        this.notificationsService.getUnreadMessages(this.me.id)
            .subscribe(res => {
                this.newMessage = res.count > 0;
            })
    }

    onChangeAge(e) {
        this.authService.getBeltColors(`all,${e.value}`).subscribe(res => {
            this.colorsBelt = res;
            this.authService.getBeltStipiesBycolorId(res[0].id).subscribe(belts => {
                this.arrBelts = belts;
                this.belt = belts[0].id;
            });
        });
    }

    public toItem(type: string, id?: number) {
        let url;
        switch (type) {
            case 'academy': {
                if (id) {
                    url = '/academiy-datail';
                } else {
                    url = '/academy';
                }
                break;
            }
            case 'activity': {
                url = '/activity';
                break;
            }
            case 'user': {
                if (id) {
                    url = '/profile';
                } else {
                    url = '/users';
                }
                break;
            }
        }
        if (id) {
            url = `${url}/${id}`;
        } else {
            url = `/search/${url}`
        }
        this.router.navigate([`/redirect`], {
            queryParams: {
                url: url
            }
        });
        document.body.classList.remove('openModal');
    }

    public getDate(date) {
        const a = new Date(date).getTime();
        const b = this.today.getTime();
        return Math.round((a - b) / (1000 * 60 * 60 * 24));
    }

    public onSearchItems(value) {
        if (value) {
            this.isLoading = true;
            this.dataService.postResponse(`/app/search_academy_event_user`, {
                search: value,
                academy: {
                    filter: {
                        status_public: 1
                    }
                }
            }).subscribe((res) => {
                this.academiesSearch = res.academies;
                this.usersSearch = res.users;
                this.eventsSearch = res.events;
                this.emptySearch = this.academiesSearch.length || this.usersSearch.length || this.eventsSearch.length;
                this.isLoading = false;
            });
        }
    }

    public onSearch(value: string) {
        this.subjectSearch.next(value);
    }

    private getAge(dateString): String {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age}`;
    }

    // function for result template
    public templateResult: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
        if (!state.id) {
            return state.text;
        }
        let image = '<span class="image"></span>';
        if (state.additional.image) {
            image = '<span class="image select-belt"><img src="' + state.additional.image + '"/></span>';
        }
        return jQuery(image);
    }

    // function for selection template
    public templateSelection: Select2TemplateFunction = (state: Select2OptionData): JQuery | string => {
        let image = '<span class="image"></span>';
        if (!state.id) {
            return state.text;
        }
        if (state.additional.image) {
            image = '<span class="image select-belt"><img src="' + state.additional.image + '"/></span>';
        }
        return jQuery(image);
    }

    public changeBelt = function ($e) {
        this.belt = $e.value;
    };

    public setAcademy = function (academy) {
        this.academy = academy.id;
        this.academyName = academy.text;
        this.validErrAcademy = false;
    };

    public changeWeight = function ($e) {
        this.weight = $e.value;
    };

    public changeBeltColor = function (id) {
        this.belt = id;
    };

    isFieldValid(field: string) {
        return !this.form.get(field).valid && this.form.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
        };
    }

    onChangeEmail(event) {
        this.form.controls['email'].reset(
            {value: '', disabled: false},
        );
        event.toElement.style.display = 'none';
        this.changeEmail = true;
    }

    onChangePassword(event) {
        this.form.controls['password'].reset(
            {value: '', disabled: false},
        );
        event.toElement.style.display = 'none';
        this.changePassword = true;
    }

    onSkip() {
        if (this.addres != '') {
            this.closeModal();
            this._cookieService.set('first_login', 'true');
        }else {
            this.addresEmpty = true;
        }
    }

    saveSettings(form) {
        // const [day, month, year] = split(this.form.get('birthDay').value, '/');
        const settings = {
            academy_name: this.academyName,
            user: {
                first_name: form.get('firstName').value,
                last_name: form.get('lastName').value,
                belt_id: `${this.belt}`,
                academy_id: this.academy,
                address: this.addres,
                short_address: this.short_address,
                longitude: this.longitude,
                latitude: this.latitude,
                weight: form.get('weight').value,
                date: this.birthDay,
                status_public: this.status_public,
            },
            avatar_base: this.avatarFile,
        };
        if (this.changeEmail) {
            settings.user['email'] = form.get('email').value;
        }

        if (this.changePassword) {
            settings.user['password'] = form.get('password').value;
        }



        this.authService.editProfile(settings).subscribe(profile => {
                if (profile) {
                    this.allSaved = true;
                    this._cookieService.set('first_login', 'true');
                    window.location.reload();
                }
            },
            err => {
                const errore = JSON.parse(err._body).errors;
                const self = this;
                errore.forEach(function (el, i, arr) {
                    if (el.status == '400') {
                        self.toastr.custom(el.description, 'Warning!');
                    }
                });
            });
    }

    onSubmit() {
        if (this.form.valid && !this.validErrAcademy) {
            // if (this.avatarFile) {
            //   this.saveAvatar().subscribe(res => {
            //     this.saveSettings(this.form);
            //   },
            //   err => {
            //     const errore = JSON.parse(err._body).errors;
            //     const self = this;
            //     errore.forEach(function (el, i, arr) {
            //       if (el.status == '400') {
            //         self.toastr.custom(el.description, 'Warning!');
            //       }
            //     });
            //   });
            // }else {
            this.saveSettings(this.form);
            // }
        } else {
            this.validateAllFormFields(this.form);
        }
        if (this.academy == undefined) {
            this.validErrAcademy = true;
        }
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({
                    onlySelf: true,
                });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        const manager: SimpleChange = changes.isManager;
        if (manager && manager.currentValue) {
            this.isManager = manager;
        }
    }

    onChangeColor(e) {
        this.authService.getBeltStipiesBycolorId(e).subscribe(res => {
            this.arrBelts = res;
        });
    }

    onCreateAcademy() {
        this.modalAcademy = true;
    }

    onCloseodalAcademy() {
        this.modalAcademy = false;
    }

    onAcademyAdd(academy) {
        this.myAcademies.unshift(academy);
    }

    public getActivityAvatar(activityType: string) {
        switch (activityType) {
            case 'seminar':
                return '/assets/images/icons/calendar-icon.png';
            case 'mat_event':
                return '/assets/images/icons/mat_event-icon.png';
            case 'others':
                return '/assets/images/icons/others-icon.png';
        }
    }
}
