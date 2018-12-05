import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SearchPageService } from '../search-page.service';
import { ConfigService } from '../../../../services/service.config';
import {AcademiesService} from '../../../../services/academies.service';

@Component({
    selector: 'app-search-users',
    templateUrl: './search-users.component.html',
    styleUrls: ['./search-users.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [AcademiesService]
})
export class SearchUsersComponent implements OnInit {
    public baseUrl;
    public noImg = '/assets/images/user-dafault.png';
    public isLoading: boolean = false;
    public isLoadingNew: boolean = false;
    public academies = [];
    public users = [];
    public total = 0;
    public skip = 1;
    public limit = 20;
    public search = '';
    public sort = 1;
    public sortField = 'full_name';
    public allItems: boolean = false;
    public requestUrl = 'users';
    public requestIncludes = 'followers,belt_user.belt';
    public myId;
    public selectedAcademies = [];

    academiesSelectSettings = {
        text: 'Academies',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        singleSelection: false,
        enableSearchFilter: true,
        classes: 'academies-multiselect',
        badgeShowLimit: 1,
    };
    constructor(private searchPageService: SearchPageService,
                private academiesService: AcademiesService) {
        this.academiesService.getAcademies().subscribe(res => {
            this.academies = res.data.map((el) => {
                el.itemName = el.name;
                return el;
            });
        });
    }

    ngOnInit() {
        this.myId = this.searchPageService.getMe().id;
        this.baseUrl = ConfigService.URL_SERVER;
        this.getItems(this.requestUrl, this.skip, this.limit, this.search, this.sort, this.requestIncludes, this.sortField);
    }

    public getItems(url, skip, limit, search, sort, includes, sortFiled) {
        this.isLoading = true;
        this.searchPageService.getItems(url, this.selectedAcademies, skip, limit, search, sort, includes, sortFiled)
            .then((res) => {
                console.log(res);
                this.users = res.data;
                this.total = res.total;
                this.skip++;
                this.isLoading = false;
                this.allItems = res.total <=  res.data.length + res.skip;
                this.isLoading = false;
            }, (err) => {
                console.log(err);
                this.isLoading = false;
            })

    }

    public loadMoreItems() {
        this.isLoadingNew = true;
        this.searchPageService.getItems(this.requestUrl, this.selectedAcademies, this.skip, this.limit, this.search, this.sort,
            this.requestIncludes, this.sortField)
            .then((res) => {
                this.skip++;
                this.users.push(...res.data);
                this.isLoadingNew = false;
                this.allItems = res.total <=  res.data.length + res.skip;
            }, (err) => {
                console.log(err);
                this.isLoadingNew = false;
            })
    }

    public sortItems(): void {
        if (this.sort % 3 !== 0) {
            this.sort = this.sort + 1;
        } else {
            this.sort = 1;
        }
        this.allItems = false;
        this.skip = 1;
        this.getItems(this.requestUrl, this.skip, this.limit, this.search, this.sort, this.requestIncludes, this.sortField);
    }

    public searchItems(value: string) {
        this.search = value.trim();
        this.skip = 1;
        this.allItems = false;
        this.getItems(this.requestUrl, this.skip, this.limit, this.search, this.sort, this.requestIncludes, this.sortField);
    }

    public followUser(id: number, type: string){
        this.searchPageService.followUser(id, type)
            .then((res) => {
                console.log(res);
            }, (err) => {
                console.log(err);
            })
    }

    public onAcademySelect(){
        this.skip = 1;
        this.allItems = false;
        this.getItems(this.requestUrl, this.skip, this.limit, this.search, this.sort, this.requestIncludes, this.sortField);
    }
}
