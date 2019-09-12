import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DepartmentManageService } from 'src/app/services/system-manage/department-manage.service';
import { listForm, addOrUpdateForm } from './department-manage.model';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

export interface TreeNodeInterface {
  key: number;
  name: string;
  age: number;
  level: number;
  expand: boolean;
  address: string;
  children?: TreeNodeInterface[];
}
@Component({
  selector: 'app-department-manage',
  templateUrl: './department-manage.component.html',
  styleUrls: ['./department-manage.component.scss']
})
export class DepartmentManageComponent implements OnInit {
  validateForm: FormGroup;
  listOfMapData = [];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  public isAddModal = false;
  public isAddOrUpdate: number = 1;// 1新增 2修改

  constructor(
    private fb: FormBuilder,
    private departmentManageService: DepartmentManageService,
    private message: NzMessageService,
    private modal: NzModalService,
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      displayName: [null, [Validators.required]],
      description: [null, []],
      parentId: [null, []],
      id: [null, []]
    });
    this.GetOrganizationUnits()
  }

  async GetOrganizationUnits() {
    const data = new listForm()
    const res = await this.departmentManageService.GetOrganizationUnits(data)
    this.listOfMapData = this.transformTreeNode(res.result.items)
  }

  async CreateOrganizationUnitExtend(data) {
    const res = await this.departmentManageService.CreateOrganizationUnitExtend(data)
    if (res.success) {
      this.message.success('操作成功')
      this.GetOrganizationUnits()
      this.isAddModal = false
    }
  }

  async UpdateOrganizationUnitExtend(data) {
    const res = await this.departmentManageService.UpdateOrganizationUnitExtend(data)
    if (res.success) {
      this.message.success('操作成功')
      this.GetOrganizationUnits()
      this.isAddModal = false
    }
  }

  addDepartChild(item) {
    this.isAddOrUpdate = 1
    this.validateForm.patchValue(new addOrUpdateForm({ parentId: item.id }))
    this.isAddModal = true
  }

  addDepartParent() {
    this.isAddOrUpdate = 1
    this.isAddModal = true
  }

  editDepart(item) {
    this.isAddOrUpdate = 2
    this.validateForm.patchValue(new addOrUpdateForm(item))
    this.isAddModal = true
  }

  removeDepart(item) {
    this.modal.error({
      nzTitle: '确认要删除该项吗?',
      nzContent: '<b style="color: red;">删除后不能恢复，请谨慎操作。</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: async () => {
        const data = {
          Id: item.id
        }
        const res = await this.departmentManageService.DeleteOrganizationUnit(data)
        if (res.success) {
          this.message.success('删除成功')
          this.GetOrganizationUnits()
        }
      },
      nzCancelText: '取消',
      nzOnCancel: () => { }
    });
  }

  resetModalForm() {
    this.validateForm.reset()
    this.isAddModal = false
  }

  submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    const value = this.validateForm.value
    const data = new addOrUpdateForm({ ...value })
    if (!this.validateForm.valid) {
      return
    }
    if (this.isAddOrUpdate === 1) {
      this.CreateOrganizationUnitExtend(data)
    } else {
      this.UpdateOrganizationUnitExtend(data)
    }
    this.resetModalForm()
  }

  pageChange(index) { }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: object): TreeNodeInterface[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: any }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
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
          displayName: resData[i]['displayName'],
          description: resData[i]['description'],
          memberCount: resData[i]['memberCount'],
          primaryId: resData[i]['primaryId'],
          children: [],
          parentId: rootId,
          key: resData[i]['id'],
          id: resData[i]['id'],
          isCheck: false,
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
                displayName: resData[j]['displayName'],
                description: resData[j]['description'],
                memberCount: resData[j]['memberCount'],
                primaryId: resData[j]['primaryId'],
                children: [],
                parentId: rootId,
                key: resData[j]['id'],
                id: resData[j]['id'],
                isCheck: false,
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
    tree.forEach(item => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
    return tree;
  }

}
