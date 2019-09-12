import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { HOSTURL, PREFIX } from '../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HOSTURL, PREFIX } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class RequestClientService {

  constructor(
    private http: HttpClient
  ) { }
  public get(url: string, params, header?): Promise<any> {
    let headers = this.creatHeader(header)
    return this.http.get(url, { headers, params })
      .toPromise().then(this.checkResponeData).catch(this.throwError)
  }
  public post(url: string, params?, header?): Promise<any> {
    let headers = this.creatHeader(header)
    return this.http.post(url, params, { headers })
      .toPromise().then(this.checkResponeData).catch(this.throwError);
  }
  public put(url: string, params, header?): Promise<any> {
    let headers = this.creatHeader(header)
    return this.http.put(url, params, { headers })
      .toPromise().then(this.checkResponeData).catch(this.throwError);
  }
  public delete(url: string, params, header?): Promise<any> {
    let headers = this.creatHeader(header)
    return this.http.delete(url, { headers, params })
      .toPromise().then(this.checkResponeData).catch(this.throwError);
  }

  public checkResponeData(res) {
    return res;
  }

  public async throwError(error) {
    // console.error(error);
    return error.error;
  }

  public creatHeader(header?) {
    let formObj = {
      'Authorization': this.getAPDToken()
    }
    for (let key in header) {
      formObj[key] = header[key];
    }
    return new HttpHeaders(formObj);
  }

  public getAPDToken() {
    if (!window.localStorage.getItem('APDInfo')) return 'Bearer ' + null;
    const apdInfo = JSON.parse(window.localStorage.getItem('APDInfo'));
    return 'Bearer ' + apdInfo.accessToken;
  }

  public getSSO(url: string, params?, header?): Promise<any> {
    let headers = this.creatSSOHeader(header)
    return this.http.get(url, { headers, params })
      .toPromise().then(this.checkResponeData).catch(this.throwError)
  }
  public postSSO(url: string, params, header?): Promise<any> {
    let headers = this.creatSSOHeader(header)
    return this.http.post(url, params, { headers })
      .toPromise().then(this.checkResponeData).catch(this.throwError);
  }
  public putSSO(url: string, params, header?): Promise<any> {
    let headers = this.creatSSOHeader(header)
    return this.http.put(url, params, { headers })
      .toPromise().then(this.checkResponeData).catch(this.throwError);
  }
  public deleteSSO(url: string, params, header?): Promise<any> {
    let headers = this.creatSSOHeader(header)
    return this.http.delete(url, { headers, params })
      .toPromise().then(this.checkResponeData).catch(this.throwError);
  }

  public creatSSOHeader(header?) {
    let formObj = {
      'Authorization': this.getSSOToken()
    }
    for (let key in header) {
      formObj[key] = header[key];
    }
    return new HttpHeaders(formObj);
  }

  public getSSOToken() {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem('access_token')
    const check = helper.isTokenExpired(token);
    if (check) {
      // 获取文件服务token 并储存 进sessionStorage 

      this.getTokenInfo().then((access_token) => {
        sessionStorage.setItem('access_token', access_token.result.access_token)
        return 'Bearer ' + access_token.result.access_token;
      })
    }
    return 'Bearer ' + sessionStorage.getItem('access_token');
  }
  
  public async getTokenInfo(params?) {
    const res = await this.get(HOSTURL + `/api/services/${PREFIX}/Session/GetTokenInfo
    `, params);
    return res;
  }
}
