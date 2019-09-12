import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import CryptoJS from 'crypto-js'
import { NzMessageService } from 'ng-zorro-antd';
import { apiPath } from 'src/app/config';

interface loginInfo {
  tenancyName: string;
  userNameOrEmailAddress: string;
  password: string;
  twoFactorVerificationCode: string;
  rememberClient: boolean;
  twoFactorRememberClientToken: string;
  singleSignIn: boolean;
  returnUrl: string;
  type: number;
  version?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  public loginInfo: loginInfo;
  public apiPath = apiPath;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private message: NzMessageService
    
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userNameOrEmailAddress: [null, [Validators.required]],
      password: [null, [Validators.required]]
      // remember: [true]
    });
    this.isTenantAvailable()
  }

  async isTenantAvailable() {
    const result = await this.loginService.isTenantAvailable({ tenancyName: 'Default' });
    // 记录TenantId
    window.localStorage.setItem('TenantId', JSON.stringify(result.result.tenantId));
    const server = { 
      fileServerRootAddress: result.result.fileServerRootAddress,
      identityRootAddress: result.result.identityRootAddress
    }
    window.localStorage.setItem('server', JSON.stringify(server))
  }

  async submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (!this.validateForm.valid) {
      return
    }
    const formData = this.validateForm.value;
    this.loginInfo = {
      tenancyName: 'Default',
      userNameOrEmailAddress: formData.userNameOrEmailAddress,
      password: CryptoJS.MD5(formData.password).toString().toUpperCase(),
      twoFactorVerificationCode: null,
      singleSignIn: false,
      rememberClient: false,
      twoFactorRememberClientToken: null,
      returnUrl: null,
      type: 1
    }
    const headers = { 'X-Requested-With': 'XMLHttpRequest' };
    // headers['Abp.TenantId'] = this.tenantId;

    // 登录接口
    const result = await this.loginService.authenticate(this.loginInfo, headers)
    // console.log(result)
    if (result.success) {
      // 记录企业Id
      // window.localStorage.setItem('organizationUnitId', JSON.stringify(result.result.organizationUnitId));
      // 记录token
      window.localStorage.setItem('APDInfo', JSON.stringify(result.result));
      // 企业ID
      // window.localStorage.setItem('PrimaryId', result.result.primaryId);
      // 动态API Path
      // window.localStorage.setItem('apiPath', result.result.apiPath);
      // 获取spd token
      this.loginService.getTokenInfo().then((res) => {
        // console.log(access_token.result.access_token)
        sessionStorage.setItem('access_token', res.result.access_token);
      });
      this.message.success('登录成功');
      if (result.result.roleCode === 'SYSTEM_Leader') {
        this.router.navigate([`/project-manage/project-statistics`]);
        return
      }
      this.router.navigate([`/project-manage/project-list`]);
    } else if (result.error.code === 111) {
      // 新用户设置密码
      this.router.navigate([`/update-password-first-login`]);
    }
  }

}
