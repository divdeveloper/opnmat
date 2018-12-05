import {
    Component,
    OnInit,
    NgZone,
    ElementRef,
    ViewChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    HostListener,
} from '@angular/core';
import {
    FormControl,
} from '@angular/forms';
import {
    IOption,
} from 'ng-select';
import {
    Title,
} from '@angular/platform-browser';
import {
    ActivatedRoute,
    Router,
} from '@angular/router';
import {
    MapsAPILoader,
    GoogleMapsAPIWrapper,
    AgmMap,
} from '@agm/core';
import {} from 'googlemaps';
import {
    NgbDateStruct,
    NgbCalendar,
} from '@ng-bootstrap/ng-bootstrap';
import {
    SearchPageService,
} from '../search-page.service';
import {
    ConfigService,
} from '../../../../services/service.config';
import {
    format,
    addDays,
    differenceInMinutes,
} from 'date-fns';
import {
    MAP_STYLES,
} from './map-style';
import {
    PaymentStripeComponent,
} from '../../../../../components/payment-stripe/payment-stripe.component';
import { ModalService } from '../../components/modal/modal.service';
import { ActivitiesService } from '../../../../services/activity.service';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
    one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day ?
    false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day ?
    false : one.day > two.day : one.month > two.month : one.year > two.year;
import * as _ from 'lodash';
import {
    UsersService,
} from '../../../../services/users.service';

@Component({
    selector: 'app-search-activity',
    templateUrl: './search-activity.component.html',
    styleUrls: ['./search-activity.component.scss', '../../@theme/scss/theme.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush
    providers: [ActivitiesService],
})
export class SearchActivityComponent implements OnInit {
    public myInfo;
    public typesOptions: Array < any > = [{
            itemName: 'Event',
            id: 'mat_event',
        },
        {
            itemName: 'Seminar',
            id: 'seminar',
        },
        {
            itemName: 'Class',
            id: 'class',
        },
        {
            itemName: 'Others',
            id: 'others',
        },
    ];
    public teachers: Array < IOption > = [];
    public selectedTeachers = [];
    public joined = [];
    public activeSlider: Boolean = false;
    public sliderOptions = {
        length: 230,
        color: '#4ca1ff',
        emptyColor: '#c5cacf',
        thumbColor: '#4ca1ff',
        thumbSize: 10,
        lineWidth: 2,
        toggleDisableText: 'disable',
        minValue: 1,
        maxValue: 500,
        initialValue: 50,
    };

    public priceOptions = [{
            itemName: 'Free',
            id: 'free',
        },
        {
            itemName: 'Paid',
            id: 'fee',
        },
    ];

    typesSelectSettings = {
        text: 'Activity',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: false,
        badgeShowLimit: 0,
        classes: 'myclass custom-class-search',
    };

    priceSelectSettings = {
        text: 'Price',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: false,
        badgeShowLimit: 0,
        classes: 'myclass custom-class-search',
    };

    teacherSelectSettings = {
        text: 'Teacher',
        primaryKey: 'teacher_id',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        badgeShowLimit: 1,
        classes: 'myclass custom-class-search',
    };

    public isLoading: Boolean = false;
    public baseUrl;
    public urlLogo = 'assets/images/no-image-wh.png';
    public noImg = 'assets/images/user-dafault.png';
    public myLng;
    public myLat;
    public today = new Date();

    // map
    public lat: Number = 49.835742;
    public lng: Number = 24.016093;
    public radiusValue = 0;
    public newRadius = this.sliderOptions.initialValue;
    public mapStyles = MAP_STYLES;
    public activities = [];
    public zoom = 6;
    public view = 'map';
    public myLoc;
    public location;
    public limit = 10000;

    public showWeekNumbers = false;
    public hoveredDate: NgbDateStruct;
    public fromDate: NgbDateStruct;
    public toDate: NgbDateStruct;
    public selectedDays: string;
    public displayMonths = 2;

    // list
    public isLoadingNew: Boolean = false;
    public total = 0;
    public allItems: Boolean = false;
    public requestOptions: {
        url: any,
        includes: any,
        skip: any,
        limit: any,
        search: any,
        sort: {
            type: any,
            field: any,
        },
        distance: any,
        location: {
            lat: any,
            lng: any,
        },
        teachers: any[],
        types: any[],
        filter: {
            type: any,
            value: any,
        },
        price: any[],
        date: {
            start: any,
            end: any,
        },
    };

    public searchControl: FormControl;
    @ViewChild('searchLocation') public searchElementRef: ElementRef;
    @ViewChild('myCanvas') public myCanvasRef: ElementRef;
    @ViewChild('myImg') public myImgRef: ElementRef;
    @ViewChild('map') public map: AgmMap;
    @ViewChild('datePicker') public datePicker;

    @ViewChild(PaymentStripeComponent)
    public paymentStripe: PaymentStripeComponent;

    private typesTitle: Object = {
        'class': 'Class',
        'seminar': 'Seminar',
        'mat_event': 'Opn Mat',
        'others': 'Others',
    };

    @HostListener('document:mouseup', ['$event'])
    onMouseUp() {
        if (this.activeSlider) {
            this.activeSlider = false;
        }
    }

    private userSabscriptions: any[] = [];
    private modalAlert: any = '';
    private activityTmp: any;
    private listActivities: any = [];
    private listTypes: any = [];
    private meAddress: String = '';
    private searchName: String = '';

    canvas: any = [];
    src: any = '/assets/images/icons/icon-marker-activity.png';
    constructor(public gMaps: GoogleMapsAPIWrapper,
        private titleService: Title,
        public calendar: NgbCalendar,
        public mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private usersService: UsersService,
        private searchPageService: SearchPageService,
        private cd: ChangeDetectorRef,
        private route: ActivatedRoute,
        private modalSrv: ModalService,
        private activityService: ActivitiesService,
        private router: Router) {
        this.titleService.setTitle('Events Near Me');
        this.radiusValue = this.getMeters(this.sliderOptions.initialValue);
        this.fromDate = calendar.getToday();
        this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
        this.selectedDays = `${this.fromDate.day}.${this.fromDate.month}.${this.fromDate.year}-${this.toDate.day}.${this.toDate.month}.${this.toDate.year}`;
        this.requestOptions = {
            url: 'activities',
            includes: 'teachers,academy,join_activities,subscriptions',
            skip: 1,
            limit: this.limit,
            search: -1,
            sort: {
                type: 1,
                field: 'name',
            },
            distance: 50,
            location: {
                lat: -1,
                lng: -1,
            },
            teachers: [],
            types: [],
            filter: {
                type: -1,
                value: -1,
            },
            price: [],
            date: {
                start: format(new Date(), 'DD.MM.YYYY'),
                end: format(addDays(new Date(), 10), 'DD.MM.YYYY'),
            },
        };
        this.searchName = '';
    }

    ngOnInit() {
        this.searchControl = new FormControl();
        this.baseUrl = ConfigService.URL_SERVER;
        this.usersService.getUserMe().subscribe(user => {
            this.myInfo = user;
            this.lat = this.myInfo.latitude;
            this.lng = this.myInfo.longitude;
            this.meAddress = this.myInfo.address || this.myInfo.short_address;
        });
        this.getTeachers();
        this.myLoc = this.route.queryParams.subscribe(params => {
            this.location = params['location'];

            if (this.location) {
                this.requestOptions.distance = 50;
                this.radiusValue = this.getMeters(50);
            }
            this.getItems(this.requestOptions);
        });

        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['address'],
            });

            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    this.requestOptions.skip = 1;
                    this.requestOptions.location.lat = -1;
                    this.requestOptions.location.lng = -1;
                    this.requestOptions.distance = 50;
                    if (place.geometry === undefined || place.geometry === null) {
                        this.getItems(this.requestOptions);
                        return;
                    }

                    this.lat = place.geometry.location.lat();
                    this.lng = place.geometry.location.lng();
                    this.zoom = 6;
                    this.requestOptions.location.lat = place.geometry.location.lat();
                    this.requestOptions.location.lng = place.geometry.location.lng();

                    this.getItems(this.requestOptions);
                });
            });
        });
        this.canvas = this.myCanvasRef.nativeElement;
        this.getUserSubscriptions();
    }

    getUserSubscriptions() {
        this.activityService.getUserSubscriptions().subscribe(subscriptions => {
          this.userSabscriptions = subscriptions;
        });
      }

    getMarker(text) {
        const self = this;
        let canvas = this.canvas;
        let context = canvas.getContext('2d');

        let source = this.myImgRef.nativeElement;
        // source.onload = () => {
        canvas.height = source.height + 10;
        canvas.width = source.width + 10;
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.drawImage(source, 0, 5);
        context.lineWidth = 5;
        context.strokeStyle = "#ffffff";
        context.fillStyle = "#f91656";
        context.beginPath();
        context.arc(39, 13, 8, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
        context.fill();

        context.font = "11px Arial";
        context.textAlign = 'center';
        context.fillStyle = 'white';
        const width = context.measureText('99').width;
        const height = context.measureText('99').width;

        context.fillText(text, (source.width + 5) - 8, 17, 16);
        // };
        // source.src = this.src;
        return canvas.toDataURL();
    }

    public getTeachers() {
        this.searchPageService.getTeachers()
            .then((res) => {
                this.teachers = res.data.map((el) => {
                    el.itemName = el.teacher.first_name + ' ' + el.teacher.last_name;
                    return el;
                });
            }, (err) => {
                console.log(err);
            });
    }

    public onSelectedTeacher(option) {
        if (this.requestOptions.includes && this.requestOptions.includes.indexOf('teachers,') === -1) {
            this.requestOptions.includes += 'teachers,';
        }
        this.requestOptions.teachers += option.value != '-1' ? option.value : -1;
        this.getItems(this.requestOptions);
    }

    public onDateChange(date: NgbDateStruct) {
        let start = '',
            end = '';
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
            this.toDate = date;
            let endM = this.toDate.month < 10 ? '0' + this.toDate.month : this.toDate.month;
            let endD = this.toDate.day < 10 ? '0' + this.toDate.day : this.toDate.day;
            end = `${endD}.${endM}.${this.toDate.year}`;
            this.datePicker.close();
        } else {
            this.toDate = null;
            this.fromDate = date;
        }
        let startM = this.fromDate.month < 10 ? '0' + this.fromDate.month : this.fromDate.month;
        let startD = this.fromDate.day < 10 ? '0' + this.fromDate.day : this.fromDate.day;
        start = `${startD}.${startM}.${this.fromDate.year}`;
        this.selectedDays = `${start}-${end}`;
        if (start && end) {
            this.requestOptions.date.start = start;
            this.requestOptions.date.end = end;
            this.getItems(this.requestOptions);
        }
    }

    public isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
    public isInside = date => after(date, this.fromDate) && before(date, this.toDate);
    public isFrom = date => equals(date, this.fromDate);
    public isTo = date => equals(date, this.toDate);

    public onSelectedType(option) {
        this.requestOptions.skip = 1;
        // this.requestOptions.location.lat = -1;
        // this.requestOptions.location.lng = -1;
        // this.requestOptions.distance = -1;
        this.requestOptions.filter.type = 'type';
        this.requestOptions.filter.value = option.value;
        this.getItems(this.requestOptions);
    }

    public toggleView(type: string) {
        this.view = type;
        this.requestOptions.limit = (type == 'list') ? 20 : this.limit;
        this.requestOptions.skip = 1;
        setTimeout(() => {
            this.map.triggerResize();
            this.getItems(this.requestOptions);
        }, 800);
    }

    public resetItems() {
        this.requestOptions = {
            url: 'activities',
            includes: 'teachers,academy,join_activities,subscriptions',
            skip: 1,
            limit: this.view == 'list' ? 20 : this.limit,
            search: -1,
            sort: {
                type: 1,
                field: 'name',
            },
            distance: 50,
            location: {
                lat: -1,
                lng: -1,
            },
            teachers: [],
            types: [],
            filter: {
                type: -1,
                value: -1,
            },
            price: [],
            date: {
                start: -1,
                end: -1,
            },
        };
        this.searchName = '';
        this.selectedDays = '';
        this.getItems(this.requestOptions);
    }

    public getDate(date) {
        const a = new Date(date).getTime();
        const b = this.today.getTime();
        return Math.round((a - b) / (1000 * 60 * 60 * 24));
    }

    public toggleDropDown(event) {
        this.activeSlider = !(event && event['value'] === true);
    }

    public togglePicker() {
        if (this.toDate) {
            this.datePicker.close();
        } else {
            this.datePicker.open();
        }
    }

    public setCurrentPosition() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.myLat = position.coords.latitude;
                this.myLng = position.coords.longitude;
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.gMaps.setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        }
    }

    public onChangeRadius(event) {
        this.newRadius = event;
        this.requestOptions.distance = event;
    }

    public toggleRadius(status) {
        if (status) {
            this.radiusValue = this.getMeters(this.newRadius);
            this.requestOptions.skip = 1;
        } else {
            this.radiusValue = 0;
            this.newRadius = 0;
            // this.requestOptions.distance = -1;
        }
        this.activeSlider = false;
        this.getItems(this.requestOptions);
    }

    public getMeters(i) {
        return Math.floor(i * 1609.344);
    }

    public getItems(options) {
        this.isLoading = true;
        this.activeSlider = false;
        this.searchPageService.getListItems(options)
            .then((res) => {
                const arr = res.data.map(event => {
                    event.isSabscription = _.intersection(this.userSabscriptions, event.subscriptions).length;
                    event.differenceDate = differenceInMinutes(new Date(event.end_date), new Date());
                    event.isMember = _.findIndex(event.join_activities, {user_id: this.searchPageService.getMe().id});
                    event.joinedCount = event.join_activities.length;
                    event.load = false;
                    return event;
                });
                if (this.view == 'list') {
                    this.listActivities = _.groupBy(res.data, 'type');
                    this.listTypes = _.orderBy(_.keys(this.listActivities), ['date'], ['asc']);
                }
                const data = this.mapItems(res.data);
                this.activities = data;
                this.total = res.total;
                this.isLoading = false;
                this.allItems = res.total <= res.data.length + res.skip;
                if (!this.allItems) {
                    this.requestOptions.skip++;
                }
            }, (err) => {
                console.log(err);
                this.isLoading = false;
            });
    }

    public mapItems(arr) {
        const self = this;
        let groups = _.groupBy(arr, function (value) {
            return value.academy_id;
        });

        let data = _.map(groups, function (group: any) {
            return {
                latitude: group[0].latitude,
                longitude: group[0].longitude,
                icon: self.getMarker(group.length),
                events: group,
            };
        });
        return data;
    }

    public loadMoreItems() {
        this.isLoadingNew = true;
        this.searchPageService.getListItems(this.requestOptions)
            .then((res) => {
                // this.activities.push(...res.data);
                this.activities.push(...this.mapItems(res.data));
                if (this.view == 'list') {
                    this.listActivities = _.groupBy(this.activities, 'type');
                    this.listTypes = _.orderBy(_.keys(this.listActivities), ['date'], ['asc']);
                }
                this.isLoadingNew = false;
                this.allItems = res.total <= res.data.length + res.skip;
                if (!this.allItems) {
                    this.requestOptions.skip++;
                }
            }, (err) => {
                console.log(err);
                this.isLoadingNew = false;
            });
    }

    public sortItems(): void {
        if (this.requestOptions.sort.type % 3 !== 0) {
            this.requestOptions.sort.type = this.requestOptions.sort.type + 1;
        } else {
            this.requestOptions.sort.type = 1;
        }
        this.allItems = false;
        this.requestOptions.skip = 1;
        this.getItems(this.requestOptions);
    }

    public searchItems(value: string) {
        const data = value.trim();
        this.requestOptions.search = data.length ? data : -1;
        this.requestOptions.skip = 1;
        this.allItems = false;
        this.getItems(this.requestOptions);
    }

    public searchPrice(value) {
        this.requestOptions.skip = 1;
        this.allItems = false;
        this.requestOptions.price = value ? value : -1;
        this.getItems(this.requestOptions);
    }

    public selectItem(item) {
        this.map.triggerResize();
        if (item.latitude && item.longitude) {
            this.lat = item.latitude;
            this.lng = item.longitude;
            this.zoom = 8;
        }
    }

    onJoin(activity) {
        this.activityTmp = activity;
        activity.load = true;
        if (activity.isSabscription > 0) {
            this.activityService.joinActivity({
                activity_id: activity.id,
            }).subscribe(res => {
                if (res.status) {
                    activity.isMember = 1;
                    activity.joinedCount += 1;
                }
                activity.load = false;
            });
        } else if (activity.payment_status == 'free') {
            this.activityService.joinActivity({
                activity_id: activity.id,
            }).subscribe(res => {
                    if (res.status) {
                        activity.isMember = 1;
                        activity.joinedCount += 1;
                    }
                    activity.load = false;
                    this.modalAlert = `The payment for "${activity.name}" was successful`;
                },
                err => {
                    this.modalAlert = err.description;
                    this.modalSrv.open('join-fail');
                    activity.load = false;
                });
        } else if (activity.payment_status == 'fee') {
            this.paymentStripe.showPayment();
            activity.load = false;
        }
    }

    onRePay() {
        this.paymentStripe.showPayment();
        this.modalSrv.close('payment-fail');
    }
    onPay(token) {
        this.activityTmp.load = true;
        this.activityService.payActivity({
                activity_id: this.activityTmp.id,
                source: token.id,
                type: token.type,
            })
            .finally(() => {
                this.activityTmp.load = false;
            })
            .subscribe(
                res => {
                    if (res.status) {
                        this.activityTmp.isMember = 1;
                        this.activityTmp.joinedCount += 1;
                        this.modalAlert = `The payment for "${this.activityTmp.name}" was successful`;
                        this.modalSrv.open('payment-success');
                    }
                },
                err => {
                    if (err.status == 400) {
                        this.modalAlert = err.description;
                        this.modalSrv.open('payment-fail');
                    }
                });
    }
    toAcademy(academy) {
        this.router.navigate([`/academiy-datail/${academy}`]);
    }
    toActivity(activity_id) {
        this.router.navigate([`/activity/${activity_id}`]);
    }
}
