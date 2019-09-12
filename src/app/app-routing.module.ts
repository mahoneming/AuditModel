import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AuthService } from './services/auth.service';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule) },
  {
    path: '',
    component: LayoutComponent,
    // canActivate: [AuthService],
    children: [
      {
        path: 'project-manage',
        children: [{ path: '', loadChildren: () => import('./pages/project-manage/project-manage.module').then((m) => m.ProjectManageModule) }]
      },
      {
        path: 'system-manage',
        children: [{ path: '', loadChildren: () => import('./pages/system-manage/system-manage.module').then((m) => m.SystemManageModule) }]
      },
      {
        path: 'system-monitor',
        children: [{ path: '', loadChildren: () => import('./pages/system-monitor/system-monitor.module').then((m) => m.SystemMonitorModule) }]
      },
      { path: 'personal-info', loadChildren: () => import('./pages/personal-info/personal-info.module').then((m) => m.PersonalInfoModule) },
      { path: 'update-password', loadChildren: () => import('./pages/update-password/update-password.module').then((m) => m.UpdatePasswordModule) }
    ]
  },
  { path: 'update-password-first-login', loadChildren: () => import('./pages/update-password-first-login/update-password-first-login.module').then((m) => m.UpdatePasswordFirstLoginModule) },
  { path: '**', redirectTo: 'login' }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    NgZorroAntdModule,
    CommonModule,
    FormsModule
  ],
  declarations: [
    LayoutComponent
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
