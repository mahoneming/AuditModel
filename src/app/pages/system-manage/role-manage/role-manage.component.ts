import { Component, OnInit } from '@angular/core';
import { RoleManageService } from 'src/app/services/system-manage/role-manage.service';
import { listForm } from './role-manage.model';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { LoginService } from 'src/app/services/login/login.service';
// import { AbpAuthService } from 'src/app/services/abp-auth.service';
import { Utils } from 'src/app/common/helper/util-helper';

@Component({
  selector: 'app-role-manage',
  templateUrl: './role-manage.component.html',
  styleUrls: ['./role-manage.component.scss']
})
export class RoleManageComponent implements OnInit {
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  validateAddForm: FormGroup;
  public listForm = new listForm();
  public tableList = []
  public addForm = {
    role: {
      id: undefined,
      displayName: "",
      description: "",
      isDefault: false
    },
    grantedPermissionNames: []
  }
  public isAddModal = false
  public currentRoleCode = JSON.parse(window.localStorage.getItem('APDInfo'))['roleCode']
  public basisPermission = []
  public showPermissionRootList = ['Pages.Administration.Roles', 'Menus.Project', 'Menus.System', 'Menus.Monitor'] // 配置父级节点
  public showPermissionList = [] // 前端需要显示的所有节点，显示使用
  public checkPermissionList = [] // 前端勾选的节点，调接口使用
  public cantModify = false
  public pageIndex = 1;

  constructor(
    private roleManageService: RoleManageService,
    private message: NzMessageService,
    private modal: NzModalService,
    private router: Router,
    private fbAdd: FormBuilder,
    private routerinfo: ActivatedRoute
  ) { 
    this.routerinfo.queryParams.subscribe((queryParams) => {
      if (queryParams['sc'] === '3870c648-4aea-4b85-ba3f-f2f63b96136a') this.cantModify = true
    })
  }

  async ngOnInit() {
    this.validateAddForm = this.fbAdd.group({
      displayName: [null, [Validators.required]],
      description: [null, []],
      id: [null, []]
    });
    this.GetRoles(this.listForm)
    this.GetRoleForEdit()
  }

  async GetRoles(data) {
    const res = await this.roleManageService.GetRoles(data)
    this.tableList = res.result.items
    this.listForm.nzTotal = res.result.totalCount
  }

  async handleAddOk() {
    for (const i in this.validateAddForm.controls) {
      this.validateAddForm.controls[i].markAsDirty();
      this.validateAddForm.controls[i].updateValueAndValidity();
    }
    if (!this.validateAddForm.valid) {
      return
    }
    this.setCheckPermissionList()
    const value = this.validateAddForm.value
    this.addForm.role.id = value.id
    this.addForm.role.displayName = value.displayName
    this.addForm.role.description = value.description
    this.addForm.grantedPermissionNames = this.checkPermissionList.concat(this.basisPermission)
    const res = await this.roleManageService.CreateOrUpdateRole(this.addForm)
    if (res.success) {
      this.GetRoles(this.listForm)
      this.validateAddForm.reset()
      this.isAddModal = false
      this.message.success('操作成功')
    }
  }

  // 查询某个角色权限
  async GetRoleForEdit(id?, name?) {
    const res = await this.roleManageService.GetRoleForEdit(id)
    if (res.success) {
      const permissions = res.result.permissions;
      const grantedPermissionNames = res.result.grantedPermissionNames;
      this.setBasisPermission(permissions, name)
      this.setPermissionData(permissions, grantedPermissionNames)
    }
  }

  setBasisPermission(permissions, name) {
    let basisPermission = []
    this.basisPermission = []
    permissions.forEach((element) => {
      const root = element.name.split('.')[0]
      const type = element.name.split('.')[2]
      // if (name === 'SYSTEM_Admin') {
      //   // Admin账户
      //   if (root === 'Pages') basisPermission.push(element.name)
      // } else {
      //   // 其他账户不给roles权限
      //   if (root === 'Pages' && type !== 'Roles') basisPermission.push(element.name)
      // }
      if (root === 'Pages') basisPermission.push(element.name)
    });
    this.basisPermission = basisPermission
  }

  /**
   * 
   * 渲染企业级权限分配
   * @param permissions 总权限
   * @param grantedPermissionNames 拥有的权限
   * permissionObject 构造的多选组件所需数据结构
   * showPermissionRootList 初始化所需展示的权限点（父级）
   * key 权限名 如：Pages.Administration.Users.Impersonation
   * 
   */
  setPermissionData(permissions, grantedPermissionNames) {
    let permissionObject = {}
    let permissionList = []
    permissions.forEach((element) => {
      const key = element.name
      const parentName = element.parentName
      this.showPermissionRootList.forEach((needMenu) => {
        if (key === needMenu) {
          // console.log('父级', key)
          permissionObject[needMenu] = {
            text: element.displayName,
            key,
            group: []
          }
        } else if (parentName === needMenu) {
          // console.log('子级', permissionObject[key])
          let isChecked = false
          if (!permissionObject[needMenu]) {
            // 如果先遍历到子级 则先初始化父级数据
            permissionObject[needMenu] = {
              text: null,
              key: null,
              group: []
            }
          }
          grantedPermissionNames.forEach((checkItem) => {
            // 打钩
            if (key === checkItem) {
              isChecked = true
            }
          });
          permissionObject[needMenu].group.push({
            // 初始化group数据
            value: element.name,
            label: element.displayName,
            key: element.name,
            checked: isChecked
          })
        }
      });
    });
    for (const key in permissionObject) {
      if (permissionObject.hasOwnProperty(key)) {
        const element = permissionObject[key];
        permissionList.push(element)
      }
    }
    this.showPermissionList = permissionList
    // console.log(this.showPermissionList)
  }

  setCheckPermissionList() {
    let checkPermissionList = []
    this.showPermissionList.forEach((element) => {
      if (element.group.length) {
        element.group.forEach((item) => {
          if (item.checked) {
            checkPermissionList.push(item.key)
          }
        });
      }
    });
    this.checkPermissionList = checkPermissionList
    // console.log(checkPermissionList)
  }

  keyupEvent(e) {
    Utils.enter(e, this.searchItem.bind(this));
  }

  searchItem() {
    this.pageIndex = 1
    this.listForm.SkipCount = 0
    this.GetRoles(this.listForm)
  }

  editRole(item) {
    console.log(item)
    this.validateAddForm.patchValue({
      displayName: item.displayName,
      description: item.description,
      id: item.id
    })
    // Admin才允许修改
    // if (this.currentRoleCode === 'SYSTEM_Admin') {
    //   this.cantModify = true
    // }
    this.GetRoleForEdit({ id: item.id, name: item.name })
    this.isAddModal = true
  }

  setting(item) {
    // console.log(item)
    const params = {
      primaryId: item.primaryId,
      description: item.description,
      id: item.id
    }
    this.router.navigate([`/system-manage/role-manage/assign-user`], { queryParams: params });
  }

  removeRole(item) {
    this.modal.error({
      nzTitle: '确认要删除该项吗?',
      nzContent: '<b style="color: red;">删除后不能恢复，请谨慎操作。</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: async () => {
        const data = {
          Id: item.id
        }
        const res = await this.roleManageService.DeleteRole(data)
        if (res.success) {
          this.message.success('删除成功')
          this.GetRoles(this.listForm)
        }
      },
      nzCancelText: '取消',
      nzOnCancel: () => { }
    });
  }

  resetModalForm() {
    this.validateAddForm.reset()
    this.showPermissionList.forEach((element) => {
      element.group.forEach((item) => {
        item.checked = false
      });
    });
    this.isAddModal = false
  }

  pageChange(index) {
    this.listForm.SkipCount = index - 1
    this.GetRoles(this.listForm)
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
