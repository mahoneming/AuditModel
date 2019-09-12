import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notice'
})
export class NoticePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args === 'status') {
      let text = '未读';
      switch (value) {
        case 1:
          text = '已读';
          break;
        case 2:
          text = '未读';
          break;
      }
      return text;
    }
  }

}
