import { Component, OnInit, ViewChild } from '@angular/core';
import { NzFormatEmitEvent, NzTreeComponent, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'src/app/services/system-manage/user-manage.service';
import { listForm, addForm } from './user-manage.model';
import { RoleManageService } from 'src/app/services/system-manage/role-manage.service';
import { DepartmentManageService } from 'src/app/services/system-manage/department-manage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MajorManageService } from 'src/app/services/major-manage/major-manage.service';
import { JobManageService } from 'src/app/services/job-manage/job-manage.service';
import { Utils } from 'src/app/common/helper/util-helper';
import { AreaListService } from 'src/app/services/area-list.service';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.scss']
})
export class UserManageComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent: NzTreeComponent;
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  nodes = [];
  passwordVisible = false;
  validateAddForm: FormGroup;
  listOfOption: Array<{ code: string; name: string; value: string }> = [];
  listOfSelectedValue = []; // 新增、删除后的数组
  public userName = JSON.parse(window.localStorage.getItem('APDInfo'))['userName'];
  public listForm = new listForm();
  public isAddModal = false;
  public roleList = [];
  public organizeList = [];
  public positionList = [];
  public majorList = [];
  public pageIndex = 1;
  public isAreaModal = false
  public setAreaUserId: string;
  public listOfSelectedValueTotal = [] // 原数组
  public loading = true

  constructor(
    private userManageService: UserManageService,
    private roleManageService: RoleManageService,
    private departmentManageService: DepartmentManageService,
    private majorManageService: MajorManageService,
    private jobManageService: JobManageService,
    private areaListService: AreaListService,
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
      majorId: [null, []],
      positionId: [null, []],
      password: [null, []],
      id: [null, []]
    });
    this.GetUsers(this.listForm)
    this.GetRoles()
    this.GetOrganizationUnits()
    this.QueryPositionsPagedList()
    this.QueryMajorsPagedList()
    this.QueryAreasPagedList()
    // console.log(this.listForm)
  }

  async GetUsers(data) {
    // console.log(data)
    const res = await this.userManageService.GetUsers(data)
    this.listOfAllData = res.result.items
    this.listForm.nzTotal = res.result.totalCount
  }

  async GetRoles() {
    const data = {
      MaxResultCount: 1000
    }
    const res = await this.roleManageService.GetRoles(data)
    this.roleList = res.result.items
  }

  async GetOrganizationUnits() {
    const data = {
      MaxResultCount: 1000
    }
    const res = await this.departmentManageService.GetOrganizationUnits(data)
    this.organizeList = (res.result.items).slice()
    this.nodes = this.transformTreeNode(res.result.items)
    this.loading = false
  }

  async QueryPositionsPagedList() {
    this.listForm.SkipCount = 0
    const res = await this.jobManageService.QueryPositionsPagedList(this.listForm)
    this.positionList = res.result.items
  }

  async QueryMajorsPagedList() {
    this.listForm.SkipCount = 0
    const res = await this.majorManageService.QueryMajorsPagedList(this.listForm)
    this.majorList = res.result.items
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
    let temp = []
    res.result.items.forEach((element) => {
      if (element.code !== '') {
        temp.push({
          code: element.code,
          name: element.name,
          value: element.id
        })
      }
    });
    this.listOfOption = temp
    // this.areaList = res.result.items
  }

  async UpdateActiveStatus(item) {
    // console.log(item)
    const res = await this.userManageService.UpdateActiveStatus({ userId: item.id })
    if (res.success) {
      this.message.success('切换成功')
    }
  }

  async BatchCreateUserToRelations(params) {
    const res = await this.userManageService.BatchCreateUserToRelations(params)
    if (res.success) {
      this.message.success('关联成功')
      this.isAreaModal = false
    }
  }

  async BatchRemoveUserOnRelations(params) {
    const res = await this.userManageService.BatchRemoveUserOnRelations(params)
    if (res.success) {
      // this.message.success('删除成功')
    }
  }

  async QueryUserProjectRelationsPagedList(params) {
    let temp = []
    const res = await this.userManageService.QueryUserProjectRelationsPagedList(params)
    if (res.success) {
      res.result.items.forEach((element) => {
        temp.push(element.primaryId)
      });
      this.listOfSelectedValue = temp
      this.listOfSelectedValueTotal = temp
      this.isAreaModal = true
      // this.message.success('关联成功')
    }
  }

  async setArea(item) {
    this.setAreaUserId = item.primaryId
    const data = {
      userId: item.primaryId,
      type: 1,
      maxResultCount: 100,
      skipCount: 0
    }
    this.QueryUserProjectRelationsPagedList(data)
  }

  // 查找两个数组不同元素（用于删除
  getArrayDifference(arr1, arr2) {
    return arr1.concat(arr2).filter(function (v, i, arr) {
      return arr.indexOf(v) === arr.lastIndexOf(v);
    });
  }

  handleSettingAreaOk() {
    const createData = {
      userId: this.setAreaUserId,
      type: 1,
      idList: this.listOfSelectedValue
    }
    this.BatchCreateUserToRelations(createData)
    let deleteItem = this.getArrayDifference(this.listOfSelectedValueTotal, this.listOfSelectedValue)
    const deleteData = {
      userId: this.setAreaUserId,
      type: 1,
      idList: deleteItem
    }
    this.BatchRemoveUserOnRelations(deleteData)
  }

  handleCancel() {
    this.listOfSelectedValue = []
    this.isAreaModal = false
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
      assignedRoleNames: [value.assignedRoleNamesValue],
      organizationUnits: [value.organizationUnitsValue]
    })
    // 组织架构查找是否有父级
    data.organizationUnits = this.deepFindOragnizeList(data.organizationUnitsValue, this.organizeList, data.organizationUnits)
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

  handleTreeCheck(event: NzFormatEmitEvent): void {
    // console.log(event);
    let data
    if (event.keys.length) {
      data = new listForm({ OrganizationUnitPrimaryId: event.node.origin.primaryId })
    } else {
      data = new listForm()
    }
    this.GetUsers(data)
  }

  pageChange(index) {
    this.listForm.SkipCount = index - 1
    this.GetUsers(new listForm({ SkipCount: index - 1 }))
  }

  resetPassword(item) {
    this.modal.confirm({
      nzTitle: '重置密码 ?',
      nzContent: '确认要重置该账号的密码吗？<b style="color: red;">重置后密码为当前账号</b>',
      nzOkText: '确定',
      nzOnOk: async () => {
        const data = {
          userId: item.primaryId
        }
        const res = await this.userManageService.ResetPasswordByAdmin(data)
        if (res.success) {
          this.message.success('重置成功')
          this.GetUsers(new listForm())
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
          this.GetUsers(new listForm())
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
            this.GetUsers(new listForm())
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

  /**
   * 后端数据转换为tree组件数据
   * @param data 原数组
   * @param attributes 配置属性
   */
  public transformTreeNode(data) {
    let resData = data;
    let tree = [];
    // const rootId = "00000000-0000-0000-0000-000000000000"
    const rootId = null

    for (let i = 0; i < resData.length; i++) {
      if (resData[i].parentId === rootId) {
        let obj = {
          title: resData[i]['displayName'],
          children: [],
          parentId: rootId,
          key: resData[i]['id'],
          id: resData[i]['id'],
          primaryId: resData[i]['primaryId']
        };
        tree.push(obj);
        resData.splice(i, 1);
        i--;
      }
    }
    run(tree);
    function run(chiArr) {
      if (resData.length !== 0) {
        for (let i = 0; i < chiArr.length; i++) {
          for (let j = 0; j < resData.length; j++) {
            if (chiArr[i].id === resData[j]['parentId']) {
              let obj = {
                title: resData[j]['displayName'],
                children: [],
                parentId: rootId,
                key: resData[j]['id'],
                id: resData[j]['id'],
                primaryId: resData[j]['primaryId']
              };
              chiArr[i].children.push(obj);
              resData.splice(j, 1);
              j--;
            }
          }
          run(chiArr[i].children);
        }
      }
    }
    return tree;
  }
}
