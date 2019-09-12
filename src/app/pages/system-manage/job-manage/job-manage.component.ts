import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JobManageService } from 'src/app/services/job-manage/job-manage.service';
import { listForm } from './job-manage.model';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Utils } from 'src/app/common/helper/util-helper';

@Component({
  selector: 'app-job-manage',
  templateUrl: './job-manage.component.html',
  styleUrls: ['./job-manage.component.scss']
})
export class JobManageComponent implements OnInit {
  validateForm: FormGroup;
  public pageInfo = {
    nzPageIndex: 0,
    nzPageSize: 10,
    nzTotal: 100
  }
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  public listForm = new listForm()
  public tableList = []
  public isAddVisible = false;
  public status = [{
    name: '启用',
    value: '1'
  }, {
    name: '禁用',
    value: '2'
  }]
  public pageIndex = 1;

  constructor(
    private fb: FormBuilder,
    private jobManageService: JobManageService,
    private message: NzMessageService,
    private modal: NzModalService
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      status: ['1', [Validators.required]],
      sort: [0, []],
      id: [null, []]
    });
    this.QueryPositionsPagedList()
  }

  async QueryPositionsPagedList() {
    this.pageIndex = 1
    this.listForm.SkipCount = 0
    const res = await this.jobManageService.QueryPositionsPagedList(this.listForm)
    this.tableList = res.result.items
    this.listForm.nzTotal = res.result.totalCount
  }

  async CreateOrModifyMajor(data) {
    const res = await this.jobManageService.CreateOrModifyPosition(data)
    if (res.success) {
      this.message.success('操作成功')
      this.QueryPositionsPagedList()
    }
    this.isAddVisible = false
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (!this.validateForm.valid) {
      return
    }
    const value = this.validateForm.value
    if (!value.id) delete value.id
    this.CreateOrModifyMajor(value)
  }

  editMarjor(item) {
    const data = { ...item }
    data.status = data.status.toString()
    this.validateForm.patchValue(data)
    this.isAddVisible = true
  }

  removeMarjor(item) {
    this.modal.error({
      nzTitle: '确认要删除该项吗?',
      nzContent: '<b style="color: red;">删除后不能恢复，请谨慎操作。</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: async () => {
        const data = {
          Id: item.id
        }
        const res = await this.jobManageService.RemovePosition(data)
        if (res.success) {
          this.message.success('删除成功')
          this.QueryPositionsPagedList()
        }
      },
      nzCancelText: '取消',
      nzOnCancel: () => { }
    });
  }

  resetForm() {
    this.validateForm.reset()
    this.isAddVisible = false
  }

  keyupEvent(e) {
    Utils.enter(e, this.searchItem.bind(this));
  }

  searchItem() {
    this.QueryPositionsPagedList()
  }

  pageChange(index) {
    this.listForm.SkipCount = index - 1
    this.QueryPositionsPagedList()
  }

  currentPageDataChange($event): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every((item) => this.mapOfCheckedId[item.id]);
    this.isIndeterminate =
      this.listOfDisplayData.some((item) => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach((item) => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }

}
