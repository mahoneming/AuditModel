import { Injectable } from '@angular/core';
import { RequestClientService } from '../request-client.service';
import { HOSTURL, PREFIX } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class ProjectListService {

  constructor(
    private requestClientService: RequestClientService
  ) { }

  public async QueryProjectPagedList(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/QueryProjectPagedList`, params);
    return res;
  }

  public async CreateOrModifyProject(parmas) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/CreateOrModifyProject`, parmas);
    return res;
  }

  public async RemoveProject(params) {
    const res = await this.requestClientService.delete(HOSTURL + `/api/services/${PREFIX}/Projects/RemoveProject`, params);
    return res;
  }

  public async QueryProjectAuditPagedList(parmas) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Projects/QueryProjectAuditPagedList`, parmas);
    return res;
  }

}
