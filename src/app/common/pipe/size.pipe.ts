import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'size'
})
export class SizePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let text = (value/1024/1024).toFixed(2);
    return text;
  }

}
