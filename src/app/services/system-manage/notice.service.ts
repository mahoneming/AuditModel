import { Injectable } from '@angular/core';
import { RequestClientService } from '../request-client.service';
import { HOSTURL, PREFIX } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  constructor(private requestClientService: RequestClientService) { }

  // 获取公告列表(非管理员)
  public async QueryMyPagedList(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Notices/QueryMyPagedList`, params);
    return res;
  }
  // 获取公告列表(管理员)
  public async QueryPagedList(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Notices/QueryPagedList`, params);
    return res;
  }

  public async Create(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Notices/Create`, params);
    return res;
  }
  public async MarkHideOrShow(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Notices/MarkHideOrShow`, params);
    return res;
  }

  // 删除自己的公告(非管理员)
  public async BatchRemoveByCurrentUser(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Notices/BatchRemoveByCurrentUser`, params);
    return res;
  }
  // 删除公告(管理员)
  public async BatchRemove(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Notices/BatchRemove`, params);
    return res;
  }
  // 公告详情
  public async QueryDetailById(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Notices/QueryDetailById`, params);
    return res;
  }
  // 标记为已读
  public async BatchMarkRead(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Notices/BatchMarkRead`, params);
    return res;
  }


}
