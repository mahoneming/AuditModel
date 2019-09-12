import { Component, OnInit, ViewChild } from '@angular/core';
import { ZzjFileUploader, FlowFileModel } from '@zzj/nag-file-uploader';
import { NzMessageService } from 'ng-zorro-antd';
// import { Router } from '@angular/router';
import { FILEURL } from 'src/app/config';
import { personalInfoModel } from './personal-info.model';
import { PersonalInfoService } from 'src/app/services/personal-info/personal-info.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {
  @ViewChild('imageUploader', { static: false }) imageUploader: ZzjFileUploader;

  constructor(
    private personalInfoService: PersonalInfoService,
    private message: NzMessageService
    // private router: Router,
  ) { }

  public user: any = {};
  public FILEURL = FILEURL;
  public imageQueue: any = [];
  public addimgStyle: any = {};

  public async getUserInfo() {
    const json = {
      MaxResultCount: 100,
      SkipCount: 0,
      Filter: JSON.parse(window.localStorage.getItem('APDInfo'))['userName']
    }
    const result = await this.personalInfoService.GetUsers(json);
    this.user = result.result.items.find((it) => it.userName === json.Filter);
    // console.log()
    if (this.user.avatar) this.addimgStyle = { 'background-image': 'url(' + this.user.avatar + ')' };
  }

  /**
   * 上传
   * @param e 
   */
  public async fileChange(e) {
    this.imageUploader.add(e.target.files[0]);
  }

  public fileSuccess(transfer: FlowFileModel) {
    this.addimgStyle = {
      'background-image': 'url(' + transfer.url + ')'
    }
    this.user.avatar = transfer.url;
  }

  /**
   * 保存
   */
  public async preservation() {
    if (!this.user.name) {
      this.message.warning('请输入姓名')
      return
    }
    // 手机号
    // let phoneNumber = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (isNaN(this.user.phoneNumber)) {
      this.message.create('warning', '请输入数字');
      return;
    }

    if (this.user.phoneNumber.length !== 11) {
      this.message.create('warning', '请输入正确的手机号');
      return;
    }
    // 邮箱
    let email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!email.test(this.user.emailAddress)) {
      this.message.create('warning', '请输入正确的邮箱地址');
      return;
    }

    const userModel = new personalInfoModel(this.user);
    const res = await this.personalInfoService.UpdateUserProfile(userModel);
    // this.messageService.send(this.addimgStyle);
    if (res.success) {
      // 修改localStorage的头像信息
      const info = JSON.parse(window.localStorage.getItem('APDInfo'));
      info.avatar = this.user.avatar;
      window.localStorage.setItem('APDInfo', JSON.stringify(info));
      this.message.create('success', `修改成功`);
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
  public reset() {
    this.getUserInfo();
  }

  ngOnInit() {
    this.getUserInfo();
  }

}
