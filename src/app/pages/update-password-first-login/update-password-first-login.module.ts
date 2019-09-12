import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UpdatePasswordFirstLoginComponent } from './update-password-first-login.component';



@NgModule({
  declarations: [UpdatePasswordFirstLoginComponent ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: UpdatePasswordFirstLoginComponent }
    ])
  ]
})
export class UpdatePasswordFirstLoginModule { }
