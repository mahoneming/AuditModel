import { Pipe, PipeTransform } from '@angular/core';

/**
 * 时间转换
 */
@Pipe({
    name: 'DateTransformPipe'
  })
  export class DateTransformPipe implements PipeTransform {
    transform(date: any, args?: any): any {
      let result = '-';
      if (date) {
        let dateObjs = new Date(date);
        let renderZero = (value) => {
          return (value + '').length === 1 ? '0' + value : value;
        };
        result = (dateObjs.getFullYear() + '-' +
          renderZero(dateObjs.getMonth() + 1) + '-' +
          renderZero(dateObjs.getDate()) +
          (!args ?
            (
              ' ' + renderZero(dateObjs.getHours()) + ':' + renderZero(dateObjs.getMinutes()) + ':' + renderZero(dateObjs.getSeconds())
            ) : '')
        );
      }
      return result;
    }
  }
