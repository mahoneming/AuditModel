import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginLogComponent } from './login-log.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [LoginLogComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '', component: LoginLogComponent,
      }
    ])
  ]
})
export class LoginLogModule { }
