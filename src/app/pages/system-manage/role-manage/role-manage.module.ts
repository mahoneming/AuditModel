import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleManageComponent } from './role-manage.component';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZzjAbpModule } from '@zzj/zzj-abp-web';



@NgModule({
  declarations: [RoleManageComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ZzjAbpModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: RoleManageComponent },
      { path: 'assign-user', loadChildren: () => import('./assign-user/assign-user.module').then((m) => m.AssignUserModule) }
    ])
  ]
})
export class RoleManageModule { }
