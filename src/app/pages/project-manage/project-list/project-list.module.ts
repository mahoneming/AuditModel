import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from './project-list.component';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZzjAbpModule } from '@zzj/zzj-abp-web';

@NgModule({
  declarations: [ProjectListComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    ZzjAbpModule,
    RouterModule.forChild([
      { path: '', component: ProjectListComponent }
    ])
  ]
})
export class ProjectListModule { }
