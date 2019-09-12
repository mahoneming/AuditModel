import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectListService } from 'src/app/services/project-manage/project-list.service';
import { AreaListService } from 'src/app/services/area-list.service';
import { ProjectListForm, ProjectAddForm } from './project-list.model';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { ProjectInfoService } from 'src/app/services/project-manage/project-info.service';
import { apiPath } from 'src/app/config';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  public pageInfo = {
    nzPageIndex: 1,
    nzPageSize: 10,
    nzTotal: 0
  }
  public projectList = []
  public areaList = []
  public isModalVisible = false;
  public expandForm = false;
  public isStageDisabled = false;
  public apiPath = apiPath;
  validateSearchForm: FormGroup;
  validateAddForm: FormGroup;

  constructor(
    private fbSearch: FormBuilder,
    private fbAdd: FormBuilder,
    private projectListService: ProjectListService,
    public projectInfoService: ProjectInfoService,
    private areaListService: AreaListService,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.projectInfoService.filterStageByRole()
    this.initForm()
    this.initQuery()
  }

  async QueryProjectPagedList(params) {
    const res = await this.projectListService.QueryProjectPagedList(params)
    this.projectList = res.result.items
    this.pageInfo.nzTotal = res.result.totalCount
  }

  async CreateOrModifyProject(params) {
    const res = await this.projectListService.CreateOrModifyProject(params)
    if (res.success) {
      this.message.success('操作成功')
    } else {
      return
    }
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

  async removeProject(item) {
    this.modal.error({
      nzTitle: '确认要删除该项吗?',
      nzContent: '<b style="color: red;">删除后不能恢复，请谨慎操作。</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: async () => {
        const data = {
          Id: item.id
        }
        const res = await this.projectListService.RemoveProject(data)
        if (res.success) {
          this.message.success('删除成功')
          this.initQuery()
        }
      },
      nzCancelText: '取消',
      nzOnCancel: () => { }
    });
  }

  async submitAddForm() {
    for (const i in this.validateAddForm.controls) {
      this.validateAddForm.controls[i].markAsDirty();
      this.validateAddForm.controls[i].updateValueAndValidity();
    }
    if (!this.validateAddForm.valid) {
      return
    }
    const value = this.validateAddForm.value
    // console.log(value)
    const data = new ProjectAddForm({ ...value })
    await this.CreateOrModifyProject(data)
    await this.initQuery()
    this.isModalVisible = false
    this.validateAddForm.reset()
  }

  findKeyByValue(list, value) {
    return this.projectInfoService.findKeyByValue(list, value)
  }

  routeTo(route, item) {
    switch (route) {
      case 'detail':
        this.router.navigate([`/project-manage/project-detail`, item.id]);
        break;
      case 'group':
        this.router.navigate([`/project-manage/project-scenes`, item.id], { queryParams: { auditStatus: item.auditStatus } });
        break;
      default:
        break;
    }
  }

  submitSearchForm(): void {
    // console.log(11111)
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
    this.QueryProjectPagedList(data)
  }

  cancelAddForm() {
    this.isModalVisible = false;
    this.validateAddForm.reset()
  }

  editProject(item) {
    // console.log(item)
    if (Object.keys(item).length !== 0 && item.constructor === Object) {
      // 编辑，true表示为空对象，false为非空对象
      item = {
        ...item,
        auditStatus: item.auditStatus.toString(),
        stage: item.stage.toString(),
        isImportant: item.isImportant.toString(),
        mark: item.mark.toString(),
        projectStatus: item.projectStatus.toString(),
        type: item.type.toString()
      }
    }
    // this.validateAddForm.patchValue(new ProjectAddForm(item))
    // console.log(this.validateAddForm.value)
    this.validateAddForm.patchValue(item)
    if (item.auditStatus > 1) this.isStageDisabled = true
    this.isModalVisible = true
  }

  pageChange(index) {
    const data = new ProjectListForm({
      maxResultCount: this.pageInfo.nzPageSize,
      skipCount: index - 1,
      ...this.validateSearchForm.value
    })
    this.QueryProjectPagedList(data)
  }

  initQuery() {
    this.QueryAreasPagedList()
    const data = new ProjectListForm({
      maxResultCount: this.pageInfo.nzPageSize,
      skipCount: this.pageInfo.nzPageIndex - 1
    })
    this.QueryProjectPagedList(data)
  }

  initForm() {
    this.validateSearchForm = this.fbSearch.group({
      filter: [null, []],
      type: [null, []],
      stage: [null, []],
      projectStatus: [null, []],
      auditStatus: [null, []],
      areaId: [null, []]
    });
    this.validateAddForm = this.fbAdd.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      areaId: [null, []],
      type: ['10', []],
      stage: ['1', []],
      projectStatus: ['1', []],
      description: [null, []],
      takeLimit: [null, []],
      totalAmount: [null, []],
      organizationName: [null, []],
      companyName: [null, []],
      companyContacts: [null, []],
      companyPhoneNumber: [null, []],
      companyAddress: [null, []],
      isImportant: ['2', []],
      // isApprove: ['2', []],
      mark: ['2', []],
      id: [null, []]
    });
  }
}
