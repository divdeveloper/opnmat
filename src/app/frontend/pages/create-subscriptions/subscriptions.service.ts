import { Injectable } from '@angular/core';
import { DataService } from '../../../services/data.service';

@Injectable()
export class SubscriptionsService {

  constructor(public dataService: DataService) {

  }

  public getMe(){
      return this.dataService.getMe();
  }

  public getSubscriptions (id: number, academyId: number) {
      const url = `/subscriptions?filter[user_id]=${id}&filter[academy_id]=${academyId}`;
      return this.dataService.getResponse(url);
  }

  public getOneSubscription (id: number) {
      return this.dataService.getResponse(`/subscriptions/${id}`);
  }

  public createSubscription (data) {
      console.log(data);
      return this.dataService.postResponse('/subscriptions', data);
  }

  public updateSubscription (id: number, data) {
      console.log(data);
      return this.dataService.putResponse(`/subscriptions/${id}`, data);
  }

  public deleteSubscription (id: number) {
      console.log(id);
      return this.dataService.delResponse(`/subscriptions/${id}`);
  }

}
