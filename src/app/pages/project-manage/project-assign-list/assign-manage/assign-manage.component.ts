import { Component, OnInit } from '@angular/core';
import { NzMessageService, TransferItem, TransferCanMove } from 'ng-zorro-antd';
import { UserManageService } from 'src/app/services/system-manage/user-manage.service';
import { ActivatedRoute } from '@angular/router';
import { listLeftForm, listRightForm } from './assign-manage.model';
import { AssignManageService } from 'src/app/services/project-manage/assign-manage.service';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-assign-manage',
  templateUrl: './assign-manage.component.html',
  styleUrls: ['./assign-manage.component.scss']
})
export class AssignManageComponent implements OnInit {
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
  public projectId: string
  public auditStatus: string
  public hasAuditRecord = false;
  public name: string;
  public userCount: number

  constructor(
    private userManageService: UserManageService,
    private assignManageService: AssignManageService,
    private message: NzMessageService,
    private routeInfo: ActivatedRoute
  ) {
    this.routeInfo.params.subscribe((params) => {
      this.projectId = params['projectId']
    })
    this.routeInfo.queryParams.subscribe((queryParams) => {
      this.auditStatus = queryParams.auditStatus
      this.name = queryParams.name
    })
  }

  ngOnInit(): void {
    this.mergeList()
  }

  async GetUsers(data) {
    const res = await this.userManageService.GetUsers(data)
    this.leftList = res.result.items
    // data.nzTotal = res.result.totalCount
    this.leftList.forEach((element) => {
      element.title = element.name
      element.direction = 'left'
    });
  }

  async QueryProjectAuditUsersPagedList() {
    const data = {
      projectId: this.projectId,
      maxResultCount: 1000,
      skipCount: 0
    }
    const resLeft = await this.assignManageService.QueryProjectAuditUsersPagedList(data)
    this.rightList = resLeft.result.users.items
    this.hasAuditRecord = resLeft.result.hasAuditRecord
    this.userCount = resLeft.result.userCount
    // leftData.nzTotal = resLeft.result.totalCount
    this.rightList.forEach((element) => {
      element.title = element.name
      element.direction = 'right'
    });
  }

  async mergeList() {
    await this.GetUsers(this.listLeftForm)
    await this.QueryProjectAuditUsersPagedList()
    this.leftList.forEach((leftItem, index) => {
      this.rightList.forEach((rightItem) => {
        if (leftItem.primaryId === rightItem.userId) {
          delete this.leftList[index]
        }
      });
    });
    this.tableList = this.leftList.concat(this.rightList)
    this.tableList.forEach((element) => {
      element.disabled = false
      if (this.auditStatus !== '1' && this.hasAuditRecord) {
        element.disabled = true
      }
    });
    // console.log(this.tableList)
  }

  async randomAssign() {
    const res = await this.assignManageService.RandomCreateProjectAuditUsers({ projectId: this.projectId })
    if (res.success) {
      this.mergeList()
    }
  }

  async change(ret: any) {
    // console.log('nzChange', ret);
    let temp = []
    let res
    if (ret.from === 'left') {
      // 新增
      if (this.rightList.length === this.userCount) {
        this.message.error(`只能指派${this.userCount}位专家`)
        return
      }
      ret.list.forEach((element) => {
        temp.push(element.primaryId)
      });
      res = await this.assignManageService.BatchCreateUserToProjectAuditUsers({ userIdList: temp, projectId: this.projectId })
    } else {
      // 删除
      ret.list.forEach((element) => {
        temp.push(element.userId)
      });
      res = await this.assignManageService.BatchRemoveOnProjectAuditUsers({ userIdList: temp, projectId: this.projectId })
    }
    if (res.success) {
      this.message.success('操作成功')
    }
    this.mergeList()
  }

  canMove(arg: TransferCanMove): Observable<TransferItem[]> {
    if (arg.direction === 'right' && this['rightDataSource'].length >= 3) {
      arg.list = [];
    }
    // or
    // if (arg.direction === 'right' && arg.list.length > 0) delete arg.list[0];
    return of(arg.list).pipe(delay(1000));
  }

  convertItems(items: TransferItem[]): TransferItem[] {
    return items.filter((i) => !i.hide);
  }

  select(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  search(item) {
    console.log(item)
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
