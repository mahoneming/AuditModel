import { Injectable } from '@angular/core';
import { RequestClientService } from '../request-client.service';
import { HOSTURL, PREFIX } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class DepartmentManageService {

  constructor(
    private requestClientService: RequestClientService
  ) { }

  public async GetOrganizationUnits(params) {
    const res = await this.requestClientService.get(HOSTURL + `/api/services/${PREFIX}/OrganizationUnit/GetOrganizationUnits`, params);
    return res;
  }

  public async CreateOrganizationUnitExtend(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/OrganizationUnit/CreateOrganizationUnitExtend`, params);
    return res;
  }

  public async UpdateOrganizationUnitExtend(params) {
    const res = await this.requestClientService.put(HOSTURL + `/api/services/${PREFIX}/OrganizationUnit/UpdateOrganizationUnitExtend`, params);
    return res;
  }

  public async DeleteOrganizationUnit(params) {
    const res = await this.requestClientService.delete(HOSTURL + `/api/services/${PREFIX}/OrganizationUnit/DeleteOrganizationUnit`, params);
    return res;
  }

  public async GetOrganizationUnitUsers(params) {
    const res = await this.requestClientService.get(HOSTURL + `/api/services/${PREFIX}/OrganizationUnit/GetOrganizationUnitUsers`, params);
    return res;
  }
  
}
