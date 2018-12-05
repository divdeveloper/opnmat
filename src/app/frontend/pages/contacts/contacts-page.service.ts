import { Injectable } from '@angular/core';
import { DataService } from '../../../services/data.service';

@Injectable()
export class ContactsPageService {
    constructor(public dataService: DataService) {
    }

    public getMe(){
        return this.dataService.getMe();
    }

}
