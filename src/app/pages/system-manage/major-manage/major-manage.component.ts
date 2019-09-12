import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { listForm } from './major-manage.model';
import { MajorManageService } from 'src/app/services/major-manage/major-manage.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Utils } from 'src/app/common/helper/util-helper';

@Component({
  selector: 'app-major-manage',
  templateUrl: './major-manage.component.html',
  styleUrls: ['./major-manage.component.scss']
})
export class MajorManageComponent implements OnInit {
  validateForm: FormGroup;
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
    private majorManageService: MajorManageService,
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
    this.QueryMajorsPagedList()
  }

  async QueryMajorsPagedList() {
    this.pageIndex = 1
    this.listForm.SkipCount = 0
    const res = await this.majorManageService.QueryMajorsPagedList(this.listForm)
    this.tableList = res.result.items
    this.listForm.nzTotal = res.result.totalCount
  }

  async CreateOrModifyMajor(data) {
    const res = await this.majorManageService.CreateOrModifyMajor(data)
    if (res.success) {
      this.message.success('操作成功')
      this.QueryMajorsPagedList()
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
        const res = await this.majorManageService.RemoveMajor(data)
        if (res.success) {
          this.message.success('删除成功')
          this.QueryMajorsPagedList()
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
    this.QueryMajorsPagedList()
  }

  pageChange(index) {
    this.listForm.SkipCount = index - 1
    this.QueryMajorsPagedList()
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
