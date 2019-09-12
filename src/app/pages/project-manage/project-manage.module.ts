import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectManageComponent } from './project-manage.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ProjectManageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: ProjectManageComponent,
        children: [
          { path: 'project-list', loadChildren:  () => import('./project-list/project-list.module').then((m) => m.ProjectListModule) },
          { path: 'project-statistics', loadChildren:  () => import('./project-statistics/project-statistics.module').then((m) => m.ProjectStatisticsModule) },
          { path: 'project-assign-list', loadChildren:  () => import('./project-assign-list/project-assign-list.module').then((m) => m.ProjectAssignListModule) },
          { path: 'project-review-list', loadChildren:  () => import('./project-review-list/project-review-list.module').then((m) => m.ProjectReviewListModule) },
          { path: 'project-scenes/:projectId', loadChildren:  () => import('./project-scenes/project-scenes.module').then((m) => m.ProjectScenesModule) },
          { path: 'project-detail/:projectId', loadChildren:  () => import('./project-detail/project-detail.module').then((m) => m.ProjectDetailModule) }
        ]
      }
    ])
  ]
})
export class ProjectManageModule { }
