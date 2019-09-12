import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectInfoService implements OnInit {
  // 审核状态
  public auditStatus = [
    // { key: '全部', value: 0 },
    { key: '待指派', value: 1 },
    { key: '超时', value: 2 },
    { key: '待审查', value: 3 },
    { key: '不通过', value: 4 },
    { key: '通过', value: 5 }
  ]
  // 项目状态
  public projectStatus = [
    // { key: '全部', value: 0 },
    { key: '勘探', value: 1 },
    { key: '可研', value: 2 },
    { key: '立项', value: 3 },
    { key: '投标', value: 4 }
  ]
  // 施工阶段
  public stage = [
    // { key: '全部', value: 0 },
    { key: '初步设计阶段', value: 1 },
    { key: '施工图设计阶段', value: 2 },
    { key: '施工应用阶段', value: 3 },
    { key: '竣工阶段', value: 4 },
    { key: '档案阶段', value: 5 }
  ]
  // 项目类型
  public type = [
    // { key: '全部', value: 0 },
    // { key: '安装工程', value: 1 },
    // { key: '地灾设计', value: 2 },
    // { key: '地灾施工工程', value: 3 },
    { key: '房建工程', value: 4 },
    // { key: '非煤矿山', value: 5 },
    // { key: '钢结构工程', value: 6 },
    // { key: '公路工程', value: 7 },
    // { key: '矿建工程', value: 8 },
    // { key: '桥梁工程', value: 9 },
    { key: '市政工程', value: 10 }
    // { key: '水利电力工程', value: 11 },
    // { key: '隧道工程', value: 12 },
    // { key: '铁路工程', value: 13 },
    // { key: '土地政治工程', value: 14 },
    // { key: '土石方工程', value: 15 },
    // { key: '消防工程', value: 16 },
    // { key: '装饰工程', value: 17 },
    // { key: '综合', value: 18 },
    // { key: '其他', value: 19 }
  ]
  constructor() {
  }

  ngOnInit() {
    this.filterStageByRole()
  }

  filterStageByRole() {
    this.stage  = [
      // { key: '全部', value: 0 },
      { key: '初步设计阶段', value: 1 },
      { key: '施工图设计阶段', value: 2 },
      { key: '施工应用阶段', value: 3 },
      { key: '竣工阶段', value: 4 },
      { key: '档案阶段', value: 5 }
    ]
    const currentRoleCode = JSON.parse(window.localStorage.getItem('APDInfo'))['roleCode']
    if (currentRoleCode === 'SYSTEM_DesignSection') {
      this.stage = this.stage.filter((item) => item.value === 1 || item.value === 2)
    } else if (currentRoleCode === 'SYSTEM_ManagementSection') {
      this.stage = this.stage.filter((item) => item.value === 3 || item.value === 4)
    } else if (currentRoleCode === 'SYSTEM_DocumentSection') {
      this.stage = this.stage.filter((item) => item.value === 5)
    }
  }

  findKeyByValue(list, value) {
    const res = list.find((item) => item.value == value)
    return res ? res.key : '-'
  }
}
