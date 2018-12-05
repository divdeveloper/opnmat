import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '../../../services/service.config';

@Pipe({
  name: 'AvatarPipe',
})
export class AvatarPipe implements PipeTransform {
  transform(value: string) {
      if (value == '') {
        return '/assets/images/user-dafault.png';
      }

      return ConfigService.URL_SERVER + value;
  }
}
