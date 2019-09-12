import { Injectable } from '@angular/core';
import { HOSTURL, PREFIX } from '../../config';
import { RequestClientService } from '../request-client.service';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(
    private requestClientService: RequestClientService
  ) { }

  // 身份认证
  public async isTenantAvailable(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/TokenAuth/IsTenantAvailable`, params);
    return res;
  }
  // 获取文件服务token
  public async getTokenInfo(params?) {
    const res = await this.requestClientService.get(HOSTURL + `/api/services/${PREFIX}/Session/GetTokenInfo`, params);
    return res;
  }
  // 登录
  public async authenticate(params, header?) {
    const res = await this.requestClientService.post(HOSTURL + '/api/TokenAuth/Authenticate', params, header);
    return res;
  }
  // 退出
  public async logout() {
    const res = await this.requestClientService.get(HOSTURL + '/api/TokenAuth/LogOut', {});
    return res;
  }
  // 权限
  public async getAll() {
    const res = await this.requestClientService.get(HOSTURL + `/api/services/${PREFIX}/Account/GetAll`, {}, {
      '.AspNetCore.Culture': 'c=zh-Hans|uic=zh-Hans',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      // 'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
      'Abp.TenantId': window.localStorage.getItem('TenantId')
    });
    return res;
  }

}
