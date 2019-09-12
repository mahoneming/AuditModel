import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { apiPath } from 'src/app/config';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private titleService: Title) {
    if (apiPath === 'bim') {
      this.titleService.setTitle('BIM项目管理系统');
    } else if (apiPath === 'audit') {
      this.titleService.setTitle('BIM施工应用模型审查系统');
    }
  }
}
