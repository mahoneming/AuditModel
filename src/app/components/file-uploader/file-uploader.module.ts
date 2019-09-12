import { NgModule } from '@angular/core';
import { FileUploaderComponent } from './file-uploader.component';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlowInjectionToken } from '@flowjs/ngx-flow';
import Flow from '@flowjs/flow.js';
import { NgxFlowModule } from '@flowjs/ngx-flow';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    NgxFlowModule
    // RouterModule.forChild([{ path: '', component: FileUploaderComponent }]),
  ],
  declarations: [FileUploaderComponent],
  exports: [FileUploaderComponent],
  providers: [{
    provide: FlowInjectionToken,
    useValue: Flow
  }]
})
export class FileUploaderModule { }
