import { Component, OnInit } from '@angular/core';
import { NoticeService } from 'src/app/services/system-manage/notice.service';
import { noticeModel } from './notice.model';
import { DepartmentManageService } from 'src/app/services/system-manage/department-manage.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Utils } from 'src/app/common/helper/util-helper';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {
  public isAddVisible = false;
  public isDetailVisible = false;
  public addNoticeModel = new noticeModel();
  public userInfo: any = JSON.parse(window.localStorage.getItem('APDInfo'));
  public isAdminUser = true;
  public listForm = {
    SkipCount: 0,
    Filter: undefined,
    MaxResultCount: 10,
    nzTotal: 0
  }
  public tableInfo = []
  public tableDetailInfo: any = {};
  public departmentList = []
  public pageIndex = 1
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private noticeService: NoticeService,
    private departmentManageService: DepartmentManageService,
    private message: NzMessageService,
    private modal: NzModalService
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      organizationUnitId: [null, []],
    });
    this.getOrganizations()
    this.getNoticeList()
  }

  getNoticeList() {
    this.pageIndex = 1
    if (this.userInfo.roleCode === 'SYSTEM_Admin') {
      this.isAdminUser = true
      this.getAdminNotices(this.listForm)
    } else {
      this.isAdminUser = false
      this.getNotices(this.listForm)
    }
  }

  async getAdminNotices(data) {
    const res = await this.noticeService.QueryPagedList(data)
    this.tableInfo = res.result.items
    this.listForm.nzTotal = res.result.totalCount
    // console.log(this.listForm)
  }

  async getNotices(data) {
    const res = await this.noticeService.QueryMyPagedList(data)
    this.tableInfo = res.result.items
    this.listForm.nzTotal = res.result.totalCount
  }

  async getOrganizations() {
    const res = await this.departmentManageService.GetOrganizationUnits({ MaxResultCount: 1000, SkipCount: 0 });
    this.departmentList = res.result.items;
  }

  async statusChange(item) {
    const res = await this.noticeService.MarkHideOrShow({ id: item.id })
    if (res.success) {
      this.message.success('切换成功')
    }
  }

  async QueryDetailById(item) {
    const res = await this.noticeService.QueryDetailById({ id: item.id })
    await this.noticeService.BatchMarkRead([item.id])
    this.tableDetailInfo = res.result
    this.isDetailVisible = true
  }

  searchItem() {
    this.getNoticeList()
  }

  keyupEvent(e) {
    Utils.enter(e, this.searchItem.bind(this));
  }

  removeNotice(item) {
    this.modal.error({
      nzTitle: '确认要删除该项吗?',
      nzContent: '<b style="color: red;">删除后不能恢复，请谨慎操作。</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: async () => {
        const data = [item.id];
        let res
        if (this.userInfo.roleCode === 'SYSTEM_Admin') {
          res = await this.noticeService.BatchRemove(data)
        } else {
          res = await this.noticeService.BatchRemoveByCurrentUser(data)
        }
        if (res.success) {
          this.message.success('删除成功')
        }
        this.getNoticeList()
      },
      nzCancelText: '取消',
      nzOnCancel: () => { }
    });
  }

  async handleAddOk() {
    // console.log(this.addNoticeModel)
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (!this.validateForm.valid) {
      return
    }
    const data = new noticeModel({ ...this.validateForm.value })
    let res = await this.noticeService.Create(data)
    if (res.success) {
      this.message.success('发布成功')
    }
    this.isAddVisible = false
    this.getAdminNotices(this.listForm)
    this.validateForm.reset()
  }

  pageChange(index) {
    this.listForm.SkipCount = index - 1
    this.getAdminNotices(this.listForm)
  }
}
