import { Pipe, PipeTransform } from '@angular/core';

/**
 * 文件大小转换
 */
@Pipe({
    name: 'FileSizePipe'
  })
  export class FileSizePipe implements PipeTransform {
    transform(value: any, args?: any): any {
      switch (args) {
        case 'bytes':
          value = value / 1024
          break;
        default:
          value = value / 1024
          break;
      }
      //B,KB,MB,GB,TB,PB,EB,ZB,YB,BB
      let unitStrArr = ['K', 'M', 'G'];
      let unitIdx = 0;
      let sizeCalc = value;// / 1024;
      for (; unitIdx < unitStrArr.length && sizeCalc > 1024; ++unitIdx) {
        sizeCalc = sizeCalc / 1024;
      }
      return parseFloat(sizeCalc).toFixed(2) + unitStrArr[unitIdx];
    }
  }
