import { NzTreeNode } from "../../../node_modules/ng-zorro-antd";
import { IIfcModelElements, ISpatialStructure, IStructural, IArchitectural } from "./ggService";
import { isObject, isArray, isString } from "util";

declare var Neon: any;

export interface InitializeParameters {
    container?: HTMLDivElement | HTMLElement;

    processer?: HTMLElement;   //进度条可支持自定义

    url?: string;

    vmUrl?: string;

    enforcement?: boolean;
}

export interface ISelector extends IEventEmitter {

    select: (uuids: string | string[], isLag: boolean) => void;
    selectFloorAndMajorAndClass: (names?: any, treeName?: string) => void;
    selectAll: (enable: boolean) => void;

    get: () => string[];
    pressKey: (ev: KeyboardEvent) => void;
    add: (uuids: string | string[]) => void;
    clear: (isClick?: boolean) => void;
    focus: (uuid: string) => void;
    focusBack: () => void;

    createLevel: (theta: number, phi: number) => void;

    setCameraState: (cameraID: number, cameraState: boolean) => void;
    InitCamera: () => void;

    text: (enable: boolean) => void;
    setMethod: (name: string, enable: boolean) => void;
    setConstructionsection: (enable: true) => void;
    getClassInfo: (uuids: string | string[]) => any;
}

// 事件注入器
export interface IEventEmitter {
    on: (type: string, listener: EventListener) => void;     // 注入某个事件
    has: (type: string, listener: EventListener) => boolean;   // 判断是否包含某个事件
    off: (type: string, listener: EventListener) => void;     // 撤销某个事件
    reSet: () => void;                                          // 清除所有事件
    emit: (event: string | any) => void;                        // 运行某个事件
}

export class NeonTreeNode {

    title: string;
    children: NeonTreeNode[];
    tempCd: NeonTreeNode[][];
    InstanceGuids: string[];

    constructor(title: string, cd?: NeonTreeNode[]) {

        this.title = title;
        this.children = cd || [];

        let tempCd: NeonTreeNode[][] = this.tempCd = [];

        this.add = (node: NeonTreeNode, no: number) => {

            let t = tempCd[no] || [];
            t.push(node);
            tempCd[no] = t;
        }

        this.reGroupCd = () => {
            this.children.length = 0;
            tempCd.map(cds => {
                cds.map(cd => {
                    this.children.push(cd);
                    cd.reGroupCd();
                });
            });
            tempCd.length = 0;
            tempCd = null;

            return this;
        }
    }

    add: (node: NeonTreeNode, no: number) => void;
    reGroupCd: () => NeonTreeNode;
}


export const NeonAngular = function () {
    let treeData: Map<string, string[]> = new Map;
    let ifcModelElements: Map<string, string[]> = new Map;

    let Initialize = function (params: InitializeParameters) {

        Neon.initialize(params);
    }

    let Load = function (url: string, onLoad?: (param: any) => void, onLoadover?: (param: any) => void, projectId?: number, clear?: boolean) {

        Neon.load(url, onLoad, onLoadover, projectId, clear);
    }

    let GetSelector = function (): ISelector {

        return Neon.getSelector()
    }

    let SelectFloorAndMajorAndClass = (node: any) => {
        let InstanceGuids = [];
        GetTreeInstanceGuids(node, InstanceGuids);

        return InstanceGuids;
        // return Neon._selector.selectFloorAndMajorAndClass(name);
    }

    let GetModelUuidSet = () => {

        let uuids = Neon.getUuids();
        return new Set<string>(uuids);
    }

    let CleanData = (data: any) => {
        let us = GetModelUuidSet();
        let re: any = {};
        for (let name in data) {

            let uuids: string[] = data[name];
            uuids.map((uuid, index) => {
                if (!us.has(uuid))
                    uuids.splice(index, 1);
            });

            if (uuids.length > 0)
                re[name] = uuids;
        }

        return re;
    }

    // 模型3.0
    function GetTreeInstanceGuids(children: NzTreeNode[], InstanceGuids: string[]) {
        children.forEach(node => {
            if (node.isChecked || node.isHalfChecked) {
                if (node.isChecked && node.origin && node.origin.instanceGuids.length > 0) {
                    node.origin.instanceGuids.forEach(uuid => {
                        InstanceGuids.push(gum.atob(uuid))
                    })
                }
                if (node.children.length > 0)
                    GetTreeInstanceGuids(node.children, InstanceGuids)

            }
        });
    }

    // 获取目录树结构
    let GetTreeFilterFromAttri = (() => {

        let nodeMap = new Map<string, NeonTreeNode>();

        function sp(attr: string) {
            let t = attr.split('(');
            let _re: string[] = [];

            t.map((_t) => {

                _re = _re.concat(_t.split(')'));
            });

            let re: string[] = [];
            _re.map(r => {
                if (r !== '')
                    re.push(r);
            });
            return re;
        }

        function splitAttr(attrs: string[], parent: NeonTreeNode, titleNames: string) {
            let t = sp(attrs[0]);
            attrs.splice(0, 1);
            if (t.length === 0) return;
            let no = t.length === 1 ? 1000 : parseFloat(t[0]);
            let title = t.length === 1 ? t[0] : t[1];

            // 如果已经包含该node了，则不需要重新插入
            if (nodeMap.has(titleNames + title)) {

                if (attrs.length)
                    splitAttr(attrs, nodeMap.get(titleNames + title), titleNames + title);
            } else {

                let node = new NeonTreeNode(title);
                parent.add(node, no);
                nodeMap.set(titleNames + title, node);
                if (attrs.length)
                    splitAttr(attrs, node, titleNames + title);
            }
        }

        function GetTreeData(workerset: string, uuids: string[]) {

            let attrs = workerset.split('_');
            let title = '';

            attrs.map(attr => {
                let re = sp(attr);
                if (re.length === 0) return;
                title += re.length === 1 ? re[0] : re[1];
            });

            treeData.set(title, uuids);
        }

        function GetData(data: any, title: string, root: NeonTreeNode) {

            data.Children.map(node => {
                let temp = title + node.Name;
                let n = new NeonTreeNode(node.Name);
                if (node.InstanceGuids.length > 0) {
                    n.InstanceGuids = node.InstanceGuids;
                    // treeData.set(temp, node.instanceGuids);
                }else{
                    n.InstanceGuids = [];
                }
                root.add(n, 1000);
                GetData(node, temp, n);

            })
        }

        return (data: any, modelName?: string) => {

            if (isString(data)) {
                let _treeData = CleanData(JSON.parse(data));
                let root = new NeonTreeNode(modelName);
                treeData.clear();
                nodeMap.clear();
                for (var workerset in _treeData) {
                    splitAttr(workerset.split('_'), root, modelName);
                    GetTreeData(workerset, _treeData[workerset]);
                }
                return root.reGroupCd();
            } else {
                treeData.clear();
                let root = new NeonTreeNode(data.Name);
                GetData(data.Children[0], '', root);
                return root.reGroupCd();

            }

        }
    })();

    // IFC目录树
    let GetTreeFilterFromIfcModelElements = (() => {

        function GetIfcModelElements(node: ISpatialStructure, title: string) {

            if (node.Name === null || node.Name === '')
                node.Name = 'undefined';
            title += node.Name;
            if (node.ElementCount > 0) {
                ParseModelElements(node.modelElements, title.slice());
            }

            if (node.Children)
                node.Children.map(cn => {
                    GetIfcModelElements(cn, title.slice());
                });
        }

        function ParseModelElements(me: IIfcModelElements, title: string) {

            for (let majorName in me) {
                let t = title.slice() + majorName;
                ParseMajor(me[majorName], t)
            }
        }

        function ParseMajor(major: any, title: string) {

            for (let subMajorName in major) {
                let t = title.slice() + subMajorName;

                if (isObject(major[subMajorName])) {
                    if (isArray(major[subMajorName])) {
                        ifcModelElements.set(t, major[subMajorName]);
                    } else
                        ParseMajor(major[subMajorName], t);
                }

            }
        }


        return (data: ISpatialStructure) => {

            ifcModelElements.clear();
            GetIfcModelElements(data, '');
            return data;
        }
    })();

    // 模型2.0目录树
    let SelectFloorAndMajorAndClassByGGservice = (() => {
        function getNames(nameSet: Set<string>, names: NzTreeNode[], t: string) {
            for (let i = 0; i < names.length; ++i) {
                let _t = t.slice();
                let name = names[i];

                if (name.isChecked == true || name.isHalfChecked)

                    _t += name.title;
                else
                    continue;

                if (name.children == undefined || name.children.length == 0) {
                    nameSet.add(_t);
                } else {
                    getNames(nameSet, name.children, _t);
                }
            }
        }

        return (names: NzTreeNode[]) => {

            let nameSet: Set<string> = new Set;
            let floorSet = new Set<string>();
            for (let i = 0; i < names.length; ++i) {
                let name = names[i];
                if (name.isChecked == true || name.isHalfChecked)
                    floorSet.add(name.title);
                let t: string = name.title;
                if (!name.isLeaf)
                    getNames(nameSet, name.children, t);
                else if (name.isChecked === true)
                    nameSet.add(t);
            }

            let uuids: string[] = [];
            nameSet.forEach(name => {
                if (treeData.has(name))
                    uuids = uuids.concat(treeData.get(name));
                else if (ifcModelElements.has(name))
                    uuids = uuids.concat(ifcModelElements.get(name));
            });

            let s = new Set<string>(uuids);
            Neon._selector.selectFloorAndMajorAndClassByGuid(uuids, floorSet);
        }

    })();

    function InitLevelsAndGrids(data: any) {
        if (isString(data)) data = JSON.parse(data);
        if (!data.levels)
            Neon.InitLevelsAndGrids(data["Levels"], data["ReGrids"]);
        else
            Neon.InitLevelsAndGrids(data["levels"], data["grids"]);
    }

    return {

        Initialize: Initialize,
        Load: Load,
        GetSelector: GetSelector,
        SelectFloorAndMajorAndClass: SelectFloorAndMajorAndClass,
        GetTreeFilterFromAttri: GetTreeFilterFromAttri,
        SelectFloorAndMajorAndClassByGGservice: SelectFloorAndMajorAndClassByGGservice,
        GetTreeFilterFromIfcModelElements: GetTreeFilterFromIfcModelElements,
        InitLevelsAndGrids: InitLevelsAndGrids
    }
}();