import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'src/app/services/system-manage/user-manage.service';
import { listForm, addForm } from './expert-list.model';
import { RoleManageService } from 'src/app/services/system-manage/role-manage.service';
import { DepartmentManageService } from 'src/app/services/system-manage/department-manage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utils } from 'src/app/common/helper/util-helper';

@Component({
  selector: 'app-expert-list',
  templateUrl: './expert-list.component.html',
  styleUrls: ['./expert-list.component.scss']
})
export class ExpertListComponent implements OnInit {
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  validateAddForm: FormGroup;
  public userName = JSON.parse(window.localStorage.getItem('APDInfo'))['userName'];
  public listForm = new listForm();
  public addForm = new addForm();
  public isAddModal = false;
  public roleList = [];
  public organizeList = [];
  public pageIndex = 1;

  constructor(
    private userManageService: UserManageService,
    private roleManageService: RoleManageService,
    private departmentManageService: DepartmentManageService,
    private message: NzMessageService,
    private modal: NzModalService,
    private fbAdd: FormBuilder
  ) { }

  ngOnInit(): void {
    this.validateAddForm = this.fbAdd.group({
      userName: [null, [Validators.required]],
      name: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      EmailAddress: [null, [Validators.required]],
      organizationUnitsValue: [null, [Validators.required]],
      assignedRoleNamesValue: [null, [Validators.required]],
      password: [null, []],
      id: [null, []]
    });
    this.GetUsers(this.listForm)
    this.GetRoles()
    this.GetOrganizationUnits()
  }

  async GetUsers(data) {
    const res = await this.userManageService.GetUsers(data)
    this.listOfAllData = res.result.items
    this.listForm.nzTotal = res.result.totalCount
  }

  async GetOrganizationUnits() {
    const data = {
      MaxResultCount: 1000
    }
    const res = await this.departmentManageService.GetOrganizationUnits(data)
    this.organizeList = res.result.items
  }

  async GetRoles() {
    const data = {
      MaxResultCount: 1000
    }
    const res = await this.roleManageService.GetRoles(data)
    this.roleList = res.result.items
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

  async handleAddOk() {
    for (const i in this.validateAddForm.controls) {
      this.validateAddForm.controls[i].markAsDirty();
      this.validateAddForm.controls[i].updateValueAndValidity();
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
        password: value.password,
        isActive: true,
        isLockoutEnabled: false,
        isTwoFactorEnabled: false,
        shouldChangePasswordOnNextLogin: false,
        id: value.id
      },
      assignedRoleNamesValue: value.assignedRoleNamesValue,
      organizationUnitsValue: value.organizationUnitsValue,
      assignedRoleNames: [value.assignedRoleNamesValue],
      organizationUnits: [value.organizationUnitsValue]
    })
    // 组织架构查找是否有父级
    data.organizationUnits = this.deepFindOragnizeList(data.organizationUnitsValue, this.organizeList, data.organizationUnits)
    const res = await this.userManageService.CreateOrUpdateUser(data)
    if (res.success) {
      this.GetUsers(this.listForm)
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
      id: item.id
    }
    // console.log(data)
    this.validateAddForm.patchValue(data)
    // console.log(this.validateAddForm.value)
    this.isAddModal = true
  }

  resetModalForm() {
    this.validateAddForm.reset()
    this.isAddModal = false
  }

  /**
   * @param currentid 当前选择部门的ID
   * @param arr 后台获取的所有部门数据
   * @param res 返回的 ID 数组
   */
  deepFindOragnizeList(currentid, arr, res) {
    if (arr != null) {
      arr.forEach((ele) => {
        if (ele.id === currentid) {
          if (ele.parentId) {
            res.push(ele.parentId);
            this.deepFindOragnizeList(ele.parentId, arr, res);
          } else {
            return
          }
        }
      });
    }
    return res;
  }

  pageChange(index) {
    this.listForm.SkipCount = index - 1
    this.GetUsers(this.listForm)
  }

  resetPassword(item) {
    this.modal.confirm({
      nzTitle: '重置密码 ?',
      nzContent: '确认要重置该账号的密码吗？<b style="color: red;">重置后密码为当前账号</b>',
      nzOkText: '确定',
      nzOnOk: async () => {
        const data = {
          userId: item.id
        }
        const res = await this.userManageService.ResetPasswordByAdmin(data)
        if (res.success) {
          this.message.success('重置成功')
          this.GetUsers(this.listForm)
        }
      },
      nzCancelText: '取消',
      nzOnCancel: () => { }
    });
  }

  removeUser(item) {
    this.modal.error({
      nzTitle: '确认要删除该项吗?',
      nzContent: '<b style="color: red;">删除后不能恢复，请谨慎操作。</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: async () => {
        const data = {
          Id: item.id
        }
        const res = await this.userManageService.DeleteUser(data)
        if (res.success) {
          this.message.success('删除成功')
          this.GetUsers(this.listForm)
        }
      },
      nzCancelText: '取消',
      nzOnCancel: () => { }
    });
  }

  batchRemoveUser() {
    const mapOfCheckedId = this.mapOfCheckedId
    let temp = []
    for (const key in mapOfCheckedId) {
      if (mapOfCheckedId.hasOwnProperty(key)) {
        temp.push(key)
      }
    }
    if (temp.length) {
      this.modal.error({
        nzTitle: '确认要批量删除所选项吗?',
        nzContent: '<b style="color: red;">删除后不能恢复，请谨慎操作。</b>',
        nzOkText: '确定',
        nzOkType: 'danger',
        nzOnOk: async () => {
          const res = await this.userManageService.BatchDeleteUser(temp)
          if (res.success) {
            this.message.success('删除成功')
            this.GetUsers(this.listForm)
          }
        },
        nzCancelText: '取消',
        nzOnCancel: () => { }
      });
    } else {
      this.message.error('请选择删除的用户')
    }
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
