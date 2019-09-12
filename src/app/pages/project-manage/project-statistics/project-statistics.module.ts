import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectStatisticsComponent } from './project-statistics.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [ProjectStatisticsComponent],
  imports: [
    CommonModule,
    NgxEchartsModule,
    NgZorroAntdModule,
    RouterModule.forChild([
      { path: '', component: ProjectStatisticsComponent }
    ])
  ]
})
export class ProjectStatisticsModule { }
