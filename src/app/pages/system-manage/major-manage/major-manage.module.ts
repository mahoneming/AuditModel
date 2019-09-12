import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MajorManageComponent } from './major-manage.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [MajorManageComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '', component: MajorManageComponent,
      }
    ])
  ]
})
export class MajorManageModule { }
