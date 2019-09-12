/**
 * 自定义指令，防抖函数
 * 引入：在需要的模块imports中引入并注册
 * 使用：<button appDebounceClick (debounceClick)="XXX($event)" [time]="1000">搜索</button>
 */

import {
    Directive, EventEmitter, HostListener, OnInit, Output, OnDestroy, Input, HostBinding
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
    selector: '[appDebounceClick]'
})
export class DebounceClickDirective implements OnInit, OnDestroy {
    @Input('time') debounceTime = 1000;
    @Output() debounceClick = new EventEmitter();
    public clicks = new Subject<any>();
    public subscription: Subscription;
    constructor() {
    }

    ngOnInit() {

        this.subscription = this.clicks.pipe(
            debounceTime(this.debounceTime)
        ).subscribe(e => this.debounceClick.emit(e));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    @HostListener('click', ['$event'])
    clickEvent(event) {

        console.log(event)
        event.preventDefault();
        event.stopPropagation();
        this.clicks.next(event);
    }

    // @HostBinding()

}
