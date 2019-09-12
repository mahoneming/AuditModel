import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProjectModelComponent } from './project-model.component';
import { ModelComModule } from 'src/app/components/model-panel/component.module';



@NgModule({
  declarations: [ProjectModelComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    ModelComModule,
    RouterModule.forChild([
      { path: '', component: ProjectModelComponent },
    ])
  ]
})
export class ProjectModelModule { }
