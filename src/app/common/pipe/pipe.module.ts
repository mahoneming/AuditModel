import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTimePipe } from './date-time.pipe';
import { ProjectPipe } from './project.pipe';
import { NoticePipe } from './notice.pipe';
import { SizePipe } from './size.pipe';
import { ExtensionPipe } from './extension';
import { TypeStatusPipe } from './typeStatus.pipe';
import { DateTransformPipe } from './dateTransform.pipe';
import { FileSizePipe } from './fileSize.pipe';
import { NullPlaceholderPipe } from './nullPlaceholder.Pipe';
import {EscapeHtmlPipe} from './Sanitizer.pipe';
import {GanttPipe} from './gantt.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DateTimePipe,
    ProjectPipe,
    NoticePipe,
    SizePipe,
    ExtensionPipe,
    TypeStatusPipe,
    DateTransformPipe,
    FileSizePipe,
    NullPlaceholderPipe,
    EscapeHtmlPipe,
    GanttPipe
  ],
  exports: [
    DateTimePipe,
    ProjectPipe,
    NoticePipe,
    SizePipe,
    ExtensionPipe,
    TypeStatusPipe,
    DateTransformPipe,
    FileSizePipe,
    NullPlaceholderPipe,
    EscapeHtmlPipe,
    GanttPipe
  ]
})
export class PipeModule { }
