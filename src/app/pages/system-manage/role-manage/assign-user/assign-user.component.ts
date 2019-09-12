import { Component, OnInit } from '@angular/core';
import { listLeftForm, listRightForm } from './assign-user.model';
import { NzMessageService, NzModalService, TransferItem } from 'ng-zorro-antd';
import { UserManageService } from 'src/app/services/system-manage/user-manage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.scss']
})
export class AssignUserComponent implements OnInit {

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  public nzPageIndex = 1;
  public listLeftForm = new listLeftForm();
  public listRightForm = new listRightForm();
  public tableList = []
  public leftList = []
  public rightList = []
  public isModalOpen = false
  public primaryId: string
  public id: string
  public title: string[]

  constructor(
    private userManageService: UserManageService,
    private message: NzMessageService,
    private modal: NzModalService,
    private routeInfo: ActivatedRoute
  ) {
    this.routeInfo.queryParams.subscribe((queryParams) => {
      this.listLeftForm.ExcludeRole = queryParams['id']
      this.listRightForm.Role = queryParams['id']
      this.title = [`非${queryParams['description']}`, `${queryParams['description']}`]
      this.primaryId = queryParams['primaryId']
      this.id = queryParams['id']
    })
  }

  ngOnInit(): void {
    this.mergeList()
  }

  // handleAddOk() {}

  convertItems(items: TransferItem[]): TransferItem[] {
    return items.filter((i) => !i.hide);
  }

  select(ret: {}): void {
    // console.log('nzSelectChange', ret);
  }

  async change(ret: any) {
    // console.log('nzChange', ret);
    let temp = []
    ret.list.forEach((element) => {
      temp.push(element.primaryId)
    });
    let data = {
      roleId: this.primaryId,
      userIdList: temp,
      type: 1
    }
    if (ret.from === 'right') {
      data.type = 2
    }
    const res = await this.userManageService.BatchUpdateUserRole(data)
    if (res.success) {
      this.message.success('操作成功')
    }
  }

  search(item) {
    // console.log(item)
    // if (item.)
  }

  async GetUsers(rightData) {
    const resRight = await this.userManageService.GetUsers(rightData)
    this.rightList = resRight.result.items
    rightData.nzTotal = resRight.result.totalCount
    this.rightList.forEach((element) => {
      element.title = element.name
      element.direction = 'right'
    });
  }

  async GetExcludeRoleUsers(leftData) {
    const resLeft = await this.userManageService.GetExcludeRoleUsers(leftData)
    this.leftList = resLeft.result.items
    leftData.nzTotal = resLeft.result.totalCount
    this.leftList.forEach((element) => {
      element.title = element.name
      element.direction = 'left'
    });
  }

  async mergeList() {
    await this.GetUsers(this.listRightForm)
    await this.GetExcludeRoleUsers(this.listLeftForm)
    this.tableList = this.leftList.concat(this.rightList)
    // console.log(this.tableList)
  }

  // searchItem() {
  //   this.GetUsers(this.listForm)
  // }

  // pageChange(index) {
  //   this.listForm.SkipCount = index
  //   this.GetUsers(this.listForm)
  // }

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
