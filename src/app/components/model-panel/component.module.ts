import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { ModelPanelComponent } from './model-panel.component';
import { TreePanelComponent } from './tree-panel/tree-panel.component';
import { CollapsePanelComponent } from './collapse-panel/collapse-panel.component';
import { PipeModule } from '../../common/pipe/pipe.module';
// import { SchedulePlugin } from '../../services/model/model.plugin';
import { GumToolbarComponent } from '../gum-toolbar/gum-toolbar.component';
import { FileUploaderModule } from '../../components/file-uploader/file-uploader.module';
// 选色板模块添加
import { ColorPickerModule } from 'ngx-color-picker';
import { DirectiveModule } from 'src/app/common/directive/directive.module';
// 防抖模块添加


@NgModule({
    imports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        PipeModule,
        FileUploaderModule,
        ColorPickerModule,
        DirectiveModule
    ],
    declarations: [
        ModelPanelComponent,
        TreePanelComponent,
        CollapsePanelComponent,
        GumToolbarComponent
    ],
    exports: [
        ModelPanelComponent,
        TreePanelComponent,
        CollapsePanelComponent,
        GumToolbarComponent
    ]
    // providers: [SchedulePlugin]
})
export class ModelComModule { }
