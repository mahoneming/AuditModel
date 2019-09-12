import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbpAuthService } from '../services/abp-auth.service';
import { Abp } from '@zzj/zzj-abp-web';
import { apiPath } from 'src/app/config';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  public menuList = [];
  public isCollapsed = false;
  public imgStyle: any = {};
  public userName = JSON.parse(window.localStorage.getItem('APDInfo'))['userName'] + '（' + JSON.parse(window.localStorage.getItem('APDInfo'))['roleName'] + '）';
  public isSpinning = true;
  public nzTheme = 'light'
  public apiPath = apiPath;

  constructor(
    private router: Router,
    private abpAuthService: AbpAuthService
  ) {

  }

  async ngOnInit() {
    if (apiPath === 'audit') {
      this.nzTheme = 'dark'
    }
    await this.abpAuthService.getAll()
    await this.setMenuList()
  }

  setMenuList() {
    const pathname = window.location.pathname
    this.menuList = [{
      name: '项目管理', isShow: false,
      icon: 'unordered-list',
      items: [
        { name: '项目列表', route: '/project-manage/project-list', isShow: Abp.auth.isGranted('Menus.Project.Manage') },
        { name: '项目指派列表', route: '/project-manage/project-assign-list', isShow: Abp.auth.isGranted('Menus.Project.Assign') && apiPath === 'audit' },
        { name: '项目审核列表', route: '/project-manage/project-review-list', isShow: Abp.auth.isGranted('Menus.Project.Audit') && apiPath === 'audit' },
        { name: '项目统计', route: '/project-manage/project-statistics', isShow: Abp.auth.isGranted('Menus.Project.Dashboard') && apiPath === 'bim' }
      ]
    }, {
      name: '系统管理', isShow: false,
      icon: 'setting',
      items: [
        { name: '用户管理', route: '/system-manage/user-manage', isShow: Abp.auth.isGranted('Menus.System.Users') },
        { name: '专家列表', route: '/system-manage/expert-list', isShow: Abp.auth.isGranted('Menus.System.Special') && apiPath === 'audit' },
        { name: '角色管理', route: '/system-manage/role-manage', isShow: Abp.auth.isGranted('Menus.System.Roles') },
        { name: '接口用户', route: '/system-manage/interface-user', isShow: Abp.auth.isGranted('Menus.System.Interface') },
        // { name: '菜单管理', route: 'project-statistics', isShow: true },
        { name: '部门管理', route: '/system-manage/department-manage', isShow: Abp.auth.isGranted('Menus.System.OrganizationUnits') },
        { name: '专业管理', route: '/system-manage/major-manage', isShow: Abp.auth.isGranted('Menus.System.Majors') },
        { name: '岗位管理', route: '/system-manage/job-manage', isShow: Abp.auth.isGranted('Menus.System.Positions') },
        { name: '区域管理', route: '/system-manage/region-manage', isShow: Abp.auth.isGranted('Menus.System.Areas') },
        // { name: '字典管理', route: 'project-statistics', isShow: true },
        // { name: '通知公告', route: '/system-manage/notice', isShow: Abp.auth.isGranted('Menus.System.Notices') && apiPath === 'bim' },
        { name: '登录日志', route: '/system-manage/login-log', isShow: Abp.auth.isGranted('Menus.System.AuditLogs') }
      ]
    }, {
      name: '系统监控', isShow: false,
      icon: 'video-camera',
      items: [
        { name: '服务监控', route: '/system-monitor', isShow: Abp.auth.isGranted('Menus.Monitor.Dashboard') }
      ]
    }];
    // 父级菜单是否展开，刷新纪录菜单状态
    this.menuList.forEach((menu) => {
      const checkSome = menu.items.some((subMenu) => subMenu.isShow)
      if (checkSome) menu.isShow = true
      if (menu.items.length) {
        menu.items.forEach((subMenu) => {
          // console.log(subMenu.route)
          // console.log(pathname)
          if (pathname.indexOf(subMenu.route) !== -1) {
            menu.isOpen = true
            subMenu.isCheck = true
          }
        });
      }
    });
    this.isSpinning = false
  }

  public toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  public routerTo(route) {
    // console.log(route)
    // this.routeInfo.queryParams.subscribe(queryParams => {
    //   this.router.navigate([`${route}`], { /*queryParams*/ });
    // });
    this.router.navigate([`${route}`], { /*queryParams*/ });
  }

  public signout() {
    this.router.navigate([`login`]);
    localStorage.clear()
    // this.loginService.logout();
  }

  public personal() {
    this.router.navigate([`personal-info`]);
  }

  public password() {
    this.router.navigate([`update-password`]);
  }

  public comeBack() {
    this.router.navigate([`outer/project-type`]);
  }

}
