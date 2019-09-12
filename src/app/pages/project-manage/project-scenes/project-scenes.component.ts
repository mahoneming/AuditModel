import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectGroupService } from 'src/app/services/project-manage/project-group.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FileUploaderComponent, FlowFileModel } from 'src/app/components/file-uploader/file-uploader.component';
import { addForm, listForm } from './project-scenes.model';
import { FILEURL, apiPath } from 'src/app/config';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AssignManageService } from 'src/app/services/project-manage/assign-manage.service';
import { ProjectModelService } from 'src/app/services/project-manage/project-model.service';

@Component({
  selector: 'app-project-scenes',
  templateUrl: './project-scenes.component.html',
  styleUrls: ['./project-scenes.component.scss']
})
export class ProjectScenesComponent implements OnInit {

  @ViewChild('imageUploader', { static: false }) imageUploader: FileUploaderComponent;
  @ViewChild('modelUploader', { static: false }) modelUploader: FileUploaderComponent;

  public projectId = ''
  public listForm = new listForm();
  public groupList = [];
  public reviewListData = [];
  public isAddGroupVisible = false;
  public isModelVisible = false;
  public isReviewListVisible = false;
  public groupModelName: string;
  public groupModelId: string;
  public imgUpLists: any = [];
  public imgShow = true;
  public imgStyle: any = {};
  public modelStyle: any = { 'display': 'none' };
  public modelShow = true;
  public modelLists: any = [];
  public modelType = '.rvt,.stl,.fbx,.obj,.3ds';
  public addModelInfo = new addForm();
  public imgQueue: any = [];
  public modelQueue: any = [];
  public FILEURL = FILEURL;
  public modelGroupId = null;
  public apiPath = apiPath;
  public auditStatus: string;

  constructor(
    private projectGroupService: ProjectGroupService,
    private assignManageService: AssignManageService,
    private projectModelService: ProjectModelService,
    private routerinfo: ActivatedRoute,
    private message: NzMessageService,
    private modal: NzModalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routerinfo.params.subscribe((params: Params) => {
      this.projectId = params['projectId']
    })
    this.routerinfo.queryParams.subscribe((queryParams) => {
      this.auditStatus = queryParams['auditStatus']
    })
    this.getGroupList()
  }

  async QueryProjectGroupsPagedList(data) {
    const res = await this.projectGroupService.QueryProjectGroupsPagedList(data)
    this.groupList = res.result.items
    this.listForm.nzTotal = res.result.totalCount
  }

  async CreateOrModifyProjectGroup(data) {
    const res = await this.projectGroupService.CreateOrModifyProjectGroup(data)
    if (res.success) {
      this.message.success('操作成功');
    } else {
      // this.message.warning(res.error.message);
    }
    await this.getGroupList();
    this.isAddGroupVisible = false;
  }

  async getReviewInfo(item) {
    event.stopPropagation()
    // console.log(item)
    const data = {
      projectId: this.projectId,
      modelGroupId: item.id,
      maxResultCount: 1000,
      skipCount: 0
    }
    const res = await this.assignManageService.QueryProjectAuditHistorysPagedList(data)
    if (res.success) {
      if (!res.result) {
        this.message.warning('暂无数据')
        return
      } else {
        this.reviewListData = res.result.items
        this.isReviewListVisible = true
      }
    }
  }

  async routeToModel(item) {
    if (item.taskId == '00000000-0000-0000-0000-000000000000') {
      this.message.create('warning', '暂无可用模型');
      return
    }
    const json = {
      modelGroupId: item.id,
      taskId: item.taskId
    }
    // 查询解析进度
    const result = await this.projectModelService.transformation(json);
    if (!result.item.taskState.done && !result.item.taskState.found && !result.item.taskState.successed) {
      this.message.warning('模型转换失败，请联系管理员');
      return;
    }
    if (!result.item.taskState.done && result.item.taskState.found) {
      this.message.loading('模型转换中，请耐心等待');
      return;
    }
    result.item.modelList.forEach((el) => {
      if (el.percent == 0 && el.errorMessage != 'FileAlreadyParsed') {
        this.message.warning(`模型  ` + '【' + el.modelName + '】' + '转换失败');
        return
      }
    });
    this.router.navigate([`/project-manage/project-scenes/${this.projectId}/project-model`, item.id], { queryParams: { type: item.type } });
  }

  getGroupList() {
    const data = {
      ...this.listForm,
      projectId: this.projectId
    }
    this.QueryProjectGroupsPagedList(data)
  }

  pageChange(index) {
    const data = {
      ...this.listForm,
      projectId: this.projectId,
      skipCount: index - 1
    }
    this.QueryProjectGroupsPagedList(data)
  }

  search() {
    const data = {
      ...this.listForm,
      projectId: this.projectId
    }
    this.QueryProjectGroupsPagedList(data)
  }

  // 场景
  fileImgChange(e) {
    this.imgUpLists.forEach((el: FlowFileModel) => {
      if (e.target.files[0].name === el.name) {
        this.imgSuccess(el);
        return;
      }
    });
    this.imageUploader.add(e.target.files[0]);
  }

  imgSuccess(transfer: FlowFileModel) {
    this.imgUpLists.push(transfer);
    this.imgShow = false;
    this.imgStyle = {
      'background-image': 'url(' + transfer.url + ')'
    };
    this.addModelInfo.imageUrl = transfer.url;
  }

  addModelGroup() {
    this.isAddGroupVisible = true;
    this.groupModelName = null;
    this.groupModelId = null;
    this.addModelInfo.imageUrl = null;
    this.imgShow = true;
    this.imgStyle = {};
  }

  handleAddGroupOk() {
    if (!this.groupModelName) {
      this.message.create('warning', '请输入场景名称');
      return;
    }
    let data = {
      id: this.groupModelId,
      name: this.groupModelName,
      projectId: this.projectId,
      imageUrl: this.addModelInfo.imageUrl,
      // type: 2
    }
    if (!this.groupModelId) delete data.id
    this.CreateOrModifyProjectGroup(data)
  }

  editModelGroup(item) {
    event.stopPropagation()
    // console.log(item)
    // this.GroupModelName = item.name;
    this.isAddGroupVisible = true;
    this.groupModelId = item.id
    this.groupModelName = item.name;
    this.addModelInfo.imageUrl = item.imageUrl;
    this.imgShow = false;
    if (item.imageUrl) {
      this.imgShow = false;
      this.imgStyle = {
        'background-image': 'url(' + item.imageUrl + ')'
      };
    } else {
      this.imgShow = true;
    }
  }

  async removeProject(item) {
    event.stopPropagation()
    this.modal.error({
      nzTitle: '确认要删除该项吗?',
      nzContent: '<b style="color: red;">删除后不能恢复，请谨慎操作。</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: async () => {
        const res = await this.projectGroupService.RemoveProjectGroupById({ id: item.id })
        if (res.success) {
          this.message.success('删除成功')
          this.getGroupList()
        }
      },
      nzCancelText: '取消',
      nzOnCancel: () => { }
    });
  }

  // 模型
  async showModelList(params) {
    event.stopPropagation()
    this.isModelVisible = true;
    this.modelGroupId = params.id;
    let pramas = {
      modelGroupId: params.id,
      maxResultCount: 1000,
      projectId: params.projectId
    }
    const res = await this.projectGroupService.QueryProjectModelsPagedList(pramas);
    if (res.success) {
      this.modelLists = res.result.items;
    } else {
      this.message.warning(res.error.message);
    }
  }

  async deleteModel(item) {
    this.modal.error({
      nzTitle: '确认要删除该项吗?',
      nzContent: '<b style="color: red;">删除后不能恢复，请谨慎操作。</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: async () => {
        //  业务端模型删除
        let delRes = await this.projectGroupService.RemoveProjectModelById({ Id: item.id });
        if (delRes.success) {
          this.message.success('删除成功')
          // 重新请求数据列表
          const data = {
            id: item.modelGroupId,
            maxResultCount: 1000,
            projectId: item.projectId
          }
          this.showModelList(data)
        } else {
        }
        // 图形服务端删除模型
        // let Params = {
        //   hash: item.hash,
        //   modelGroupId: item.modelGroupId,
        //   modelName: item.fileName
        // }
        // // console.log(Params)
        // const serDelRes = await this.modelListService.delModelFromGraphicsServer(Params);
        // if (serDelRes.success) {
        // } else {
        //   this.message.warning(serDelRes.error.message);
        // }
      },
      nzCancelText: '取消',
      nzOnCancel: () => { }
    });
  }

  // 模型上传（文件服务）
  public async fileModelChange(e) {
    this.modelStyle['display'] = 'block';
    this.modelShow = false;
    // 判断不能重复上传已存在模型
    let ext = this.modelLists.find((el) => {
      return el.fileName == e.target.files[0].name;
    })
    // console.log(ext)
    if (!ext) {
      this.modelUploader.add(e.target.files[0]);
    } else {
      this.reModel()
      this.message.warning('已存在该模型')
    }
  }

  // 模型文件上传文件服务器成功回调
  public async modelSuccess(transfer: FlowFileModel) {
    await this.handleAddOk(transfer)
    this.reModel()
  }

  public reModel() {
    this.modelShow = true;
    this.modelStyle['display'] = 'none';
  }

  // 保存模型上传（业务端）
  public async handleAddOk(transfer) {
    if (this.modelShow) {
      this.message.create('warning', '请上传模型');
      return;
    }
    // const arr = this.anaJson.path.split('.');
    // this.addModelInfo.modelUrl = arr[0] + '/';
    // console.log(transfer)
    this.addModelInfo.path = transfer.fileInfo.path;
    this.addModelInfo.modelGroupId = this.modelGroupId;
    this.addModelInfo.creatorUserName = JSON.parse(window.localStorage.getItem('APDInfo'))['userName'];
    this.addModelInfo.projectId = this.projectId;
    this.addModelInfo.fileName = transfer.fileInfo.name;
    this.addModelInfo.hash = transfer.fileInfo.hash;
    this.addModelInfo.size = transfer.size;
    this.addModelInfo.SSOCreatorUserId = transfer.fileInfo.createdUserId;
    this.addModelInfo.type = transfer.fileInfo.type;

    // 上传模型 业务端请求
    let uploadres = await this.projectGroupService.CreateOrModifyProjectModel(this.addModelInfo);
    // this.isAddVisible = false;
    if (uploadres.success) {
      const data = {
        id: this.modelGroupId,
        maxResultCount: 1000,
        projectId: this.addModelInfo.projectId
      }
      this.showModelList(data)
    } else {
      this.message.warning(uploadres.error.message);
    }
  }

  // 文件上传完成后集中发起解析
  public async goanalysisModel(type) {
    if (this.modelLists.length === 0) {
      this.message.warning('请先上传模型');
      return;
    }
    this.modal.info({
      nzTitle: '确认保存?',
      nzContent: '<b style="color: red;">上传的模型文件将会被保存，并开始模型转换</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: async () => {
        const parmas = {
          modelGroupId: this.modelGroupId,
          // maxResultCount: 1000,
          projectId: this.projectId
        }
        const resultAna = await this.projectGroupService.ConvertProjectModel(parmas);
        // console.log(JSON.parse(resultAna.result).items)
        if (!JSON.parse(resultAna.result).success) {
          this.message.error(JSON.parse(resultAna.result).items);
          return
        }
        if (resultAna.success) {
          this.message.success('保存成功');
          this.getGroupList()
          this.isModelVisible = false
        }
      },
      nzCancelText: '取消',
      nzOnCancel: () => { }
    });
  }

}
