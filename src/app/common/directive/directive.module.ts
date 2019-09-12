import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThrottleClickDirective } from './throttleClick.directive';
import { DebounceClickDirective } from './debounceClick.directive';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ThrottleClickDirective, DebounceClickDirective],
  exports: [ThrottleClickDirective, DebounceClickDirective]
})
export class DirectiveModule { }
