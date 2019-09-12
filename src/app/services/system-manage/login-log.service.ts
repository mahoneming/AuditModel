import { Injectable } from '@angular/core';
import { RequestClientService } from '../request-client.service';
import { HOSTURL, PREFIX } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class LoginLogService {

  constructor(private requestClientService: RequestClientService) { }

  public async QueryRecentUserLoginAttemptsPagedList(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/UserLogin/QueryRecentUserLoginAttemptsPagedList`, params);
    return res;
  }
}
