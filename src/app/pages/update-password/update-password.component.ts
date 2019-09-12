import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { UpdatePasswordService } from 'src/app/services/update-password/update-password.service';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  constructor(
    private updatePasswordService: UpdatePasswordService,
    private message: NzMessageService,
    private router: Router
  ) { }

  public oldPassword = '';
  public newPassword = '';
  public newPasswordConfirm = '';

  /**
   * 保存
   */
  public async preservation() {
    if (this.oldPassword.length >= 50) {
      this.message.create('error', `密码长度为50`);
    }
    if (this.newPassword.length >= 50) {
      this.message.create('error', `密码长度为50`);
    }
    if (this.newPasswordConfirm.length >= 50) {
      this.message.create('error', `密码长度为50`);
    }
    const json = {
      currentPassword: CryptoJS.MD5(this.oldPassword).toString().toUpperCase(),
      newPassword: CryptoJS.MD5(this.newPassword).toString().toUpperCase(),
      newPasswordConfirm: CryptoJS.MD5(this.newPassword).toString().toUpperCase()
    }
    const result = await this.updatePasswordService.ChangePassword(json);
    if (result.error) {
      this.message.create('error', `密码错误`);
    } else {
      this.message.success('修改成功')
      this.router.navigate([`login`]);
    }
  }

  /**
   * 返回
   */
  // public comeBack() {
  //   this.router.navigate(['outer/dashboard']);
  // }

  /**
   * 重置
   */
  public async reset() {
    this.oldPassword = '';
    this.newPassword = '';
    this.newPasswordConfirm = '';
  }

  ngOnInit() { 
  }

}
