import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { CDNFILEURL } from './../../config';
import { MessageService } from './../../services/message.service';
import { NeonTreeNode } from '../../common/neon';
import { Params } from '@angular/router';
import { NeonService } from 'src/app/services/neon.service';
import { ProjectModelService } from 'src/app/services/project-manage/project-model.service';
import CryptoJS from 'crypto-js'

@Component({
  selector: 'app-model-panel',
  templateUrl: './model-panel.component.html',
  styleUrls: ['./model-panel.component.scss']
})
export class ModelPanelComponent implements OnInit {

  @Input() modelId: string;
  @Input('projectId') projectId: string;
  @Input('modelGroupId') modelGroupId: string;
  public loading = false;
  public leftBench: any;
  public selectNewModelId: number[] = [];
  public modelTreeList: any = [];
  public toolBarWidth = '50%';
  public dragStart = false;
  // 工具栏样式
  public gumToolBar = {
    style: {
      position: 'absolute',
      top: 'calc(100% - 80px)',
      buttom: '40px',
      left: this.toolBarWidth,
      transform: 'translateX(-50%)',
      zIndex: '800'
    }
  };
  constructor(
    private message: NzMessageService,
    private baseService: ProjectModelService,
    private messageService: MessageService,
    private _neonSrv: NeonService
  ) {

  }

  public Observer() {
    this.messageService.get().subscribe((res) => {
      this.dragStart = res.dragStart;
      // console.log(this.dragStart)
    }
    )
  }

  // 个人公司保密
  getSignature(appId, appSecret, appKey, ticks) {
    let plainText = "a=" + appId + "&s=" + appSecret + "&t=" + ticks;
    let hs = CryptoJS.HmacSHA1(plainText, appKey);
    let pText = CryptoJS.enc.Utf8.parse(plainText);
    let all = hs.concat(pText);
    let sign = CryptoJS.enc.Base64.stringify(all);
    return sign;
  }

  // 模型3.1
  async getModelInfo() {
    this.loading = true;
    // const model = JSON.parse(window.localStorage.getItem('model'));
    const json = { ModelGroupId: this.modelGroupId }
    // 从业务接口获取模型列表
    const res = await this.baseService.getModelLists({
      modelGroupId: this.modelGroupId,
      maxResultCount: 1000,
      projectId: this.projectId
    });
    // console.log(res.result)
    if (!res.success) {
      return;
    }

    // 获取模型链接关系 
    const resLink = await this.baseService.modelRelation(json.ModelGroupId);
    // console.log('模型链接关系', resLink.items)
    // console.log(json)
    // 处理矩阵
    let modelMatrix = await this.applyMatrix(resLink.items)

    // 创建容器*****************
    const left: HTMLDivElement = document.getElementById('ModelContainer') as HTMLDivElement;
    this.leftBench = gum.Scott.create({
      'container': left, 'projectId': json.ModelGroupId, dock: 4, 'system': gum.SystemType.ST_3D
    });
    // 个人公司保密
    let appId = "E7CJK520190409173131";
    let appSecret = "111"; // 保密
    let appKey = "4D2EE494BDB23AB708131858559C0105"; // 保密
    let ticks = new Date().getTime();
    let token = this.getSignature(appId, appSecret, appKey, ticks);
    gum.Apis.getApi(this.leftBench)['3D'].setBenchKey(appId, ticks, encodeURIComponent(token));
    // console.log(this.leftBench)
    this.baseService.leftBench = this.leftBench;
    this.messageService.send(this.leftBench)
    gum.Apis.getApi(this.leftBench).UI.enableToolBars(false);
    // 启动bench，会启动渲染循环
    gum.Scott.run(this.leftBench);

    // 循环渲染
    res.result.items.forEach((model) => {
      // console.log(model)
      // console.log(modelMatrix)
      const path = model.path.split('.')[0];
      // 模型匹配
      const finder = this.THFindMatchValue(modelMatrix, 'modelName', model.fileName)
      // console.log(finder)
      // 匹配到后才执行渲染
      if (finder.length > 0) {
        // console.log(finder)
        gum.Scott.load(this.leftBench, {
          url: CDNFILEURL + '/' + path + '/',
          workerUrl: '../../../assets/js/',
          orgModelId: finder[0].orgModelId,
          newModelId: finder[0].newModelId,
          modelMatrix: finder[0].matrix
        });
      }
    });
    this.loading = false;
    // this.common(json, path, resLink);
    this._click();
    this.regoin()
    // this.mousedown();
    const tapi = gum.Apis.getApi(this.leftBench);
    tapi['3D'].addControlEventListener('scheduleClick', async () => {
      this.messageService.send('scheduleClick')
    });
  }



  // 逆乘矩阵队列
  applyMatrix(nodes) {
    let nodeQueue = [];
    // console.log(nodes)
    nodes.forEach((node) => {
      if (node.matrix instanceof Array) {
        node.matrix = new gum.Matrix43D().fromArray(node.matrix);
      }
    });
    nodeQueue.push.apply(nodeQueue, nodes);
    while (nodeQueue.length) {
      let node = nodeQueue.shift();
      if (node.Children && node.Children.length > 0) {
        node.Children.forEach((cn) => {
          if (cn.matrix instanceof Array) {
            cn.matrix = new gum.Matrix43D().fromArray(cn.matrix).premultiply(node.matrix as gum.Matrix43D);
          } else if (!(cn.matrix instanceof gum.Matrix43D)) {
            cn.matrix = new gum.Matrix43D;
          }
          nodeQueue.push(cn);
        });
      }
    }
    return nodes;
  }

  public async _click() {
    // 监听点击事件
    const tapi = gum.Apis.getApi(this.leftBench);
    await tapi['3D'].addSelectEventListener('click', async (result) => {
      // console.log(result)
      if (result.point === undefined) { this.messageService.send({ properties: [], uuids: [] }); return; }
      const uuid = gum.btoa(result.uuids[0]);
      // console.log(uuid)
      // 获取选中构件的uuid
      let UUIDS = tapi['3D'].getSelected();
      let btoaUUIDS = [];
      UUIDS.forEach((element) => {
        btoaUUIDS.push(gum.btoa(element));
      });
      // console.log(btoaUUIDS)
      const json = {
        ModelGroupId: this.modelGroupId, /*JSON.parse(window.localStorage.getItem('model'))['id'],*/
        shapeInstanceId: uuid
      };
      const resultCom = await this.baseService.singleComponent(json);
      // console.log(JSON.parse(resultCom.item).PropertySets[0].Properties)
      const arr = JSON.parse(resultCom.item).PropertySets[0].Properties;
      this.messageService.send({ properties: arr, uuids: btoaUUIDS });
    })
    // debugger;
    tapi['3D'].removeSelectEventListener();
  }


  // 框选事件
  public regoin() {
    const tapi = gum.Apis.getApi(this.leftBench);
    tapi['3D'].addSelectEventListener('regoin', async (e: any) => {
      // console.log(e)
      let uuids = tapi['3D'].getSelected();
      let btoaUUIDS = [];
      uuids.forEach((element) => {
        btoaUUIDS.push(gum.btoa(element));
      });
      this.messageService.send({ regoin: true, uuids: btoaUUIDS });
    })
    tapi['3D'].removeSelectEventListener();
  }



  // tslint:disable-next-line: member-ordering
  public THFindMatchValue = (() => {
    let resultArr = new Array();
    let getTickMenuId = function (obj, key, val) {
      // tslint:disable-next-line: triple-equals
      if (undefined == obj || null == obj || !(obj instanceof Object)) {
        return;
      }
      // tslint:disable-next-line: triple-equals
      if (obj[key] && obj[key] == val) {
        resultArr.push(obj);
      }
      if (null != obj.Children && obj.Children instanceof Array) {
        for (let child of obj.Children) {
          getTickMenuId(child, key, val);
        }
      }
    };
    return (arr, key?: string, val?) => {
      resultArr = new Array();
      if (arr.length > 0) {
        for (let rootMenu of arr) {
          getTickMenuId(rootMenu, key, val);
        }
      }
      return resultArr;
    };
  })();



  // 工具栏事件
  toolbarEvent(e) {
    // console.log(e);
    if (e.type === 'gantt') { // 打开gantt图
      if (e.parma) {
        this.toolBarWidth = '26%';
      } else {
        this.toolBarWidth = '50%';
      }

      this.messageService.send('scheduleClick');
    }
    if (e.type === 'openEditstatus') { // 进入检验批编辑模式
      this.messageService.send(e);
    }
    if (e.type === 'region') { // 进入框选模式
      this.messageService.send(e);
    }
    if (e.type === 'fullScreenSwitch') {
      if (e.param) {
        const full = document.getElementsByClassName('project-model')[0];
        this.launchIntoFullscreen(full);
      } else {
        this.closefullscreen();
      }
    }
    if (e.type === 'bind') {
      this.messageService.send('bind');
    }
    if (e.type === 'unbind') {
      this.messageService.send('unbind');
    }
  }
  public launchIntoFullscreen(element) {
    console.log(element)
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  public closefullscreen() {
    const docWithBrowsersExitFunctions = document as Document & {
      mozCancelFullScreen(): Promise<void>;
      webkitExitFullscreen(): Promise<void>;
      msExitFullscreen(): Promise<void>;
    };
    if (docWithBrowsersExitFunctions.exitFullscreen) {
      docWithBrowsersExitFunctions.exitFullscreen();
    } else if (docWithBrowsersExitFunctions.mozCancelFullScreen) { /* Firefox */
      docWithBrowsersExitFunctions.mozCancelFullScreen();
    } else if (docWithBrowsersExitFunctions.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      docWithBrowsersExitFunctions.webkitExitFullscreen();
    } else if (docWithBrowsersExitFunctions.msExitFullscreen) { /* IE/Edge */
      docWithBrowsersExitFunctions.msExitFullscreen();
    }
    // this.isfullscreen = false;
  }

  ngOnInit() {
    this.Observer()
  }
  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    gum.Scott.destroy(this.leftBench);
    // console.log('模型已經銷毀')
  }
  // tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges(changes: { [propName: string]: SimpleChanges }) {
    if (changes['projectId']) {
      this.getModelInfo()
    }
  }

}
