import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AssignUserComponent } from './assign-user.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';



@NgModule({
  declarations: [AssignUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: AssignUserComponent },
    ])
  ]
})
export class AssignUserModule { }
