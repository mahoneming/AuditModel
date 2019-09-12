import { Injectable } from '@angular/core';
import { Base64 } from 'src/app/common/helper/base64';
import { RequestClientService } from '../request-client.service';
import { HOSTURL, PREFIX, FILEURL, version } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class ProjectModelService {

  constructor(
    private requestClientService: RequestClientService
  ) {
    if (JSON.parse(window.localStorage.getItem('project'))) {
      // this.tenantId = Base64.encode(JSON.parse(window.localStorage.getItem('project'))['id']);
    }
  }

  public leftBench: any;
  // public leftShow: boolean = true;
  // public rightShow: boolean = true;
  public tenantId: any = 'NWJlMDRjODYtMGI0OC00NThlLWJmYzctNjYxNjNmNjZjOTdh';

  // 获取模型组列表
  public async QueryModelGroupsPagedList(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/QueryModelGroupsPagedList`, params);
    return res;
  }
  // 添加模型组
  public async CreatOrModifyModelGroup(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/CreatOrModifyModelGroup`, params);
    return res;
  }
  // 删除模型组
  public async RemoveModelGroup(params) {
    const res = await this.requestClientService.delete(HOSTURL + `/api/services/${PREFIX}/Projects/RemoveModelGroup`, params);
    return res;
  }
  // 获取模型列表
  public async getModelLists(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/QueryProjectModelsPagedList`, params);
    return res;
  }
  // 添加模型
  public async addModel(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/CreatOrModifyModel`, params);
    return res;
  }
  // 修改模型
  public async editModel(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/CreatOrModifyModel`, params);
    return res;
  }
  // 删除模型
  public async deleteModel(params) {
    const res = await this.requestClientService.delete(HOSTURL + `/api/services/${PREFIX}/Projects/RemoveModel`, params);
    return res;
  }
  // 图形后台删除模型
  public async delModelFromGraphicsServer(json) {
    let res = await this.requestClientService.postSSO(`${FILEURL}/file/api/v${version}/BIMModel/delete-model`, json, { 'TenantId': this.tenantId });
    return res;
  }
  // 获取图纸列表
  public async getDrawingsLists(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Drawings/QueryDrawingPagedList`, params);
    return res;
  }
  // 修改文件
  // public async updateFile(json) {
  //   let res = await this.requestClientService.putSSO(`${FILEURL}/api/v${version}/File`, json);
  //   return res;
  // }

  // 向业务端发起模型解析请求
  public async ConvertModel(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/ConvertModel`, params);
    return res;
  }
  // 解析模型·(2019.6.18 后暂未使用)
  public async analysisModel(json) {
    let res = await this.requestClientService.postSSO(`${FILEURL}/file/api/v${version}/FileConvert/convert-model`, json, { 'TenantId': this.tenantId });
    return res;
  }
  // 解析进度
  public async transformation(json) {
    let res = await this.requestClientService.getSSO(`${FILEURL}/file/api/v${version}/FileConvert/convert-process`, json, { 'TenantId': this.tenantId });
    return res;
  }
  // 模型链接关系
  public async modelRelation(id) {
    let res = await this.requestClientService.postSSO(`${FILEURL}/file/api/v${version}/BIMModel/modelRelation/` + id, {}, { 'TenantId': this.tenantId });
    return res;
  }
  // 模型树结构
  public async modelTrees(json) {
    let res = await this.requestClientService.postSSO(`${FILEURL}/file/api/v${version}/BIMModel/relation-model-tree/` + json.modelGroupId, {}, { 'TenantId': this.tenantId });
    return res;
  }
  // 局部加载结构树
  public async modelTree(json) {
    let res = await this.requestClientService.getSSO(`${FILEURL}/api/v${version}/BIMModel/modelTree`, json, { 'TenantId': this.tenantId });
    return res;
  }
  // 获取某模型的所有构件类型
  public async modelComponent(json) {
    let res = await this.requestClientService.getSSO(`${FILEURL}/file/api/v${version}/BIMModel/allLeafType`, json, { 'TenantId': this.tenantId });
    return res;
  }
  // 获取构件属性
  public async singleComponent(json) {
    let res = await this.requestClientService.postSSO(`${FILEURL}/file/api/v${version}/BIMModel/getproperties`, json, { 'TenantId': this.tenantId });
    return res;
  }

  // 推送建委列表信息
  public async SysncData(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Jianwei/SyncData`, params);
    return res;
  }

  // 同步模型文件
  // public async Synchronous(json) {
  //   // tslint:disable-next-line: max-line-length
  //   // let res = await this.requestClientService.post(`${FILEURL}/file/api/v${version}/FlowJs/Synchronous?hash=` + json.hash, {});
  //   // tslint:disable-next-line: max-line-length
  //   // let res = await this.requestClientService.postSSO(`${FILEURL}/file/api/v${version}/FlowJs/Synchronous`, json);
  //   let res = await this.requestClientService.postSSO(`${HOSTURL}/api/services/${PREFIX}/FileServer/Synchronous` , json);
  //   return res;
  // }
  // 获取审核列表结果
  public async getAuditLists(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Jianwei/QueryProjectAuditsPagedList`, params);
    return res;
  }
  // 替换模型
  public async reSyncData(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Jianwei/ReSyncData`, params);
    return res;
  }
  // 检验批构件绑定
  public async bindToLots(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/DocumentLibrarys/CreateProjectProperties`, params);
    return res;
  }
  // 解除检验批构件绑定
  public async unbindToLots(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/DocumentLibrarys/BatchRemoveProperties`, params);
    return res;
  }

  // 移动已绑定检验批构件
  public async moveToLots(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/DocumentLibrarys/ModifyProjectPropertyies`, params);
    return res;
  }
}
