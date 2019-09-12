import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { InterceptorService } from './services/interceptor.service';
import { NeonService } from './services/neon.service';
import { NZ_MESSAGE_CONFIG } from 'ng-zorro-antd';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HttpModule,
    OAuthModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }, // 拦截器
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 5000 }}, // 5s提示消息
    NeonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
