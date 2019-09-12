import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectGroupService } from 'src/app/services/project-manage/project-group.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Params } from '@angular/router';
import { AssignManageService } from 'src/app/services/project-manage/assign-manage.service';
import { apiPath } from 'src/app/config';

@Component({
  selector: 'app-project-model',
  templateUrl: './project-model.component.html',
  styleUrls: ['./project-model.component.scss']
})
export class ProjectModelComponent implements OnInit {
  public isReviewVisible = false;
  public validateReviewForm: FormGroup;
  public modelGroupId: string;
  public projectId: string;
  public type: string;
  public primaryId = JSON.parse(window.localStorage.getItem('APDInfo'))['primaryId'];
  public isReviewShow = false

  constructor(
    private projectGroupService: ProjectGroupService,
    private assignManageService: AssignManageService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private routerinfo: ActivatedRoute
  ) {
    this.routerinfo.params.subscribe((params: Params) => {
      this.modelGroupId = params['modelGroupId']
      this.projectId = params['projectId']
    })
    this.routerinfo.queryParams.subscribe((queryParams: Params) => {
      this.type = queryParams['type']
    })
  }

  ngOnInit() {
    this.validateReviewForm = this.fb.group({
      descr: [null, [Validators.required]],
      status: [null, [Validators.required]]
    });
    this.hasModelReview()
    // console.log(this.routerinfo)
  }

  async AuditProjectGroup() {
    const data = {
      modelGroupId: this.modelGroupId,
      userId: JSON.parse(window.localStorage.getItem('APDInfo'))['primaryId'],
      status: this.validateReviewForm.value.status,
      descr: this.validateReviewForm.value.descr,
      projectId: this.projectId
    }
    const res = await this.projectGroupService.AuditProjectGroup(data)
    if (res.success) {
      this.message.success('审核完成')
      this.hasModelReview()
    }
    this.isReviewVisible = false
  }

  async hasModelReview() {
    // console.log(item)
    const data = {
      projectId: this.projectId,
      modelGroupId: this.modelGroupId,
      userId: this.primaryId,
      maxResultCount: 1000,
      skipCount: 0
    }
    const res = await this.assignManageService.QueryProjectAuditUsersPagedList(data)
    if (res.success) {
      // console.log(this.type)
      const items = res.result.users.items
      // console.log(apiPath === 'audit')
      // console.log((items.length && (items[0].status === 1 || items[0].status === 2)))
      // console.log(this.type !== '1')
      if (apiPath !== 'audit' || (items.length && (items[0].status === 1 || items[0].status === 2)) || this.type !== '1') {
        // 不是audit平台|是通过，是未通过|type不是从其他系统推送过来审核的
        this.isReviewShow = false
      } else {
        // 未审核，超时
        this.isReviewShow = true
      }
    }
  }

  // 审核
  reviewProject(item) {
    // console.log(item)
    this.modelGroupId = item.id
    this.isReviewVisible = true
  }

  submitReview() {
    for (const i in this.validateReviewForm.controls) {
      if (this.validateReviewForm.controls.hasOwnProperty(i)) {
        this.validateReviewForm.controls[i].markAsDirty();
        this.validateReviewForm.controls[i].updateValueAndValidity();
      }
    }
    if (!this.validateReviewForm.valid) {
      return
    }
    this.AuditProjectGroup()
  }

}
