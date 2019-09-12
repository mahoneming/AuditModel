import { Pipe, PipeTransform } from '@angular/core';

/**
 * 为空时的占位符
 */
@Pipe({
    name: 'NullPlaceholderPipe'
  })
  export class NullPlaceholderPipe implements PipeTransform {
    transform(value: any, args?: any): any {
      return value || '-';
    }
  }
