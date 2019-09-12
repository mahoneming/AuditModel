import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
// import { OAuthService } from 'angular-oauth2-oidc';
import { LoginService } from '../services/login/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  constructor(
    private loginService: LoginService
  ) { }

  public async canActivate() {

    const helper = new JwtHelperService();
    const token = sessionStorage.getItem('access_token')
    const check = helper.isTokenExpired(token);
    if (!check) {
      return true;
    } else {
      // 获取文件服务token 并储存 进sessionStorage 
      this.loginService.getTokenInfo().then((access_token) => {
        sessionStorage.setItem('access_token', access_token.result.access_token);
        return 'Bearer ' + access_token.result.access_token;
      })
      return true;
    }
  }

}