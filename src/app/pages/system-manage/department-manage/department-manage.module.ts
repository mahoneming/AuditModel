import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DepartmentManageComponent } from './department-manage.component';
import { DragDropModule } from '@angular/cdk/drag-drop'


@NgModule({
  declarations: [DepartmentManageComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    DragDropModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '', component: DepartmentManageComponent,
      }
    ])
  ]
})
export class DepartmentManageModule { }
