import { Injectable } from '@angular/core';
import { RequestClientService } from '../request-client.service';
import { HOSTURL, PREFIX } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class JobManageService {

  constructor(
    private requestClientService: RequestClientService
  ) { }
  
  async QueryPositionsPagedList(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Systems/QueryPositionsPagedList`, params);
    return res;
  }

  async RemovePosition(params) {
    const res = await this.requestClientService.delete(HOSTURL + `/api/services/${PREFIX}/Systems/RemovePosition`, params);
    return res;
  }

  async CreateOrModifyPosition(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Systems/CreateOrModifyPosition`, params);
    return res;
  }
}
