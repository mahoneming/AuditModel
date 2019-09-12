import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'project'
})
export class ProjectPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args === 'type') {
      let text = '其他';
      switch (value) {
        case 1:
          text = '安装工程'
          break;
        case 2:
          text = '地灾设计'
          break;
        case 3:
          text = '地灾施工工程'
          break;
        case 4:
          text = '房建工程'
          break;
        case 5:
          text = '非煤矿山'
          break;
        case 6:
          text = '钢结构工程'
          break;
        case 7:
          text = '公路工程'
          break;
        case 8:
          text = '矿建工程'
          break;
        case 9:
          text = '桥梁工程'
          break;
        case 10:
          text = '市政工程'
          break;
        case 11:
          text = '水利水电工程'
          break;
        case 12:
          text = '隧道工程'
          break;
        case 13:
          text = '铁路工程'
          break;
        case 14:
          text = '土地整治工程'
          break;
        case 15:
          text = '土石方工程'
          break;
        case 16:
          text = '消防工程'
          break;
        case 17:
          text = '装饰工程'
          break;
        case 18:
          text = '综合'
          break;
        case 19:
          text = '其他'
          break;
      }
      return text
    } else if (args === 'status') {
      let text = '勘探';
      switch (value) {
        case 1:
          text = '勘探'
          break;
        case 2:
          text = '可研'
          break;
        case 3:
          text = '立项'
          break;
        case 4:
          text = '投标'
          break;
      }
      return text;
    } else if (args === 'is') {
      let text = '是';
      switch (value) {
        case 1:
          text = '是';
          break;
        case 2:
          text = '否';
          break;
      }
      return text;
    }
  }

}
