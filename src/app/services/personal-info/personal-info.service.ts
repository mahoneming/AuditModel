import { Injectable } from '@angular/core';
import { RequestClientService } from '../request-client.service';
import { HOSTURL, PREFIX } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class PersonalInfoService {

  constructor(
    private requestClientService: RequestClientService
  ) { }

  // 获取登录人信息
  public async GetUsers(params) {
    const res = await this.requestClientService.get(HOSTURL + `/api/services/${PREFIX}/User/GetUsers`, params);
    return res;
  }
  // 修改个人信息
  public async UpdateUserProfile(params) {
    const res = await this.requestClientService.put(HOSTURL + `/api/services/${PREFIX}/Profile/UpdateUserProfile`, params);
    return res;
  }
}
