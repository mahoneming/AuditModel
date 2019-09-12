import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemMonitorComponent } from './system-monitor.component';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';



@NgModule({
  declarations: [SystemMonitorComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    RouterModule.forChild([
      {
        path: '', component: SystemMonitorComponent,
      }
    ])
  ]
})
export class SystemMonitorModule { }
