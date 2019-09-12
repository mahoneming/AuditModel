import { Component, OnInit } from '@angular/core';
import { listForm, addForm } from './interface-user.model';
import { UserManageService } from 'src/app/services/system-manage/user-manage.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/common/helper/util-helper';

@Component({
  selector: 'app-interface-user',
  templateUrl: './interface-user.component.html',
  styleUrls: ['./interface-user.component.scss']
})
export class InterfaceUserComponent implements OnInit {
  validateAddForm: FormGroup;
  public listForm = new listForm();
  public isAddModal = false;
  public tableList = [];
  public pageIndex = 1;
  // 类型
  public type = [
    { key: '全部', value: '0' },
    { key: '主机管理员', value: '1' },
    { key: '租户管理员', value: '2' },
    { key: '一般租户', value: '3' },
    { key: '接口租户', value: '4' }
  ]
  passwordVisible = false;

  constructor(
    private userManageService: UserManageService,
    private message: NzMessageService,
    private fbAdd: FormBuilder
  ) { }

  ngOnInit() {
    this.validateAddForm = this.fbAdd.group({
      userName: [null, [Validators.required]],
      name: [null, [Validators.required]],
      EmailAddress: [null, [Validators.required]],
      phoneNumber: [null, Validators.required],
      id: [null, []],
      password: [null, []]
    });
    this.GetUsers(this.listForm)
  }

  async GetUsers(data) {
    let params = {
      ...data,
      type: 4
    }
    const res = await this.userManageService.GetUsers(params)
    if (res.success) {
      this.tableList = res.result.items
      this.listForm.nzTotal = res.result.totalCount
    }
  }

  async UpdateActiveStatus(item) {
    // console.log(item)
    const res = await this.userManageService.UpdateActiveStatus({userId: item.id})
    if (res.success) {
      this.message.success('切换成功')
    }
  }

  keyupEvent(e) {
    Utils.enter(e, this.searchItem.bind(this));
  }

  searchItem() {
    this.pageIndex = 1
    this.listForm.SkipCount = 0
    this.GetUsers(this.listForm)
  }

  pageChange(index) {
    this.listForm.SkipCount = index - 1
    this.GetUsers(new listForm({ SkipCount: index - 1 }))
  }

  findKeyByValue(list, value) {
    const res = list.find((item) => item.value == value)
    return res ? res.key : '-'
  }

  async handleAddOk() {
    for (const i in this.validateAddForm.controls) {
      if (this.validateAddForm.controls.hasOwnProperty(i)) {
        this.validateAddForm.controls[i].markAsDirty();
        this.validateAddForm.controls[i].updateValueAndValidity();
      }
    }
    if (!this.validateAddForm.valid) {
      return
    }
    const value = this.validateAddForm.value
    // console.log(value)
    const data = new addForm({
      user: {
        EmailAddress: value.EmailAddress,
        name: value.name,
        userName: value.userName,
        surname: value.userName,
        phoneNumber: value.phoneNumber,
        type: 4,
        password: value.password,
        isActive: true,
        isLockoutEnabled: false,
        isTwoFactorEnabled: false,
        shouldChangePasswordOnNextLogin: false,
        positionId: value.positionId,
        majorId: value.majorId,
        id: value.id
      },
      assignedRoleNamesValue: value.assignedRoleNamesValue,
      organizationUnitsValue: value.organizationUnitsValue,
      assignedRoleNames: ['SYSTEM_InterfaceRole1'],
      organizationUnits: []
    })
    // 组织架构查找是否有父级
    // data.organizationUnits = this.deepFindOragnizeList(data.organizationUnitsValue, this.organizeList, data.organizationUnits)
    const res = await this.userManageService.CreateOrUpdateUser(data)
    if (res.success) {
      this.GetUsers(new listForm())
      this.isAddModal = false
      this.validateAddForm.reset()
      this.message.success('操作成功')
    }
  }

  editUser(item) {
    const data = {
      EmailAddress: item.emailAddress,
      name: item.name,
      userName: item.userName,
      phoneNumber: item.phoneNumber,
      assignedRoleNamesValue: item.roles.length > 0 ? item.roles[0].name : '',
      organizationUnitsValue: item.organizationUnitId,
      positionId: item.positionId,
      majorId: item.majorId,
      id: item.id
    }
    this.validateAddForm.patchValue(data)
    // console.log(this.validateAddForm.value)
    this.isAddModal = true
  }

  resetModalForm() {
    this.validateAddForm.reset()
    this.isAddModal = false
  }

}
