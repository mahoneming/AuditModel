import { Injectable } from '@angular/core';
import { RequestClientService } from '../request-client.service';
import { HOSTURL, PREFIX } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class AssignManageService {

  constructor(
    private requestClientService: RequestClientService
  ) { }

  public async QueryProjectAuditUsersPagedList(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/QueryProjectAuditUsersPagedList`, params);
    return res;
  }

  public async QueryProjectAuditHistorysPagedList(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/QueryProjectAuditHistorysPagedList`, params);
    return res;
  }

  public async BatchRemoveOnProjectAuditUsers(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/BatchRemoveOnProjectAuditUsers`, params);
    return res;
  }

  public async BatchCreateUserToProjectAuditUsers(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/BatchCreateUserToProjectAuditUsers`, params);
    return res;
  }

  public async RandomCreateProjectAuditUsers(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/RandomCreateProjectAuditUsers`, params);
    return res;
  }

}
