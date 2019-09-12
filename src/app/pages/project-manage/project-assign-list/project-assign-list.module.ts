import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProjectAssignListComponent } from './project-assign-list.component';



@NgModule({
  declarations: [ProjectAssignListComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: ProjectAssignListComponent },
      { path: 'assign-manage/:projectId', loadChildren:  () => import('./assign-manage/assign-manage.module').then(m => m.AssignManageModule) },
    ])
  ]
})
export class ProjectAssignListModule { }
