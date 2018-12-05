import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'pipeJoin'})

export class JoinPipe implements PipeTransform {
  transform(array: Array<any>, separator: string): String {
    return Object.values(array).join(separator);
  }
}
