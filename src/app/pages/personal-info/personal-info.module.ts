import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PersonalInfoComponent } from './personal-info.component';
import { NgxFlowModule, FlowInjectionToken } from '@flowjs/ngx-flow';
import Flow from '@flowjs/flow.js';
import { FileUploaderModule } from 'src/app/components/file-uploader/file-uploader.module';



@NgModule({
  declarations: [PersonalInfoComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    NgxFlowModule,
    FileUploaderModule,
    RouterModule.forChild([
      { path: '', component: PersonalInfoComponent }
    ])
  ],
  providers: [
    // PersonalService,
    {
      provide: FlowInjectionToken,
      useValue: Flow
    }
  ]
})
export class PersonalInfoModule { }
