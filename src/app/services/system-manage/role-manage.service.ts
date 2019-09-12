import { Injectable } from '@angular/core';
import { RequestClientService } from '../request-client.service';
import { HOSTURL, PREFIX } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class RoleManageService {

  constructor(private requestClientService: RequestClientService) { }

  public async GetRoles(params) {
    const res = await this.requestClientService.get(HOSTURL + `/api/services/${PREFIX}/Role/GetRoles`, params);
    return res;
  }

  public async CreateOrUpdateRole(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Role/CreateOrUpdateRole`, params);
    return res;
  }

  public async DeleteRole(params) {
    const res = await this.requestClientService.delete(HOSTURL + `/api/services/${PREFIX}/Role/DeleteRole`, params);
    return res;
  }

  public async GetRoleForEdit(params?) {
    const res = await this.requestClientService.get(HOSTURL + `/api/services/${PREFIX}/Role/GetRoleForEdit`, params);
    return res;
  }

}
