import { Injectable } from '@angular/core';
import { RequestClientService } from '../request-client.service';
import { HOSTURL, PREFIX } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class ProjectGroupService {
  constructor(private requestClientService: RequestClientService) { }

  public async QueryProjectGroupsPagedList(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/QueryProjectGroupsPagedList`, params);
    return res;
  }

  public async CreateOrModifyProjectGroup(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/CreateOrModifyProjectGroup`, params);
    return res;
  }

  public async RemoveProjectGroupById(params) {
    const res = await this.requestClientService.delete(HOSTURL + `/api/services/${PREFIX}/Projects/RemoveProjectGroupById`, params);
    return res;
  }

  public async QueryProjectModelsPagedList(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/QueryProjectModelsPagedList`, params);
    return res;
  }

  public async CreateOrModifyProjectModel(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/CreateOrModifyProjectModel`, params);
    return res;
  }

  public async RemoveProjectModelById(params) {
    const res = await this.requestClientService.delete(HOSTURL + `/api/services/${PREFIX}/Projects/RemoveProjectModelById`, params);
    return res;
  }

  public async ConvertProjectModel(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/ConvertProjectModel`, params);
    return res;
  }

  public async AuditProjectGroup(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/AuditProjectGroup`, params);
    return res;
  }

  public async QueryProjectAuditUsersById(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/QueryProjectAuditUsersById`, params);
    return res;
  }
}
