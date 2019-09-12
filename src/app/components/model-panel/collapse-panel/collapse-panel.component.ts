import { Component, OnInit, ViewChild, ElementRef, SimpleChanges, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NzFormatEmitEvent, NzTreeNode, NzMessageService } from 'ng-zorro-antd';
import { bindInfo } from '../model-panel.model';
import { MessageService } from 'src/app/services/message.service';
import { ProjectModelService } from 'src/app/services/project-manage/project-model.service';
import { FileManageService } from 'src/app/services/file-manage/file-manage';
import { Utils } from 'src/app/common/helper/util-helper';

@Component({
  selector: 'app-collapse-panel',
  templateUrl: './collapse-panel.component.html',
  styleUrls: ['./collapse-panel.component.scss']
})

export class CollapsePanelComponent implements OnInit {
  // @ViewChild('modalContent', { static: false }) modalContent: ElementRef;

  constructor(
    private messageService: MessageService,
    public baseService: ProjectModelService,
    private router: Router,
    private routeInfo: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public fileManageService: FileManageService,
    private message: NzMessageService
  ) { }
  @ViewChild('treeCom', { static: false }) treeCom;
  @Input('projectId') projectId: string;
  @Input('modelGroupId') modelGroupId: string;

  // public projectId = JSON.parse(window.localStorage.getItem('project')).id;
  // public modelGroupId = JSON.parse(window.localStorage.getItem('model')).id;
  public bindInfo = new bindInfo({projectId: this.projectId, modelGroupId: this.modelGroupId});

  public loading = false;
  // 关闭按钮总控制
  public rightShow = true;
  // 监听左侧是否为三维模型或验收节点状态
  public isRightCard = true;
  // 检验批编辑模式状态
  public openEditstatus = false;
  // 是否选择验收节点
  public isSelectAcceptanceNode = false;
  // 验收资料列表
  public acceptanceFilesLists: any = [];
  // 同文件夹下pdf文件列表
  public pdfListUnderSameFolder = {
    pdfList: null,
    index: null,
    preDisabled: null,
    preTitle: null,
    nextDisabled: null,
    nextTitle: null
  };
  // 查看模式检验批目录列表
  public lotFileList = [];
  public imgStyle: any = {};
  public appoint: any;
  public compentLists: any = [];
  public componentShow = true;
  public valueLists: any = [];
  // 预览pdf
  public isPDFView = false;
  // pdfjs地址
  public prefixUrl = '/assets/pdfjs/web/viewer.html?file=';
  // 预览标题
  public viewTitle: string;
  // 预览框模态框样式
  public viewStyle: any = { 'height': '700px', 'width': '70%' };
  // 内容样式
  public viewBodyStyle = { 'height': '700px', 'width': '100%' };
  public pdfSrc: any = '';
  // 右键弹出框样式
  public isShowControlModel = false;
  public controlModelStyle = {};
  // 选择目标检验批弹出框状态
  public isMoveUUID = false;
  // 构件信息，检验批资料显示状态
  public showStatus: any = true;
  // 选择的构件UUIDS  abot 后的
  public UUIDS = [];
  // 待操作的节点
  public bindNode: any;
  // 移动构件时待选择的目录树
  public acceptanceNodes = [];
  // 选择移动的目标节点
  public targetNodeForMove: any;
  // 记录选择状态（追加还是移动）
  public isAdd = false;

  public param = {
    maxResultCount: 1000,
    skipCount: 0,
    primaryId: this.projectId,
    primaryId1: '',
    showFloder: true,
    propertiesIds: []
  };


  // 订阅函数
  public observable() {
    this.messageService.get().subscribe((result) => {
      console.log(result);

      if (Array.isArray(result.properties)) {  // 订阅模型构件点击事件，加载构件信息、构件绑定的文件信息

        if (result.properties.length !== 0) {
          this.valueLists = result.properties;
          this.isSelectAcceptanceNode = false;
          this.componentShow = false;
        }

        this.UUIDS = result.uuids;
        this.param.primaryId1 = '';
        this.param.propertiesIds = result.uuids;
        if (this.UUIDS.length && this.param.propertiesIds.length !== 0) {
          this.queryFileList();
        }

      } else if (result.type === 'region') { // 进入框选
        // this.isRegion = result.param;
      } else if (result.regoin) { // 开始框选鼠标事件触发
        this.UUIDS = result.uuids;
      } else if (result.type === 'openEditstatus') { // 点击编辑模式按钮
        this.openEditstatus = !this.openEditstatus;
        if (this.openEditstatus) { // 进入检验批编辑模式
          this.UUIDS = [];
          this.bindNode = null;
        } else {  // 离开检验批编辑模式
        }
      } else if (typeof (result) === 'boolean') { // 左侧选项卡切换
        this.isRightCard = result;
        if (!this.isRightCard) { }
      } else if (result.pType === 11) { // 点击查看模式下验收节点
        this.isSelectAcceptanceNode = true;
        this.param.primaryId1 = result.id;
        this.param.propertiesIds = [];
        this.queryFileList();
      } else if (result.currentNode) { // 点击编辑模式下验收节点结构树
        this.isShowControlModel = false;
        this.UUIDS = []; // 初始化选中构件
        if (result.currentNode !== this.bindNode && result.currentNode !== 'null') {
          this.bindNode = result.currentNode;
        } else {
          this.bindNode = null;
        }
      } else if (result === 'bind') { // 点击工具栏绑定构件
        if (!this.openEditstatus) { return this.message.warning('请先进入检验批编辑模式'); }
        if (this.UUIDS.length === 0) { return this.message.warning('请选择构件'); }
        if (!this.bindNode) { return this.message.warning('请选择待绑定的检验批'); }
        if (this.bindNode.origin.pType !== 15) { return this.message.warning('该节点无法进行绑定操作'); }
        this.saveUuidsTolot(this.UUIDS, this.bindNode);
      } else if (result === 'unbind') { // 点击工具栏解绑构件
        if (!this.openEditstatus) { return this.message.warning('请先进入检验批编辑模式'); }
        if (this.UUIDS.length === 0) { return this.message.warning('请选择构件'); }
        if (!this.bindNode) { return this.message.warning('请选择待解绑的检验批'); }
        if (this.bindNode.origin.pType !== 15) { return this.message.warning('该节点无法进行解绑操作'); }
        // this.saveUuidsTolot(this.UUIDS, this.bindNode);
        this.modefiyUUID(1);
      } else if (typeof (result) === 'number') { // 传递benchID 初始化模型页面时挂载鼠标事件
        this.mousedown(result);
        this.UUIDS = []
      } else if (result.acceptanceNodes) {  // 保存编辑模式下节点树数据
        this.acceptanceNodes = result.acceptanceNodes;
      }
    });
  }



  /**
   * 模型属性
   */
  public async getComponent() {
    // const model = JSON.parse(window.localStorage.getItem('model'));
    const json = {
      ModelGroupId: this.modelGroupId
    };
    // 获取 当前ModelGroupId的解析关系
    const resLink = await this.baseService.modelRelation(json.ModelGroupId);
    console.log(resLink)
    // 获取构件属性
    const result = await this.baseService.modelComponent({
      modelGroupId: this.modelGroupId, /*JSON.parse(window.localStorage.getItem('model')).id,*/
      modelId: resLink.items[0].newModelId
    });
    this.compentLists = result.items;
    // console.log(this.compentLists)
  }



  // 验收资料相关****************************************************************

  public async queryFileList() { // 查询构件绑定的检验批文件

    const result = await this.fileManageService.QueryPagedListForCheckP(this.param);
    if (result.success) {
      if (result.result.items) {
        const originList = result.result.items;
        originList.forEach((element) => {
          if (element.fileId) {
            element.icon = 'anticon anticon-file-pdf';
          } else {
            element.icon = 'anticon anticon-folder-fill';
          }
        });
        // console.log(originList);


        const resultNodes = Utils.renderTreeNodeForTreePanel(originList, null, 15, 3, this.param.propertiesIds);
        // console.log('当前构件绑定的所有检验批', resultNodes);
        if (this.param.propertiesIds.length > 0) { this.lotFileList = resultNodes; } else { this.acceptanceFilesLists = resultNodes; }

      }
    }
  }

  // 资料搜索
  searchEvent(event: NzFormatEmitEvent): void {
    console.log(event, this.treeCom.getMatchedNodeList().map((v) => v.title));
  }
  // 验收资料列表点击事件(预览)
  acceptanceFileClickEvent(e, isCheckP = false) {
    if (e.node.origin.extension === '.pdf') {
      // 获取文件夹下pdf文件列表
      let filesList;
      if (isCheckP) {
        filesList = this.lotFileList;
      } else {
        filesList = this.acceptanceFilesLists;
      }
      filesList.forEach((element) => {
        if (element.id == e.node.origin.parentId) {
          this.pdfListUnderSameFolder.pdfList = element.children;
          this.pdfListUnderSameFolder.index = this.pdfListUnderSameFolder.pdfList.indexOf(e.node.origin);
          const index = this.pdfListUnderSameFolder.index;
          this.pdfListUnderSameFolder.nextDisabled = null;
          this.pdfListUnderSameFolder.nextTitle = '下一文件';
          this.pdfListUnderSameFolder.preDisabled = null;
          this.pdfListUnderSameFolder.preTitle = '上一文件';
          if (index == 0) {
            this.pdfListUnderSameFolder.preDisabled = 'disabled';
            this.pdfListUnderSameFolder.preTitle = '前面木有更多了';
          }
          if (index == this.pdfListUnderSameFolder.pdfList.length - 1) {
            this.pdfListUnderSameFolder.nextDisabled = 'disabled';
            this.pdfListUnderSameFolder.nextTitle = '后面木有了';
          }
        }
      });
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.prefixUrl + e.node.origin.url);
      console.log(this.pdfSrc);
      this.viewTitle = e.node.origin.name;
      this.isPDFView = true;
    }

  }

  public launchIntoFullscreen(element) {
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


  // 验收资料双击打开文件夹
  openFolder(data: NzTreeNode | Required<NzFormatEmitEvent>): void {
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      const node = data.node;
      console.log(node);
      if (!node.isLeaf) {
        node.isExpanded = !node.isExpanded;
      }
    }
  }

  // 预览全屏
  public pdfGoFull() {
    const full = document.getElementById('pdf');
    this.launchIntoFullscreen(full);
  }

  // 上一pdf
  public previousPdf() {
    const index = this.pdfListUnderSameFolder.index - 1;
    if (index == 0) {
      this.pdfListUnderSameFolder.preDisabled = 'disabled';
      this.pdfListUnderSameFolder.preTitle = '前面木有更多了';
    }
    this.pdfListUnderSameFolder.nextDisabled = null;
    this.pdfListUnderSameFolder.nextTitle = '下一文件';
    this.pdfListUnderSameFolder.index = index;
    const pdf = this.pdfListUnderSameFolder.pdfList[index];
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.prefixUrl + pdf.url);
    this.viewTitle = pdf.name;
    this.isPDFView = true;
  }

  // 下一pdf
  public nextPdf() {
    const index = this.pdfListUnderSameFolder.index + 1;
    if (index == this.pdfListUnderSameFolder.pdfList.length - 1) {
      this.pdfListUnderSameFolder.nextDisabled = 'disabled';
      this.pdfListUnderSameFolder.nextTitle = '后面木有了';
    }
    this.pdfListUnderSameFolder.preDisabled = null;
    this.pdfListUnderSameFolder.preTitle = '上一文件';
    this.pdfListUnderSameFolder.index = index;
    const pdf = this.pdfListUnderSameFolder.pdfList[index];
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.prefixUrl + pdf.url);
    this.viewTitle = pdf.name;
    this.isPDFView = true;
  }

  // 验收资料相关结束****************************************************************



  // 绑定解绑 构件文件信息相关 ********************************************************

  /**
   * 对检验批文件夹绑定构件（保存业务端）
   * @param UUIDS:Array 原始构件ID数组
   * @param bindNode  待绑定的节点
   * @param isFristBind: boolen 是否第一次绑定
   */
  public async saveUuidsTolot(UUIDS: Array<any>, bindNode, isFristBind?: boolean) {
    this.message.loading('绑定中...')
    this.bindInfo.documentId = bindNode.key;
    this.bindInfo.propertyIds = UUIDS;
    const res = await this.baseService.bindToLots(this.bindInfo);
    if (res.success) {
      this.message.success('绑定成功');
      const arr = bindNode.origin.propertyIds;
      UUIDS.forEach((id) => {
        if (arr.indexOf(id) == -1) {
          arr.push(id);
        }
      });
      bindNode.origin.propertyIds = arr;
    }
  }

  //  鼠标点击抬起事件

  public mousedown(leftBench) {

    const tapi = gum.Apis.getApi(leftBench);
    tapi.UI.addEventHandler('mouseup', async (e: any) => {

      // console.log(e)
      console.log(this.UUIDS)
      console.log(this.bindNode)
      if (e.button === 2 && e.buttons === 0) {
        if (this.UUIDS.length === 0 || !this.bindNode) { return; }
        if (this.bindNode.origin.pType !== 15) { return; }
        document.oncontextmenu = function (ev) { return false; };
        e.stopPropagation();
        e.preventDefault();
        this.controlModelStyle = {
          'top': e.clientY + 'px',
          'left': e.clientX + 'px'
        };
        this.isShowControlModel = true;
      } else {
        this.isShowControlModel = false;
      }

    });
  }

  /**
  * 构件操作
  * @param type:number  1、去除 2、移至 3、加入
  */
  public async modefiyUUID(type: number) {
    this.loading = true;
    this.bindInfo.propertyIds = this.UUIDS;
    if (type === 1) {
      this.bindInfo.documentId = this.bindNode.key;
      const res = await this.baseService.unbindToLots(this.bindInfo);
      if (res.success) {
        this.messageService.send({ modifySuccess: 'modifySuccess', propertyIds: this.bindInfo.propertyIds, type });
        this.message.success('操作成功');
      }
    } else if (type === 2) {
      this.bindInfo.oldDocumentId = this.bindNode.key;
      this.isMoveUUID = true;
    } else if (type === 3) {
      this.isAdd = true;
      this.isMoveUUID = true;
    }
    this.isShowControlModel = false;

    // this.loading = false;
  }

  // 目标节点选择框点击事件
  public nodesClickEvent(node) {
    console.log(node);
    if (node) { this.targetNodeForMove = node; }
  }
  public async moveUUid() {
    if (this.targetNodeForMove) {
      this.bindInfo.documentId = this.targetNodeForMove.key;
    }
    const res = await this.baseService.moveToLots(this.bindInfo);
    if (res.success) {
      const type = this.isAdd ? 3 : 2;

      // tslint:disable-next-line: max-line-length
      this.messageService.send({ modifySuccess: 'modifySuccess', propertyIds: this.bindInfo.propertyIds, tagetNode: this.targetNodeForMove, type });
      if (res.result && !this.isAdd) { // 移动操作
        // 删除bindNode
        const ids = this.bindNode.origin.propertyIds;
        this.bindInfo.propertyIds.forEach((item) => {
          const index = ids.indexOf(item);
          if (index > -1) {
            ids.splice(index, 1)
          }
        });
        this.bindNode.origin.propertyIds = ids;
      }
      // 添加到targetNodeForMove(弹出层的treenode)
      const prids = this.targetNodeForMove.origin.propertyIds;
      if (!this.targetNodeForMove.propertyIds) { this.targetNodeForMove.propertyIds = []; }
      this.targetNodeForMove.propertyIds.forEach((item) => {
        const index = prids.indexOf(item);

        if (index == -1) {
          prids.push(item);
        }
      });
      this.targetNodeForMove.origin.propertyIds = prids;



      this.message.success('操作成功');
      this.UUIDS = [];
      this.isAdd = false;
      this.bindInfo = new bindInfo({projectId: this.projectId, modelGroupId: this.modelGroupId});
      this.isMoveUUID = false;
    }

  }


  /**
   * 渲染构件uuid
   * @param uuids 原始UUID
   */
  public renderUuid(uuids: string[]) {


    const tapi = gum.Apis.getApi(this.baseService.leftBench);
    tapi['3D'].hiddenAll();
    uuids.forEach((uid) => {
      tapi['3D'].highlightComponent(gum.atob(uid));
    });
    tapi['3D'].update();
  }

  // *******************绑定解绑 构件文件信息相关结束 ***************************************


  // 构件信息，构件资料
  public switch(value) {
    if (value === 'info') {
      this.showStatus = true;

    } else {
      this.showStatus = false;

    }
  }

  // 控制右侧模块总开关
  public rightOpen() {
    this.rightShow = true;
  }
  /**
   * 关闭
   */
  public closeRight() {
    this.rightShow = false;
  }

  ngOnInit() {
    this.observable();
    this.getComponent();
  }
}
