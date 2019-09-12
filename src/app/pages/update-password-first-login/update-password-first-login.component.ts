import { Component, OnInit } from '@angular/core';
import { UpdatePasswordService } from 'src/app/services/update-password/update-password.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import CryptoJS from 'crypto-js';
import { Utils } from 'src/app/common/helper/util-helper';

@Component({
  selector: 'app-update-password-first-login',
  templateUrl: './update-password-first-login.component.html',
  styleUrls: ['./update-password-first-login.component.scss']
})
export class UpdatePasswordFirstLoginComponent implements OnInit {

  constructor(
    private updatePasswordService: UpdatePasswordService,
    private message: NzMessageService,
    private router: Router
  ) { }

  public userName = '';
  public password = '';

  /**
   * 保存
   */

  keyupEvent(e) {
    Utils.enter(e, this.ChangePasswordOnFirstLogin.bind(this));
  }

  async ChangePasswordOnFirstLogin() {
    if (this.password.length >= 50) {
      this.message.create('error', `密码长度为50`);
    }
    const json = {
      userName: this.userName,
      password: CryptoJS.MD5(this.password).toString().toUpperCase()
    }
    const result = await this.updatePasswordService.ChangePasswordOnFirstLogin(json);
    if (result.success) {
      this.message.success('设置成功')
      this.router.navigate([`login`]);
    }
  }

  keyUpSearch() {
    // console.log(111)
  }

  ngOnInit() {
  }

}
