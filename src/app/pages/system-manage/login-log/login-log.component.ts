import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginLogService } from 'src/app/services/system-manage/login-log.service';
import { Utils } from 'src/app/common/helper/util-helper';

@Component({
  selector: 'app-login-log',
  templateUrl: './login-log.component.html',
  styleUrls: ['./login-log.component.scss']
})
export class LoginLogComponent implements OnInit {

  validateForm: FormGroup;
  public listForm = {
    SkipCount: 1,
    filter: undefined,
    maxResultCount: 20,
    nzTotal: 0
  }
  public pageIndex = 1;
  public tableInfo = []

  constructor(
    private loginLogService: LoginLogService
  ) { }

  ngOnInit() {
    const data = {
      ...this.listForm,
      SkipCount: 0
    }
    this.QueryRecentUserLoginAttemptsPagedList(data)
  }

  keyupEvent(e) {
    Utils.enter(e, this.searchItem.bind(this));
  }

  searchItem() {
    this.listForm.SkipCount = 1
    const data = {
      ...this.listForm,
      SkipCount: 0
    }
    this.QueryRecentUserLoginAttemptsPagedList(data)
  }

  async QueryRecentUserLoginAttemptsPagedList(params) {
    const res = await this.loginLogService.QueryRecentUserLoginAttemptsPagedList(params)
    this.tableInfo = res.result.items
    this.listForm.nzTotal = res.result.totalCount
  }

  pageChange(index) {
    const data = {
      ...this.listForm,
      SkipCount: index - 1
    }
    this.QueryRecentUserLoginAttemptsPagedList(data)
  }

}
