import { Injectable } from '@angular/core';
import { RequestClientService } from '../request-client.service';
import { HOSTURL, PREFIX } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class MajorManageService {

  constructor(
    private requestClientService: RequestClientService
  ) { }
  
  async QueryMajorsPagedList(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Systems/QueryMajorsPagedList`, params);
    return res;
  }

  async RemoveMajor(params) {
    const res = await this.requestClientService.delete(HOSTURL + `/api/services/${PREFIX}/Systems/RemoveMajor`, params);
    return res;
  }

  async CreateOrModifyMajor(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Systems/CreateOrModifyMajor`, params);
    return res;
  }
  
}
