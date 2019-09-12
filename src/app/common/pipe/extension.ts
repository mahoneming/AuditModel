import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'extension'
})
export class ExtensionPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            return value.substring(value.lastIndexOf('.'), value.length); //后缀名;
        }
    }

}