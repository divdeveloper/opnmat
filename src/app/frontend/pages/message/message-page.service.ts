import { Injectable } from '@angular/core';
import { DataService } from '../../../services/data.service';

@Injectable()
export class MessagePageService {

  constructor(public dataService: DataService) { }

    public getDialogs() {
      const url = `/conversations?page[number]=1&page[size]=10000&include=users.user&sort=-updated_at`;
        return this.dataService.getResponse(url).toPromise();
    }

    public getMessagesById(id: number, skip: number, limit: number) {
        let url = `/conversations/${id}/messages?include=users.user`;
        url += `&page[number]=${skip}`;
        url += `&page[size]=${limit}`;
        return this.dataService.getResponse(url).toPromise();
    }

    public sendMessage(data) {
        return this.dataService.postResponse(`/conversations/add_message`, data).toPromise();
    }

    public setViewsMessages(id) {
        const data = {
            "conversation_id": id
        };
        return this.dataService.postResponse(`/conversations/views`, data).toPromise();
    }

    public getUsers(value) {
      const url = `/users?page[number]=1&page[size]=10000&filter[full_name][like]=%${value}%`;
      return this.dataService.getResponse(url).toPromise();
    }

    public getUsersWithoutMe(userName, myId) {
      const url = `/users?page[number]=1&page[size]=10000&filter[full_name][like]=%${userName}%&filter[id][not]=${myId}`;
      return this.dataService.getResponse(url).toPromise();
    }

    public getConversation(data){
      const url = '/conversations/by_user';
      return this.dataService.postResponse(url, data).toPromise();
    }
}
