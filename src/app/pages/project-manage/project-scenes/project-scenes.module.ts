import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectScenesComponent } from './project-scenes.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/common/pipe/pipe.module';
import { FileUploaderModule } from 'src/app/components/file-uploader/file-uploader.module';
import { RouterModule } from '@angular/router';
import { ZzjAbpModule } from '@zzj/zzj-abp-web';



@NgModule({
  declarations: [ProjectScenesComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    PipeModule,
    ReactiveFormsModule,
    FileUploaderModule,
    ZzjAbpModule,
    RouterModule.forChild([
      {
        path: '', component: ProjectScenesComponent,
        // children: [
        //   { path: 'project-model/:modelId', loadChildren: () => import('./project-model/project-model.module').then((m) => m.ProjectModelModule) }
        // ]
      },
      { path: 'project-model/:modelGroupId', loadChildren: () => import('./project-model/project-model.module').then((m) => m.ProjectModelModule) }
    ])
  ]
})
export class ProjectScenesModule { }
