import { Injectable, OnInit } from '@angular/core';
import { LoginService } from './login/login.service';
import { Abp } from '@zzj/zzj-abp-web';

@Injectable({
  providedIn: 'root'
})
export class AbpAuthService implements OnInit{
  public allPermissions = []
  public grantedPermissions = []

  constructor(
    private loginService: LoginService
  ) { }

  ngOnInit() {
    // this.getAll()
  }

  async getAll() {
    const res = await this.loginService.getAll()
    if (res.success) {
      const auth = res.result.auth;
      this.allPermissions = auth.allPermissions;
      this.grantedPermissions = auth.grantedPermissions;
      Abp.auth.setGlobal(res.result.auth)
      // console.log(Abp.auth.grantedPermissions)
    }
  }
}
