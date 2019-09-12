import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AreaListService } from 'src/app/services/area-list.service';
import { addOrUpdateForm } from './region-manage.model';
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
  selector: 'app-region-manage',
  templateUrl: './region-manage.component.html',
  styleUrls: ['./region-manage.component.scss']
})
export class RegionManageComponent implements OnInit {
  listOfMapData = [];
  validateForm: FormGroup;
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  public status = [{
    name: '启用',
    value: '1'
  }, {
    name: '禁用',
    value: '2'
  }]
  public isAddVisible = false
  public addOrUpdateForm = new addOrUpdateForm()

  constructor(
    private fb: FormBuilder,
    private areaListService: AreaListService,
    private message: NzMessageService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.QueryAreasPagedList()
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      status: ['1', [Validators.required]],
      parentId: [null, []],
      id: [null, []]
    });
  }

  async CreateOrModifyArea(data) {
    const res = await this.areaListService.CreateOrModifyArea(data)
    if (res.success) {
      this.message.success('操作成功')
      this.QueryAreasPagedList()
      this.isAddVisible = false
    }
  }

  async QueryAreasPagedList() {
    const data = {
      status: '0',
      filter: undefined,
      creationTimeRange: undefined,
      sorting: undefined,
      maxResultCount: 100,
      skipCount: 0
    }
    const res = await this.areaListService.QueryAreasPagedList(data)
    this.listOfMapData = this.transformTreeNode(res.result.items)
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
    const data = new addOrUpdateForm({ ...value })
    this.CreateOrModifyArea(data)
    this.resetForm()
  }

  addRegionChild(item) {
    // console.log(item)
    this.validateForm.patchValue(new addOrUpdateForm({ parentId: item.id }))
    this.isAddVisible = true
  }

  editRegion(item) {
    // console.log(item)
    const data = { ...item }
    data.status = data.status.toString()
    this.validateForm.patchValue(new addOrUpdateForm(data))
    this.isAddVisible = true
  }

  removeRegion(item) {
    this.modal.error({
      nzTitle: '确认要删除该项吗?',
      nzContent: '<b style="color: red;">删除后不能恢复，请谨慎操作。</b>',
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: async () => {
        const data = {
          Id: item.id
        }
        const res = await this.areaListService.RemoveArea(data)
        if (res.success) {
          this.message.success('删除成功')
          this.QueryAreasPagedList()
        }
      },
      nzCancelText: '取消',
      nzOnCancel: () => { }
    });
  }

  pageChange(index) { }

  resetForm() {
    this.validateForm.reset()
    this.validateForm.patchValue({ status: '1' })
    this.isAddVisible = false
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach((d) => {
          const target = array.find((a) => a.key === d.key)!;
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
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level + 1, expand: true, parent: node });
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
    const rootId = "00000000-0000-0000-0000-000000000000"
    // const rootId = null

    for (let i = 0; i < resData.length; i++) {
      if (resData[i].parentId === rootId) {
        let obj = {
          name: resData[i]['name'],
          code: resData[i]['code'],
          status: resData[i]['status'],
          creationTime: resData[i]['creationTime'],
          children: [],
          parentId: rootId,
          key: resData[i]['id'],
          id: resData[i]['id'],
          expand: true
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
                name: resData[j]['name'],
                code: resData[j]['code'],
                status: resData[j]['status'],
                creationTime: resData[j]['creationTime'],
                children: [],
                parentId: resData[j]['parentId'],
                key: resData[j]['id'],
                id: resData[j]['id'],
                expand: true
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
    tree.forEach((item) => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
    // console.log(tree)
    return tree;
  }

}
