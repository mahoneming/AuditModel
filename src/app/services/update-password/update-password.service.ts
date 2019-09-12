import { Injectable } from '@angular/core';
import { RequestClientService } from '../request-client.service';
import { HOSTURL, PREFIX } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class UpdatePasswordService {

  constructor(
    private requestClientService: RequestClientService
  ) { }

  // 修改密码
  public async ChangePassword(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Profile/ChangePassword`, params);
    return res;
  }

  public async ChangePasswordOnFirstLogin(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Account/ChangePasswordOnFirstLogin`, params);
    return res;
  }
}
