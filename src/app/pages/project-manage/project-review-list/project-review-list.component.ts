import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProjectListService } from 'src/app/services/project-manage/project-list.service';
import { ProjectInfoService } from 'src/app/services/project-manage/project-info.service';
import { AreaListService } from 'src/app/services/area-list.service';
import { Router } from '@angular/router';
import { ProjectListForm } from './project-review-list.model';

@Component({
  selector: 'app-project-review-list',
  templateUrl: './project-review-list.component.html',
  styleUrls: ['./project-review-list.component.scss']
})
export class ProjectReviewListComponent implements OnInit {
  public pageInfo = {
    nzPageIndex: 1,
    nzPageSize: 10,
    nzTotal: 0
  }
  public projectList = []
  public areaList = []
  public isModalVisible = false;
  public expandForm = false;
  validateSearchForm: FormGroup;

  constructor(
    private fbSearch: FormBuilder,
    private projectListService: ProjectListService,
    public projectInfoService: ProjectInfoService,
    private areaListService: AreaListService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm()
    this.initQuery()
  }

  async QueryProjectAuditPagedList(params) {
    const res = await this.projectListService.QueryProjectAuditPagedList(params)
    this.projectList = res.result.items
    this.pageInfo.nzTotal = res.result.totalCount
  }

  async QueryAreasPagedList() {
    const data = {
      status: 1,
      filter: undefined,
      creationTimeRange: undefined,
      sorting: undefined,
      maxResultCount: 100,
      skipCount: 0
    }
    const res = await this.areaListService.QueryAreasPagedList(data)
    this.areaList = res.result.items
  }

  initQuery() {
    this.QueryAreasPagedList()
    const data = new ProjectListForm({
      maxResultCount: this.pageInfo.nzPageSize,
      skipCount: this.pageInfo.nzPageIndex - 1
    })
    this.QueryProjectAuditPagedList(data)
  }

  initForm() {
    this.validateSearchForm = this.fbSearch.group({
      filter: [null, []],
      type: [null, []],
      // stage: [null, []],
      projectStatus: [null, []],
      auditStatus: [null, []],
      areaId: [null, []]
    });
  }

  findKeyByValue(list, value) {
    return this.projectInfoService.findKeyByValue(list, value)
  }

  routeTo(route, item) {
    // console.log(item)
    switch (route) {
      case 'detail':
        this.router.navigate([`/project-manage/project-detail`, item.id]);
        break;
      case 'group':
        this.router.navigate([`/project-manage/project-scenes`, item.id]);
        break;
      default:
        break;
    }
  }

  submitSearchForm(): void {
    for (const i in this.validateSearchForm.controls) {
      this.validateSearchForm.controls[i].markAsDirty();
      this.validateSearchForm.controls[i].updateValueAndValidity();
    }
    const value = {
      ...this.validateSearchForm.value,
      maxResultCount: this.pageInfo.nzPageSize,
      skipCount: 0
    }
    const data = new ProjectListForm({ ...value })
    this.QueryProjectAuditPagedList(data)
  }

  pageChange(index) {
    const data = new ProjectListForm({
      maxResultCount: this.pageInfo.nzPageSize,
      skipCount: index - 1,
      ...this.validateSearchForm.value
    })
    this.QueryProjectAuditPagedList(data)
  }

}
