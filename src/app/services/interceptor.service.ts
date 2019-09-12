import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";

import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/internal/operators";
import { Router } from "@angular/router";
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})

/**
 * http 拦截器
 */
export class InterceptorService implements HttpInterceptor {
  constructor(
    private router: Router,
    private message: NzMessageService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const url = 'host'; 
    const authReq = req.clone({
      // url: url + req.url, 
      // headers: req.headers.set('token', localStorage.getItem('token')), 
    });
    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  private handleError(
    event: HttpResponse<any> | HttpErrorResponse | any
  ): Observable<any> {
    // 业务处理：一些通用操作
    let content: string
    console.log(event)
    if (event.error) {
      // 构件报错信息
      let message = event.error.error.message;
      let details = event.error.error.details;
      content = message;
      if (details) {
        content += '：' + details;
      }
      // 剔除后端返回的英文感叹号，这是从框架里出来的所以在前端处理
      if (content.indexOf('!') !== -1) {
        content = content.replace('!', '');
      }
    }
    switch (event.status) {
      case 401:
        // console.log('need login');
        this.message.info('登录失效 请重新登录')
        this.router.navigate(['/login']);
        return of(event);
      case 404:
        break;
      case 500:
        this.message.warning(content)
        break;
      default:
        this.message.warning(content)
    }
    return throwError(event);
  }
}
