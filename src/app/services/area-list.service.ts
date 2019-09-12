import { Injectable } from '@angular/core';
import { RequestClientService } from './request-client.service';
import { HOSTURL, PREFIX } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class AreaListService {

  constructor(
    private requestClientService: RequestClientService
  ) { }

  // 获取区域信息
  public async QueryAreasPagedList({ status, filter, creationTimeRange, sorting, maxResultCount, skipCount }) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Systems/QueryAreasPagedList`, { status, filter, creationTimeRange, sorting, maxResultCount, skipCount });
    return res;
  }

  public async CreateOrModifyArea(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Systems/CreateOrModifyArea`, params);
    return res;
  }

  public async RemoveArea(params) {
    const res = await this.requestClientService.delete(HOSTURL + `/api/services/${PREFIX}/Systems/RemoveArea`, params);
    return res;
  }
}
