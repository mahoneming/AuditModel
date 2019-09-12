import { Injectable } from '@angular/core';
import { RequestClientService } from '../request-client.service';
import { HOSTURL, PREFIX } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class UserManageService {

  constructor(private requestClientService: RequestClientService) { }

  public async GetUsers(params) {
    const res = await this.requestClientService.get(HOSTURL + `/api/services/${PREFIX}/User/GetUsers`, params);
    return res;
  }

  public async GetExcludeRoleUsers(params) {
    const res = await this.requestClientService.get(HOSTURL + `/api/services/${PREFIX}/User/GetExcludeRoleUsers`, params);
    return res;
  }

  public async BatchUpdateUserRole(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/User/BatchUpdateUserRole`, params);
    return res;
  }

  // 重置默认密码
  public async ResetPasswordByAdmin(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Account/ResetPasswordByAdmin`, params);
    return res;
  }

  // 创建或编辑人员
  public async CreateOrUpdateUser(params) {
    // tslint:disable-next-line: max-line-length
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/User/CreateOrUpdateUser`, params);
    return res;
  }
  
  // 删除人员
  public async DeleteUser(params) {
    // tslint:disable-next-line: max-line-length
    const res = await this.requestClientService.delete(HOSTURL + `/api/services/${PREFIX}/User/DeleteUser`, params);
    return res;
  }

  // 批量删除人员
  public async BatchDeleteUser(params) {
    // tslint:disable-next-line: max-line-length
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/User/BatchDeleteUser`, params);
    return res;
  }

  // 更改人员状态
  public async UpdateActiveStatus(params) {
    // tslint:disable-next-line: max-line-length
    const res = await this.requestClientService.put(HOSTURL + `/api/services/${PREFIX}/User/UpdateActiveStatus?userId=${params.userId}`, params);
    return res;
  }

  public async BatchCreateUserToRelations(params) {
    // tslint:disable-next-line: max-line-length
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/User/BatchCreateUserToRelations`, params);
    return res;
  }

  public async BatchRemoveUserOnRelations(params) {
    // tslint:disable-next-line: max-line-length
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/User/BatchRemoveUserOnRelations`, params);
    return res;
  } 

  public async QueryUserProjectRelationsPagedList(params) {
    // tslint:disable-next-line: max-line-length
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/User/QueryUserProjectRelationsPagedList`, params);
    return res;
  } 
}
