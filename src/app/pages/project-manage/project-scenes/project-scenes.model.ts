export class listForm {
    public projectId: string;
    public filter: string;
    public sorting: string;
    public maxResultCount = 8;
    public skipCount = 0;
    public nzTotal: number;

    constructor(form: any = {}) {
        // console.log(form)
        this.projectId = form.projectId || this.projectId;
        this.filter = form.filter || this.filter;
        this.sorting = form.sorting || this.sorting;
        this.maxResultCount = form.maxResultCount || this.maxResultCount;
        this.skipCount = form.skipCount || this.skipCount;
        this.nzTotal = form.nzTotal || this.nzTotal;
    }
}

export class addForm {
    public projectId: string;
    public creatorUserName: string;
    public name: string;
    public fileName: string;
    public hash: string;
    public imageUrl: string;
    public path: string;
    public creationTime: string;
    public size = 0;
    public tenantId: string;
    public modelGroupId: string;
    public id: string;
    public taskId: string;
    public SSOCreatorUserId: string;
    public type: string;

    constructor(obj?) {
        const instance = this;
        if (!obj) return;
        (obj.projectId) && (instance.projectId = obj.projectId);
        (obj.creatorUserName) && (instance.creatorUserName = obj.creatorUserName);
        (obj.name) && (instance.name = obj.name);
        (obj.fileName) && (instance.fileName = obj.fileName);
        (obj.hash) && (instance.hash = obj.hash);
        (obj.imageUrl) && (instance.imageUrl = obj.imageUrl);
        (obj.path) && (instance.path = obj.path);
        (obj.creationTime) && (instance.creationTime = obj.creationTime);
        (obj.size) && (instance.size = obj.size);
        (obj.tenantId) && (instance.tenantId = obj.tenantId);
        (obj.modelGroupId) && (instance.modelGroupId = obj.modelGroupId);
        (obj.id) && (instance.id = obj.id);
        (obj.SSOCreatorUserId) && (instance.SSOCreatorUserId = obj.SSOCreatorUserId);
        (obj.type) && (instance.type = obj.type);
    }
}

export const imgType = 'image/gif,image/jpeg,image/jpg,image/png,image/svg';

export const modelType = '.rvt,.stl,.fbx,.obj,.3ds';