import {Component, OnInit, NgZone, ElementRef, ViewChild} from '@angular/core';
import {MapsAPILoader, GoogleMapsAPIWrapper, AgmMap} from '@agm/core';
import {FormControl} from '@angular/forms';
import {} from 'googlemaps';
import {Router, ActivatedRoute} from '@angular/router';

import {SearchPageService} from '../search-page.service';
import {ConfigService} from '../../../../services/service.config';
import {UsersService} from '../../../../services/users.service';
import {MAP_STYLES} from './search-academy.map-style';

@Component({
    selector: 'app-search-academy',
    templateUrl: './search-academy.component.html',
    styleUrls: ['./search-academy.component.scss'],
    providers: [UsersService]
})
export class SearchAcademyComponent implements OnInit {
    public activeSlider: boolean = false;
    public isInputRadius: boolean = false;
    public currentUser;
    public sliderOptions = {
        length: 170,
        color: '#4ca1ff',
        emptyColor: '#c5cacf',
        thumbColor: '#4ca1ff',
        thumbSize: 10,
        lineWidth: 2,
        toggleDisableText: 'disable',
        minValue: 1,
        maxValue: 80,
        initialValue: 5
    };
    public limit = 10000;

    public isLoading: boolean = false;
    public baseUrl;
    public noImg = 'assets/images/academy-logo-transparent.png';
    public myLng;
    public myLat;

    // map
    public lat: number = 49.835742;
    public lng: number = 24.016093;
    public total = 0;
    public radiusValue = 0;
    public newRadius = this.sliderOptions.initialValue;
    public mapStyles = MAP_STYLES;
    public academies = [];
    public zoom = 6;
    public view = 'map';

    // list
    public isLoadingNew: boolean = false;
    public allItems: boolean = false;

    public searchControl: FormControl;
    @ViewChild('searchLocation') public searchElementRef: ElementRef;
    @ViewChild('map') public map: AgmMap;
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
            lng: any
        },
        teachers: any,
        filter: {
            type: any,
            value: any
        },
        price: any,
        date: {
            start: any,
            end: any
        }
    };

    constructor(private mapsAPILoader: MapsAPILoader,
                private ngZone: NgZone,
                private searchPageService: SearchPageService,
                private router: Router,
                private route: ActivatedRoute,
                public gMaps: GoogleMapsAPIWrapper,
                private usersService: UsersService) {
        this.radiusValue = this.getMeters(this.sliderOptions.initialValue);
        this.requestOptions = {
            url: 'academies',
            includes: 'followers,students',
            skip: 1,
            limit: this.limit,
            search: -1,
            sort: {
                type: 1,
                field: 'name'
            },
            distance: this.radiusValue,
            location: {
                lat: -1,
                lng: -1
            },
            teachers: -1,
            filter: {
                type: -1,
                value: -1
            },
            price: -1,
            date: {
                start: -1,
                end: -1
            }
        };
    }

    ngOnInit() {
        this.searchControl = new FormControl();
        this.baseUrl = ConfigService.URL_SERVER;
        this.usersService.getUserMe().subscribe(user => {
            this.currentUser = user;
            this.searchControl.setValue(this.currentUser.address);
            this.lat = this.currentUser.latitude;
            this.lng = this.currentUser.longitude;
            this.requestOptions.location.lat = this.lat;
            this.requestOptions.location.lng = this.lng;
            this.getItems(this.requestOptions);
        });

        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['address']
            });
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    this.requestOptions.skip = 1;
                    this.requestOptions.location.lat = -1;
                    this.requestOptions.location.lng = -1;
                    this.requestOptions.distance = -1;

                    if (place.geometry === undefined || place.geometry === null) {
                        this.getItems(this.requestOptions);
                        return;
                    }

                    this.lat = place.geometry.location.lat();
                    this.lng = place.geometry.location.lng();
                    this.zoom = 17;
                    this.requestOptions.location.lat = place.geometry.location.lat();
                    this.requestOptions.location.lng = place.geometry.location.lng();

                    this.getItems(this.requestOptions);
                });
            });
        });
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

    public toggleDropDown(event) {
        this.activeSlider = !(event && event['value'] === true);
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
                    lng: position.coords.longitude
                });
                this.searchControl.setValue(this.currentUser.address);
            });
        }
    }

    public signIn(id: number) {
        this.router.navigate([`../../academiy-datail/${id}`]);
    }

    public selectItem(item) {
        this.map.triggerResize();
        if (item.latitude && item.longitude) {
            this.lat = item.latitude;
            this.lng = item.longitude;
            this.zoom = 8;
        }
    }

    public onChangeRadius(event) {
        this.newRadius = event;
        this.requestOptions.distance = event;
    }

    public toggleRadius(status) {
        if (this.view === 'list') {
            if (status) {
                this.radiusValue = this.getMeters(this.newRadius);
                this.requestOptions.skip = 1;
            } else {
                this.radiusValue = 0;
                this.newRadius = 0;
                this.requestOptions.distance = -1;
            }
            this.getItems(this.requestOptions);
        } else {
            if(status){
                this.searchPageService.getListItems(this.requestOptions)
                    .then(res => {
                        this.radiusValue = this.getMeters(this.newRadius);
                        this.total = res.total
                    })
            }else {
                this.radiusValue = 0;
                this.newRadius = 0;
                this.requestOptions.distance = -1;
                this.getItems(this.requestOptions);
            }
        }
    }

    public getMeters(i) {
        return Math.floor(i * 1609.344);
    }

    public getItems(options) {
        this.isLoading = true;
        this.searchPageService.getListItems(options)
            .then((res) => {
                console.log(res);
                this.academies = res.data;
                this.total = res.total;
                this.isLoading = false;
                this.allItems = res.total <= res.data.length + res.skip;
                this.isLoading = false;
                this.activeSlider = false;
                if (!this.allItems) {
                    this.requestOptions.skip++;
                }
            }, (err) => {
                console.log(err);
                this.isLoading = false;
            })

    }

    public loadMoreItems() {
        this.isLoadingNew = true;
        this.searchPageService.getListItems(this.requestOptions)
            .then((res) => {
                this.academies.push(...res.data);
                this.isLoadingNew = false;
                this.allItems = res.total <= res.data.length + res.skip;
                if (!this.allItems) {
                    this.requestOptions.skip++;
                }
                console.log(res);
            }, (err) => {
                console.log(err);
                this.isLoadingNew = false;
            })
    }

    public sortItems(): void {
        if (this.requestOptions.sort.type % 3 !== 0) {
            this.requestOptions.sort.type = this.requestOptions.sort.type + 1;
        } else {
            this.requestOptions.sort.type = 1;
        }
        this.allItems = false;
        this.requestOptions.skip = 1;
        this.requestOptions.distance = -1;
        this.getItems(this.requestOptions);
    }

    public searchItems(value: string) {
        this.requestOptions.search = value.trim();
        this.requestOptions.skip = 1;
        this.requestOptions.distance = -1;
        this.allItems = false;
        this.getItems(this.requestOptions);
    }
}
