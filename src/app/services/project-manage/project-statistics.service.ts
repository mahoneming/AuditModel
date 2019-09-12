import { Injectable } from '@angular/core';
import { HOSTURL, PREFIX } from 'src/app/config';
import { RequestClientService } from '../request-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectStatisticsService {

  constructor(private requestClientService: RequestClientService) { }

  public async QueryProjectsMonthReport(params) {
    const res = await this.requestClientService.post(HOSTURL + `/api/services/${PREFIX}/Reports/QueryProjectsMonthReport`, params);
    return res;
  }
}
