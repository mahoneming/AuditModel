import { TemplateRef } from '@angular/core';


// 创建节点
// tslint:disable-next-line: class-name
export class addAcceptanceNodeModel {
    public name: string;
    // 选中的检验批表ID数组
    public TemplateIds = [];
    // 透传字段
    public transInfo: string;
    // public projectId = JSON.parse(window.localStorage.getItem('project')).id;
    // public modelGroupId = JSON.parse(window.localStorage.getItem('model')).id;
    public projectId: string;
    public modelGroupId: string;
    public id: string;


    constructor(obj?) {
        const instance = this;
        if (!obj) { return; }
        (obj.name) && (instance.name = obj.name);
        (obj.TemplateIds) && (instance.TemplateIds = obj.TemplateIds);
        (obj.tranInfo) && (instance.transInfo = obj.tranInfo);
        (obj.id) && (instance.id = obj.id);
        (obj.projectId) && (instance.projectId = obj.projectId);
        (obj.modelGroupId) && (instance.modelGroupId = obj.modelGroupId);

    }
}


// 上传文件信息
// tslint:disable-next-line: class-name
export class upLoadFileModel {
    public primaryId: string;
    public parentId: string;
    public fileId: number;
    public name: string;
    public url: string;
    public extension: string;
    public size: any;
    public hash: string;
    public path: string;
    public fileResponse: any; // JSON.stringify(fileInfo)
    public pType: any;
    public primaryId1: string;



    constructor(obj?) {
        const instance = this;
        if (!obj) { return; }
        (obj.primaryId) && (instance.primaryId = obj.primaryId);
        (obj.parentId) && (instance.parentId = obj.parentId);
        (obj.fileId) && (instance.fileId = obj.fileId);
        (obj.name) && (instance.name = obj.name);
        (obj.url) && (instance.url = obj.url);
        (obj.extension) && (instance.extension = obj.extension);
        (obj.size) && (instance.size = obj.size);
        (obj.hash) && (instance.hash = obj.hash);
        (obj.path) && (instance.path = obj.path);
        (obj.fileResponse) && (instance.fileResponse = obj.fileResponse);
        (obj.pType) && (instance.pType = obj.pType);
        (obj.primaryId1) && (instance.primaryId1 = obj.primaryId1);

    }
}


// tslint:disable-next-line: class-name
export class bindInfo {
    public propertyIds: Array<any>;
    public documentId: string;
    public oldDocumentId: string;
    // public projectId = JSON.parse(window.localStorage.getItem('project')).id;
    // public modelGroupId = JSON.parse(window.localStorage.getItem('model')).id;
    public projectId: string;
    public modelGroupId: string;




    constructor(obj?) {
        const instance = this;
        if (!obj) { return; }
        (obj.propertyIds) && (instance.propertyIds = obj.propertyIds);
        (obj.documentId) && (instance.documentId = obj.documentId);
        (obj.oldDocumentId) && (instance.oldDocumentId = obj.oldDocumentId);
        (obj.projectId) && (instance.projectId = obj.projectId);
        (obj.modelGroupId) && (instance.modelGroupId = obj.modelGroupId);

    }
}


export const imgType = 'image/gif,image/jpeg,image/jpg,image/png,image/svg';

export const fileType = '.pdf';
