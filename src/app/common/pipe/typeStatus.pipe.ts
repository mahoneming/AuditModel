import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'typeStatusPipe'
})
export class TypeStatusPipe implements PipeTransform {
    transform(value: number, args: any): any {
        console.info(value)
        console.info(args)
    }
}
