import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'ganttPipe'
})
export class GanttPipe implements PipeTransform {
    public transform(value: any, args?: any): any {
        if (args === 'finishRate') {
            if (value === 0) {
                return 0;
            } else {
                let math = Math.round(value * 100);
                if (math === 0) {
                    return `< 1%`;
                } else {
                    return `${math}%`;
                }
            }

        }
        return value;
    }

}
