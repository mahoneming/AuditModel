import { Component, OnInit } from '@angular/core';
import { ProjectDetailService } from 'src/app/services/project-manage/project-detail.service';
import { Params, ActivatedRoute } from '@angular/router';
import { ProjectInfoService } from 'src/app/services/project-manage/project-info.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {

  public projectId: string = ''
  public projectDetail: any;
  public isCardLoading: boolean = true;

  constructor(
    private projectDetailService: ProjectDetailService,
    private routerinfo: ActivatedRoute,
    public projectInfoService: ProjectInfoService,
  ) {
    this.routerinfo.params.subscribe((params: Params) => {
      this.projectId = params['projectId']
    })
  }

  ngOnInit() {
    this.QueryProjectDetailById()
  }

  findKeyByValue(list, value) {
    return this.projectInfoService.findKeyByValue(list, value)
  }

  async QueryProjectDetailById() {
    const data = {
      id: this.projectId
    }
    const res = await this.projectDetailService.QueryProjectDetailById(data)
    this.projectDetail = res.result
    this.isCardLoading = false
  }

}
