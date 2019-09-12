import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SystemManageComponent } from './system-manage.component';

@NgModule({
  declarations: [SystemManageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: SystemManageComponent,
        children: [
          { path: 'user-manage', loadChildren: () => import('./user-manage/user-manage.module').then(m => m.UserManageModule) },
          { path: 'interface-user', loadChildren: () => import('./interface-user/interface-user.module').then(m => m.InterfaceUserModule) },
          { path: 'expert-list', loadChildren: () => import('./expert-list/expert-list.module').then(m => m.ExpertListModule) },
          { path: 'role-manage', loadChildren: () => import('./role-manage/role-manage.module').then(m => m.RoleManageModule) },
          { path: 'department-manage', loadChildren: () => import('./department-manage/department-manage.module').then(m => m.DepartmentManageModule) },
          { path: 'major-manage', loadChildren: () => import('./major-manage/major-manage.module').then(m => m.MajorManageModule) },
          { path: 'job-manage', loadChildren: () => import('./job-manage/job-manage.module').then(m => m.JobManageModule) },
          { path: 'region-manage', loadChildren: () => import('./region-manage/region-manage.module').then(m => m.RegionManageModule) },
          { path: 'login-log', loadChildren: () => import('./login-log/login-log.module').then(m => m.LoginLogModule) },
          { path: 'notice', loadChildren: () => import('./notice/notice.module').then(m => m.NoticeModule) },
        ]
      }
    ])
  ]
})
export class SystemManageModule { }
