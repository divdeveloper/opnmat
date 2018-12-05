import { Injectable } from '@angular/core';
import { DataService } from '../../../services/data.service';
import {format} from 'date-fns';

@Injectable()
export class SearchPageService {
    constructor(public dataService: DataService) {
    }

    public getMe(){
        return this.dataService.getMe();
    }

    public getItems(type, academies, skip?, limit?, search?, sort?, includes?, field?, filter?){
        let url = `/${type}?page[number]=${skip}&page[size]=${limit}`;
        field = field ? field : 'name';

        if(search){
            url += `&filter[${field}][like]=%${encodeURI(search)}%`;
        }
        if(filter){
            url += `&${filter}`;
        }
        if(includes){
            url +=`&include=${includes}`;
        }
        if (sort === 2) {
            url += `&sort=-${field}`;
        } else if (sort === 3) {
            url += `&sort=${field}`;
        }
        if (academies.length > 0){
            url += `&filter[academy_id][in]=`;
            academies.forEach((academy, index)=>{
                url+=academy.id;
                if (index < academies.length-1) url+=`,`;
            })
        }
        console.log(url);
        return this.dataService.getResponse(url).toPromise();
    }

    public getListItems(options){
        let url = `/${options.url}?`;

        if(options.skip){
            url += `page[number]=${options.skip}`;
        }
        if(options.limit){
            url += `&page[size]=${options.limit}`;
        }
        if(options.sort.field && options.sort.type){
            if (options.sort.type === 2) {
                url += `&sort=-${options.sort.field}`;
            } else if (options.sort.type === 3) {
                url += `&sort=${options.sort.field}`;
            }
        }
        if(options.distance != -1){
            url +=`&distantion=${options.distance}`;
        }
        if(options.teachers.length > 0){
            const teachers = options.teachers.map(teacher => {
                return teacher.teacher_id;
            });
            url +=`&teacher_ids=${teachers.join(',')}`;
        }
        if(options.types && options.types.length > 0){
            const types = options.types.map(teacher => {
                return teacher.id;
            });
            url +=`&filter[type][in]=${types.join(',')}`;
        }
        if(options.location.lat != -1 && options.location.lng != -1 ){
            url += `&latitude=${options.location.lat}&longitude=${options.location.lng}`;
        }
        if(options.filter && options.filter.type != -1 && options.filter.value != -1){
            url += `&filter[${options.filter.type}]=${options.filter.value}`;
        }

        if(options.price.length > 0){
            let priceArr: Array<any> = [];
            let i = 0;
            while (i < options.price.length) {
                priceArr.push(options.price[i].id);
                i++;
            }
            url += `&filter[payment_status][in]=${priceArr.join(',')}`;
        }
        if(options.includes){
            url +=`&include=${options.includes}`;
        }
        if(options.date && options.date.start != -1 && options.date.end != -1){

            const [start_d, start_m, start_y] = options.date.start.split('.');
            const [end_d, end_m, end_y] = options.date.end.split('.');
            url += `&filter[start_date][gte]=${start_y}-${start_m}-${start_d}&filter[end_date][lte]=${end_y}-${end_m}-${end_d}`;
        }
        if(options.sort.field && options.search != -1){
            console.log(options.search);
            url += `&filter[${options.sort.field}][like]=%${options.search}%`;
        }
        url +=`&filter[status_public]=1`;
        return this.dataService.getResponse(url).toPromise();
    }

    public followUser(id: number, type: string) {
        return this.dataService.postResponse(`/followers/${type}`, {friend_id: id}).toPromise();
    }

    public getTeachers() {
        // return this.dataService.getResponse(`/teachers`).toPromise();
        return this.dataService.getResponse(`/activity_teachers?include=teacher`).toPromise();
    }

    public joinActivity(id: number) {
        return this.dataService.postResponse(`/join_activity`,
            {
                'activity_id': id,
                'user_id': this.getMe().id
            }
        ).toPromise();
    }
}
