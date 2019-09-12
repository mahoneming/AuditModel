import { ChangeDetectionStrategy, Component, OnInit, ViewChild, TemplateRef, AfterViewInit, Input } from '@angular/core';
import { NzTreeNode, NzTreeNodeOptions, NzFormatEmitEvent, NzTreeComponent, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { TransferChange, TransferItem } from 'ng-zorro-antd/transfer';
//import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { NeonTreeNode } from '../../../common/neon';

import { MessageService } from './../../../services/message.service';
import { addAcceptanceNodeModel, upLoadFileModel } from '../model-panel.model';
import { Utils, Lang, Status } from '../../../common/helper/util-helper';
import { FileHelper } from '../../../common/helper/file-helper';
import { FileUploaderComponent } from '../../../components/file-uploader/file-uploader.component';
import { ZzjFileUploader, FlowFileModel } from '@zzj/nag-file-uploader';
import { isNullOrUndefined } from 'util';
import { async } from '@angular/core/testing';
import { element, promise } from 'protractor';
import { stringify } from 'querystring';
import { finished } from 'stream';
import { NeonService } from 'src/app/services/neon.service';
import { FileManageService } from 'src/app/services/file-manage/file-manage';
import { ProjectModelService } from 'src/app/services/project-manage/project-model.service';
declare var Neon: any;
@Component({
    selector: 'app-tree-panel',
    templateUrl: './tree-panel.component.html',
    styleUrls: ['./tree-panel.component.scss']
})
export class TreePanelComponent implements OnInit {

    changeDetection: ChangeDetectionStrategy.OnPush;
    @ViewChild('modelUploader', { static: false }) modelUploader: FileUploaderComponent;
    @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent: NzTreeComponent;
    @Input('projectId') projectId: string;
    @Input('modelGroupId') modelGroupId: string;


    public isSpinning = false;
    public treeNode: any = [];
    // 模型内置结构树中默认勾选的节点
    public defaultCheckedKeys = [];
    public show = true;
    // 控制左侧总菜单显示隐藏
    public leftShow = true;
    // 查看模式下验收节点数组
    public acceptanceNode: any = [];
    // 编辑模式下验收节点树
    public acceptanceNodes: any = [];
    // 检验批数据源
    public allOriginDatas = [];
    // 查看模式验收节点文件夹点击
    public folderExpanded = false;

    // 添加验收节点第一步
    public addAcceptanceNodeStep1 = false;
    // 添加验收节点第二步
    public addAcceptanceNodeStep2 = false;
    // 创建验收节点参数类
    public addAcceptanceNodeModel = new addAcceptanceNodeModel({projectId: this.projectId, modelGroupId: this.modelGroupId});
    // 上传检验批PDF文件参数
    public upLoadFileModel = new upLoadFileModel();
    public leftBench: any;
    public selectNewModelId: number[] = [];
    public modelTreeList: any = [];
    // 编辑模式下结构树搜索值
    public searchValue: any;
    // 检验批模板树搜索值
    public searchValue1: any;
    // 是否显示模型颜色
    public showColor = true;

    // 穿梭框变量********************************
    // 检验批原始数据
    public originAllTemplateList = [];
    public templateNodes = [];
    // 穿梭框选中的检验批节点
    public checkedNodeList = [];
    // 选中节点的templateId集合
    public templateIdArr = [];

    // 存放选择检验批模板点击后的node
    public opaciyNodes = [];
    // 存放检验批原有文件
    public repeatNodes = [];
    // 穿梭框变量结束********************************

    // 时间及颜色
    public transInfo = {
        PlanTimeRange: [],
        FinishTimeRange: [],
        Color: '#41D6E5',
        MppId: ''
    };
    // 限制文件类型
    public fileType = '.pdf';
    // 是否检验批编辑状态
    public openEditstatus = false;
    // 编辑模式下当前操作的验收节点或子节点
    public currentNode: any = null;

    // 文件上传列表页面变量*****************
    public isUploadfile = false;
    public isAllDisplayDataChecked = false;
    public isIndeterminate = false;
    public listOfDisplayData: any[] = [];
    // 当前文件下文件列表
    public listOfAllData: any[] = [];
    public mapOfCheckedId: { [key: string]: boolean } = {};
    // 上传按钮显示状态
    public fileShow = true;
    // 文件组件样式
    public modelStyle: any = { 'display': 'none' };
    // 文件队列
    public modelQueue: any = [];
    // ************ 文件上传列表页面变量结束
    // public projectId: any = JSON.parse(window.localStorage.getItem('project')).id;
    // public modelGroupId: any = JSON.parse(window.localStorage.getItem('model')).id;
    public allDataIds: any = []; // 所有Tree数据源标识

    constructor(
        private _neonSrv: NeonService,
        private baseService: ProjectModelService,
        private messageService: MessageService,
        private message: NzMessageService,
        public fileManageService: FileManageService,
        public mzModal: NzModalService

    ) { }

    // 订阅函数**************************************************
    public observable() {
        // 监听检验批编辑模式状态
        this.messageService.get().subscribe((result) => {
            // console.log(result)
            if (result.type === 'openEditstatus') {
                this.openEditstatus = !this.openEditstatus;
                if (this.openEditstatus) {
                    this.message.info('进入检验批编辑模式');
                    // 初始化编辑模式状态
                    // if (this.showColor && this.acceptanceNode.length !== 0) {
                    //     this.renderColorUuid(this.acceptanceNode)
                    // } else {
                    //     this.initModel();
                    // }
                    this.initModel();
                    this.QueryAllList();
                } else {
                    this.message.info('离开检验批编辑模式');
                    // 初始化编辑模式状态
                    this.initModel();
                    this.show = true;
                    this.messageService.send(true);
                    this.QueryFolderByType11();
                }
                // console.log(this.openEditstatus);
            }
            if (result === 'modifySuccess') {
                this.QueryAllList();
                this.QueryFolderByType11();
            }
            if (result.modifySuccess === 'modifySuccess') { // 右键操作成功后
                let type = result.type;
                let currentPropertys = this.currentNode.origin.propertyIds;
                // 添加到目标
                if (result.tagetNode) {
                    for (let index = 0; index < result.propertyIds.length; index++) {
                        let index = this.allDataIds.indexOf(result.tagetNode.key);

                        if (index > -1) {
                            let item = this.allOriginDatas[index];
                            result.propertyIds.forEach(obj => {
                                if (item.propertyIds.indexOf(obj) == -1) {
                                    item.propertyIds.push(obj);
                                }
                            });
                        }
                    }
                }

                // 删除源
                if (type && (type === 1 || type === 2)) {
                    for (let index = 0; index < result.propertyIds.length; index++) {
                        const idx = currentPropertys.indexOf(result.propertyIds[index])
                        currentPropertys.splice(idx, 1);
                    }
                    this.renderUuid(currentPropertys)
                }
                this.QueryFolderByType11();
            }

            if (result.currentNode) { // 编辑模式下点击验收节点
                this.defaultCheckedKeys = [];
            }
            if (Array.isArray(result.properties) && result.uuids.length !== 0) {

                // 点击构件时，重置查看模式下节点点击样式
                if (this.acceptanceNode.length !== 0) {
                    this.acceptanceNode.forEach(el => {
                        el.isExpanded = false;
                        el.style = {
                            'background-color': 'white'
                        };
                    });
                }
            }
        });

    }



    /**
     *构件模型树部分**************************************************************************************************
     */
    public async getTreeNode() {
        this.treeCommon(this.modelGroupId, '测试');
    }

    public async treeCommon(modelGroupId, fileName) {

        // 模型链接关系
        const resLink = await this.baseService.modelRelation(modelGroupId);
        // 获取模型结构树
        // console.log(resLink);
        const items = resLink.items;
        // console.log('模型链接关系', items);
        this.findTree(items, modelGroupId);
    }


    public async findTree(items, modelGroupId) {
        // 2019.6.5 组装树 V2.0
        if (items) {
            let resTree = await this.baseService.modelTrees({ modelGroupId: modelGroupId });
            // console.log("resTree", resTree.items)
            let filterNode = await this.ModelTree2NzTree(resTree.items);
            this.treeNode = filterNode.resultArr;
            // 全选状态
            this.defaultCheckedKeys = filterNode.defaultCheckedKeys;
        }
        // console.log('结构树列表', this.treeNode);
    }

    // 重组tree,将获取到的数据组装成tree组件需要的数据
    // tslint:disable-next-line: member-ordering
    public ModelTree2NzTree = (() => {
        let resultArr = new Array();
        let defaultCheckedKeys = [];

        const getTickMenuId = function (resultArr, obj) {
            // tslint:disable-next-line: triple-equals
            if (undefined == obj || null == obj || !(obj instanceof Object)) {
                return;
            }

            const node: NzTreeNodeOptions = {
                title: obj.modelName ? obj.modelName : obj.name,
                key: obj.modelName ? obj.modelName : obj.name,
                children: [],
                instanceGuids: obj.instanceGuids ? obj.instanceGuids : [],
                isLeaf: false,
                isChecked: true,
                // defaultCheckedKeys
            };
            // this.defaultCheckedKeys.push(obj.ModelName ? obj.ModelName : obj.Name);
            resultArr.push(node);
            defaultCheckedKeys.push(obj.modelName ? obj.modelName : obj.name);

            if (obj.spatialStructure && obj.spatialStructure.children.length !== 0) {
                for (const child of obj.spatialStructure.children[0].children) {
                    // if (child.name !== 'DefaultFloor') {
                    getTickMenuId(node.children, child);
                    // }
                }
            }
            if (null != obj.children && obj.children instanceof Array) {
                for (const child of obj.children) {
                    if (child.hasFile == true || isNullOrUndefined(child.hasFile)) {
                        getTickMenuId(node.children, child);
                    }
                }
            }
        };
        return (arr, key?: string, val?) => {
            resultArr = new Array();
            if (arr.length > 0) {
                for (const rootMenu of arr) {
                    getTickMenuId(resultArr, rootMenu);
                }
            }
            return { resultArr, defaultCheckedKeys };
        };
    })();

    // 勾选节点树
    mouseClick = (event) => {
        // console.log(event);
        if (event.nodes) {
            this.common(event.nodes);
        }
    }
    /**
          * 渲染模型
          * @param model
          */
    public common(treeNode) {
        // console.log(treeNode)
        const tapi = gum.Apis.getApi(this.baseService.leftBench);
        const InstanceGuids = this._neonSrv.SelectFloorAndMajorAndClass(treeNode);
        // this.currentTreeNode = treeNode;

        tapi['3D'].clearHighlight();
        tapi['3D'].hiddenAll();
        tapi['3D'].setRenderState(InstanceGuids, gum.RenderState.VISIBLE);
        tapi['3D'].update();
    }

    public removeModel() {
        gum.Scott.destroy(this.baseService.leftBench);
    }

    // ***************构件模型树结束*****************************************************************************************************



    // tslint:disable-next-line: use-life-cycle-interface
    ngOnDestroy(): void {

    }

    // 显示颜色按钮
    // public controlColor() {

    //     console.log(this.showColor)
    //     this.messageService.send({ controlColor: this.showColor });

    // }
    // public changeColor(e) {
    //     console.log(e)
    //     if (e) {

    //     }
    // }


    /**
    * 获取检验批模板数据 PType=12
    */
    public async QueryAllTemplate(ParentId = null) {

        // let reSetNodes = [];
        const params = {
            maxResultCount: 10000,
            skipCount: 0,
            parentId: ParentId
        };
        const result = await this.fileManageService.QueryProjectCategoryTemplatePagedList(params);
        // console.log('原始模板数据', result.result.items.length);

        if (result.success && result.result.items.length !== 0) {
            let allTemplateList = [];
            allTemplateList = result.result.items;

            allTemplateList.forEach(item => {
                item.title = item.name;
                item.key = item.id;
                // item.guidId = item.id;
                // item.guidPid = item.parentId;
                // item.id = item.intId;
                // item.parentid = item.intPid;
            });
            this.originAllTemplateList = allTemplateList;
        }
        if (this.originAllTemplateList.length !== 0) {
            const tansitNodes = Utils.renderTreeNodeForTreePanel(this.originAllTemplateList);
            this.templateNodes = this.TansitNodes(tansitNodes);

        }
    }

    // 为节点添加图标
    TansitNodes(Nodes) {
        Nodes.forEach(element => {
            element.title = element.name;
            if (element.isLeaf) {
                element.icon = 'anticon anticon-profile';
            } else {
                element.icon = 'anticon anticon-folder-fill';
            }
            if (element.children) {
                this.TansitNodes(element.children);
            }
        });
        return Nodes;
    }

    // /**
    // * 获取查看模式下验收节点列表:PType=11
    // */
    public async QueryFolderByType11() {
        // console.log('加载查看模式下节点');
        const params = {
            maxResultCount: 1000,
            skipCount: 0,
            primaryId: this.projectId,
            pType: 11, // 验收节点
            showFloder: true,
            parentId: this.modelGroupId
        };
        const result = await this.fileManageService.QueryFloderPagedListForCheckP(params);
        // console.log(result);
        if (result.success) {

            if (result.result.items) {

                const acceptanceNodeTemp = result.result.items;
                this.acceptanceNode = acceptanceNodeTemp;
            }
        }
    }



    // 获取编辑模式下验收节点结构树 ：PTypeArr = [11,12,13,15,16]

    public async QueryAllList() {
        const params = {
            showFloder: true,
            maxResultCount: 10000,
            skipCount: 0,
            primaryId: this.projectId,
            PTypeArr: [11, 12, 13, 15, 16] // [验收节点,分部,分项,子检验批项,子文件]
        };
        const result = await this.fileManageService.QueryFloderPagedListForCheckP(params);
        if (result.success) {
            let originList = [];
            if (result.result.items) {
                originList = result.result.items;
                this.allOriginDatas = originList;
                this.allDataIds = [];

                originList.forEach(item => {
                    this.allDataIds.push(item.id);
                });

                // console.log("this.allDataIds", this.allDataIds);

                this.renderTreeNodeToTree(originList, 11, 2, (data) => {
                    data.forEach(el1 => {
                        el1.icon = 'anticon anticon-folder-fill';
                        el1.children.forEach(el2 => {
                            el2.icon = 'anticon anticon-profile';
                        });
                    });
                    this.acceptanceNodes = data;

                    this.messageService.send({ acceptanceNodes: this.acceptanceNodes });
                });
            }

        }
    }
    /**
  * 将数组组合为树形数据结构
  * @param treeNodes 需要转换的数组对象
  *  @param status 组装状态 status： 1 展示所有层级 2 只展示节点文件夹和检验批文件夹层级 3 只展示检验批文件夹
  */
    public async renderTreeNodeToTree(treeNodes, pType?, status?, callBack?) {
        treeNodes = treeNodes || null;
        let originList = [];
        treeNodes.forEach(dataItem => {
            dataItem.title = dataItem.name;
            dataItem.key = dataItem.id;
        });
        originList = treeNodes;
        // console.log('this.modelGroupId:' + this.modelGroupId);
        const resultNodes = Utils.renderTreeNodeForTreePanel(originList, this.modelGroupId, pType, status);
        // tslint:disable-next-line: no-unused-expression
        typeof callBack === 'function' && callBack(resultNodes);

    }


    // 查看模式下验收节点 点击事件，发布
    public exhibition(item) {
        // console.log(item)
        this.acceptanceNode.forEach((el) => {
            el.isExpanded = false;
            el.style = {
                'background-color': 'white'
            };
        });
        item.style = {
            'background-color': '#dfeffb'
        };
        item.isExpanded = true;


        // 渲染当前点击的验收节点模型
        if (item.propertyIds.length !== 0) {
            this.renderUuid(item.propertyIds);
        } else {
            this.renderUuid(item.propertyIds)
        }
        this.messageService.send(item);
    }

    // 验收节点双击打开文件夹
    openFolder(data: NzTreeNode | Required<NzFormatEmitEvent>): void {
        if (data instanceof NzTreeNode) {
            data.isExpanded = !data.isExpanded;
        } else {
            const node = data.node;
            if (node && !node.isLeaf) {
                node.isExpanded = !node.isExpanded;
            }
        }
    }

    // 三维模型，验收节点切换
    public switch(value) {
        if (value === '3D') {
            this.show = true;
            // 点击三维模型时初始化状态
            this.initModel();
            this.messageService.send(true);
        } else {
            // 点击验收节点时初始化状态
            this.show = false;
            // 验收节点为未选择状态
            this.acceptanceNode.forEach(el => {
                el.isExpanded = false;
                el.style = {
                    'background-color': 'white'
                };
            });

            if (this.showColor) {
                this.renderColorUuid(this.acceptanceNode)
            } else {
                this.initModel();
            }

            this.messageService.send(false);
        }
    }



    // 编辑模式下树点击事件
    public editAcceptanceNodesClickEvent(node) {
        console.log(node);
        const flag: any = node;
        if (!this.currentNode) {
            this.currentNode = flag;
        } else if (flag !== this.currentNode) {
            this.currentNode = node;
        } else if (flag === this.currentNode) {
            // 再次点击取消节点选中状态
            this.currentNode = null;
        }

        if (this.currentNode) {
            this.messageService.send({ currentNode: this.currentNode });

            // 渲染绑定的构件
            if (this.currentNode.origin.propertyIds.length !== 0) {
                this.renderUuid(this.currentNode.origin.propertyIds);
            }
        } else {
            this.initModel();
            this.messageService.send({ currentNode: 'null' });
        }
    }


    /**
   * 渲染构件uuid
   * @param uuids 原始UUID
   */
    public renderUuid(uuids: string[]) {
        const tapi = gum.Apis.getApi(this.baseService.leftBench);
        tapi['3D'].clearHighlight();
        tapi['3D'].hiddenAll();
        tapi['3D'].setRenderState(uuids, gum.RenderState.VISIBLE);
        uuids.forEach((uid) => {
            tapi['3D'].highlightComponent(gum.atob(uid));
        });
        tapi['3D'].update();
    }
    /**
    * 渲染构件uuid
    * @param 节点列表 
    */
    public renderColorUuid(nodes: any) {
        const tapi = gum.Apis.getApi(this.baseService.leftBench);
        tapi['3D'].clearHighlight();
        tapi['3D'].hiddenAll();
        nodes.forEach((item) => {
            // tslint:disable-next-line: radix
            let Ucolor = JSON.parse(item.transInfo)['Color']
            console.log(Ucolor)
            item.propertyIds.forEach(uid => {
                tapi['3D'].highlightComponent(gum.atob(uid), Ucolor);
            });
        });
        tapi['3D'].update();
    }

    // 模型初始状态
    public initModel() {
        const tapi = gum.Apis.getApi(this.baseService.leftBench);
        tapi.UI.do(new gum.HomeCommand());
    }

    /**
     * 关闭
     */
    public closeLeft() {
        this.leftShow = false;
    }
    // ***************************检验批编辑模式*************************************************************************************


    public nzEvent(e) {
        // console.log(e);
    }

    // 添加验收节点
    public addAcceptanceNode() {
        this.addAcceptanceNodeModel = new addAcceptanceNodeModel({projectId: this.projectId, modelGroupId: this.modelGroupId});
        this.transInfo.Color = '#41D6E5';
        this.transInfo.PlanTimeRange = [];
        this.transInfo.FinishTimeRange = [];
        this.transInfo.MppId = null;
        this.checkedNodeList = [];
        // 清空step2节点数组
        this.repeatNodes = [];
        this.opaciyNodes = [];
        this.addAcceptanceNodeStep1 = true;
    }

    // 添加验收节点第二步
    async goStepTwo() {
        if (!this.addAcceptanceNodeModel.name) {
            this.message.warning('请输入节点名称');
            return;
        }
        if (this.transInfo.FinishTimeRange.length == 0 || this.transInfo.PlanTimeRange.length == 0) {
            this.message.warning('请选择时间');
            return;
        }
        this.isSpinning = true;
        this.addAcceptanceNodeModel.transInfo = JSON.stringify(this.transInfo);
        await this.Spinning();
    }

    private async Spinning(): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                this.addAcceptanceNodeStep1 = false;
                this.addAcceptanceNodeStep2 = true;
                this.isSpinning = false;
                resolve();
            });
        });
    }
    // ********************检验批编辑模式结束****************************************************************************************


    // *检验批穿梭框************************************************************

    // 选择并添加
    public templateClickEvent(e) {
        console.log('检验批穿梭框');
        console.log(e);
        if (e.node) {
            let isRepeat = false;
            if (e.node.origin.children.length === 0 && e.node.origin.pType === 15) {
                isRepeat = this.checkedNodeList.find((el) => el.TemplateId === e.node.key);
                if (!isRepeat) {
                    this.checkedNodeList.push({ name: e.node.origin.name, TemplateId: e.node.key });
                    e.node.origin.style = {
                        'opacity': '0.4'
                    };
                    this.opaciyNodes.push(e.node);
                    this.addAcceptanceNodeModel.TemplateIds.push(e.node.key);

                } else {
                    this.message.warning('请勿重复选择');
                }

            }
        }
        // 点击后改变模板显示状态


        console.log(this.checkedNodeList);
        console.log(this.addAcceptanceNodeModel.TemplateIds);
    }
    // 移除
    public reMovecheckedNodeList(node) {

        this.getRepeatNodes();

        // console.log(node);
        if (node) {
            const checkedNodeIdx = this.checkedNodeList.findIndex((element) => (element.TemplateId === node.TemplateId));

            console.log(this.opaciyNodes);
            this.opaciyNodes.forEach((el1, idx) => {
                if (el1.origin.id === node.TemplateId) {
                    console.log(el1);
                    el1.origin.style = {
                        'opacity': '1'
                    };
                    this.opaciyNodes.splice(idx, 1);
                }
            });
            if (checkedNodeIdx !== -1) {
                this.checkedNodeList.splice(checkedNodeIdx, 1);
            }
        }

    }

    //选取检验批step2点击右边数据展开左边
    public positionToNode(item) {

        this.getRepeatNodes();

        this.opaciyNodes.forEach(ele => {
            if (ele.origin.id == item.TemplateId) {
                console.log(ele);
                this.openNode(ele.parentNode);
            }
        });
    }

    //展开文件夹
    private openNode(item) {
        item.isExpanded = true;
        if (item.parentNode) {
            this.openNode(item.parentNode);
        }
    }

    private getRepeatNodes() {
        // 获取重复节点
        this.repeatNodes.forEach(item => {
            let node = this.nzTreeComponent.getTreeNodeByKey(item.key);
            // console.log(node);
            this.opaciyNodes.push(node);
        });
    }


    // ************************************************************************穿梭框结束****************

    // 完成节点创建
    public async addAcceptanceNodeDone() {

        // 清空step2节点数组
        this.repeatNodes = [];
        this.opaciyNodes = [];

        this.isSpinning = true;

        console.log(this.addAcceptanceNodeModel);
        // 创建节点请求
        const result = await this.fileManageService.CreateCheckP(this.addAcceptanceNodeModel);
        console.log(result);
        if (result.success) {
            this.message.success('操作成功');
            this.addAcceptanceNodeStep2 = false;
            this.addAcceptanceNodeModel = new addAcceptanceNodeModel({projectId: this.projectId, modelGroupId: this.modelGroupId});


            // 重新获取编辑节点目录数据
            this.QueryAllList();
            this.QueryFolderByType11();
        }
        this.isSpinning = false;
    }

    // 编辑验收节点
    public async editNode(node) {
        //清空step2节点数组
        this.repeatNodes = [];
        this.opaciyNodes = [];
        // this.currentNode = node;
        console.log(node);
        this.addAcceptanceNodeModel = new addAcceptanceNodeModel({...node, projectId: this.projectId, modelGroupId: this.modelGroupId});
        this.addAcceptanceNodeModel.name = node.title;
        this.addAcceptanceNodeModel.id = node.key;
        this.transInfo = JSON.parse(node.origin.transInfo);

        this.addAcceptanceNodeStep1 = true;
        console.log(this.addAcceptanceNodeModel);
        // 获取该节点下已经绑定的检验批
        const params = {
            maxResultCount: 1000,
            skipCount: 0,
            primaryId: this.projectId,
            primaryId1: node.key,
            pType: 15,
            showFloder: true,
        };
        const result = await this.fileManageService.QueryFloderPagedListForCheckP(params);
        console.log(result);
        if (result.success) {
            if (result.result.items) {
                this.checkedNodeList = [];
                const tempcheckedNodeList = result.result.items;
                // 原始数据还原
                this.originAllTemplateList.forEach(item => {
                    item.style = {
                        'opacity': '1'
                    };
                    item.expanded = false;
                });
                // 加载已选择模板
                tempcheckedNodeList.forEach(element => {
                    this.checkedNodeList.push({ name: element.name, TemplateId: element.templateId });
                    this.addAcceptanceNodeModel.TemplateIds.push(element.templateId);
                    if (this.originAllTemplateList.length !== 0) {
                        // 禁用已选择节点
                        this.originAllTemplateList.forEach((item) => {
                            if (item.id === element.templateId) {
                                console.log(item);
                                this.repeatNodes.push(item);
                                //item.disabled = true;
                                item.style = {
                                    'opacity': '0.4'
                                    // 'color':'red'
                                };
                            }
                        });
                        console.log('this.repeatNodes', this.repeatNodes);
                    }
                });

                // 重新渲染模板树
                this.templateNodes = Utils.renderTreeNodeForTreePanel(this.originAllTemplateList);


                console.log('检验批原始数据', this.originAllTemplateList);
                console.log('检验批组装后数据', this.templateNodes);
                console.log('已选择检验批原始数据', tempcheckedNodeList);
                console.log('已选择检验批节点', this.checkedNodeList);
            }
        }



    }


    // 删除验收节点
    public async deleteNode(node) {
        console.log(node)

        const res = await this.fileManageService.BatchRemove([node.key]);
        if (res.success) {
            this.message.success('删除成功')
            this.QueryAllList();
            this.QueryFolderByType11();

        }

    }

    // ****************************节点文件上传******************************************************************************
    // 打开上传弹窗
    public async upLoadNode(node) {
        console.log(node);
        this.currentNode = node;
        this.isUploadfile = true;
        this.upLoadFileModel.primaryId1 = node.origin.pType === 11 ? node.key : node.origin.primaryId1;
        // 获取当前文件节点下的文件列表
        const params = {
            maxResultCount: 1000,
            skipCount: 0,
            primaryId: this.projectId,
            parentId: this.currentNode.key,
            showFloder: false
        };
        const result = await this.fileManageService.QueryPagedListForCheckP(params);
        console.log(result);
        if (result.success) {
            this.listOfAllData = result.result.items;
        }


    }

    // tslint:disable-next-line: member-ordering
    public listOfSelection = [
        {
            text: 'Select All ',
            onSelect: () => {
                this.checkAll(true);
            }
        },
        {
            text: 'Select Odd ',
            onSelect: () => {
                this.listOfDisplayData.forEach((data, index) => (this.mapOfCheckedId[data.id] = index % 2 !== 0));
                this.refreshStatus();
            }
        },
        {
            text: 'Select Even ',
            onSelect: () => {
                this.listOfDisplayData.forEach((data, index) => (this.mapOfCheckedId[data.id] = index % 2 === 0));
                this.refreshStatus();
            }
        }
    ];


    currentPageDataChange($event: Array<{ id: number; name: string; age: number; address: string }>): void {
        this.listOfDisplayData = $event;
        this.refreshStatus();
    }

    refreshStatus(): void {
        this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.id]);
        this.isIndeterminate =
            this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
    }

    checkAll(value: boolean): void {
        this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.id] = value));
        this.refreshStatus();
    }

    //     public uploadFile() {

    //     }


    // 文件上传
    public async fileModelChange(e) {
        const files = e.target.files;

        // tslint:disable-next-line: forin
        for (const key in files) {
            if (!isNaN(Number(key))) {
                if (files[key].type !== 'application/pdf') {
                    this.message.warning(files[key].name + '上传失败，只支持上传pdf文件！');
                    continue;
                }
                this.modelUploader.add(files[key]);
            }
        }
        this.fileShow = false;
        this.modelStyle['display'] = 'block';


        // // 判断不能重复上传已存在文件
        // let ext = this.modelLists.find((el) => {
        //   return el.fileName == e.target.files[0].name;
        // })
        // if (!ext) {
        //   this.modelUploader.add(e.target.files[0]);
        // } else {
        //   this.reModel()
        //   this.message.warning('已存在该模型')

        // }

    }
    // 模型文件上传文件服务器成功回调
    public async modelSuccess(transfer: FlowFileModel) {
        console.log(transfer);
        const fileInfo = transfer.fileInfo;
        // this.upLoadFileModel.parentId = transfer.
        this.upLoadFileModel.parentId = this.currentNode ? this.currentNode.key : '';
        this.upLoadFileModel.primaryId = this.currentNode ? this.currentNode.origin.primaryId : '';
        this.upLoadFileModel.fileId = transfer.fileInfo.id,
            this.upLoadFileModel.name = transfer.name,
            this.upLoadFileModel.url = transfer.url,
            this.upLoadFileModel.extension = fileInfo.type,
            this.upLoadFileModel.size = transfer.size,
            this.upLoadFileModel.hash = fileInfo.hash,
            this.upLoadFileModel.path = fileInfo.path,
            this.upLoadFileModel.fileResponse = JSON.stringify(fileInfo);
        this.upLoadFileModel.pType = 16;



        await this.handleAddOk();
        this.reModel();
    }


    public reModel() {
        this.fileShow = true;
        this.modelStyle['display'] = 'none';
    }

    // 文件上传成功后回调执行 保存模型文件数据到（业务端）
    public async handleAddOk() {
        // if (this.fileShow) {
        //     this.message.create('warning', '请上传模型');
        //     return;
        // }
        // 上传模型 业务端请求
        console.log(this.upLoadFileModel);
        // con
        this.fileManageService.CreateFile(this.upLoadFileModel).then((res: any) => {
            if (res.success) {
                // 上传成功后请求列表
                // 获取当前文件节点下的文件列表
                const params = {
                    maxResultCount: 1000,
                    skipCount: 0,
                    primaryId: this.projectId,
                    parentId: this.currentNode.key,
                    showFloder: false
                };
                this.fileManageService.QueryPagedListForCheckP(params).then((result) => {
                    if (result.success) {
                        this.listOfAllData = result.result.items;
                    }
                });
            } else {
                this.message.warning(res.error.message);
            }
        });
    }



    // 下载pdf
    download(data) {
        FileHelper.download(data.name + data.extension, data.url);
    }
    // 删除?
    public deleteCatalog(node) {
        this.mzModal.error({
            nzTitle: '删除？',
            nzContent: '<b>确认要删除吗？</b>',
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOkType: 'danger',
            nzOnOk: () => this.onDeleteSave(node.id),
            nzOnCancel: () => { }
            // nzOnCancel: () => this.status.refreshstatus = true
        });
    }
    // 确认删除
    /**
   * 删除保存
   *
   */
    public onDeleteSave(dataId) {
        this.fileManageService.BatchRemove([dataId]).then((res: any) => {
            if (res.success) {
                this.message.success('删除成功');
                // 获取检验批文件列表
                // this.getFileList();

                // 获取当前文件节点下的文件列表
                const params = {
                    maxResultCount: 1000,
                    skipCount: 0,
                    primaryId: this.projectId,
                    parentId: this.currentNode.key,
                    showFloder: false
                };
                this.fileManageService.QueryPagedListForCheckP(params).then((result) => {
                    if (result.success) {
                        this.listOfAllData = result.result.items;
                    }
                });

            } else {
                this.message.error(Utils.errorMessageProcessor(res));
            }
        });

    }
    // ******************************************节点文件上传结束**************************************************************

    // 左侧菜单显示隐藏
    public leftOpen() {
        this.leftShow = !this.leftShow;
    }

    // 模型带颜色状态

    ngOnInit() {
        // 初始化订阅
        this.observable();
        // 获取模型内置结构树
        this.getTreeNode();
        // 获取编辑模式下验收节点结构树
        // this.QueryAllList();
        //  获取查看模式下验收节点列表
        // this.QueryFolderByType11();
        // 获取检验批表模板结构树
        // this.QueryAllTemplate();



    }

}
