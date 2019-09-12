import { Directive, ElementRef, OnInit, Output, EventEmitter, Input, HostListener, } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

/**
 * 自定义指令，节流函数
 * 引入：declarations
 * 使用：<button appThrottleClick (throttleClick)="getPageInfo($event)" [time]="1000">搜索</button>
 */

@Directive({
  selector: '[appThrottleClick]'
})
export class ThrottleClickDirective implements OnInit {
  @Output() throttleClick = new EventEmitter();
  @Input('time') throttleTime: number = 1000;

  clicks = new Subject<any>();
  subscription: Subscription;

  constructor(
    private el: ElementRef
  ) { }

  @HostListener('click', ['$event'])
  handleClick(event: any) {
    console.log('throtlteTime', this.throttleTime)
    this.clicks.next(event)
  }

  ngOnInit(): void {
    this.subscription = this.clicks
      .pipe(throttleTime(this.throttleTime))
      .subscribe(e => this.throttleClick.emit(e))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
