export class listModel {
    public status: number;
    public filter: string;
    public creationTimeRange: string;
    public maxResultCount: number = 10;
    public skipCount: number = 0;

    constructor(obj?) {
        const instance = this;
        if (!obj) return;
        (obj.status) && (instance.status = obj.status);
        (obj.creationTimeRange) && (instance.creationTimeRange = obj.creationTimeRange);
        (obj.filter) && (instance.filter = obj.filter);
        (obj.maxResultCount) && (instance.maxResultCount = obj.maxResultCount);
        (obj.skipCount) && (instance.skipCount = obj.skipCount);
    }
}

export class noticeModel {
    public title: string;
    public content: string;
    public type: number = 1;
    public status: number = 1;
    public organizationUnitId: number;
    public id: number;

    constructor(obj?) {
        const instance = this;
        if (!obj) return;
        (obj.title) && (instance.title = obj.title);
        (obj.content) && (instance.content = obj.content);
        (obj.type) && (instance.type = obj.type);
        (obj.status) && (instance.status = obj.status);
        (obj.organizationUnitId) && (instance.organizationUnitId = obj.organizationUnitId);
        (obj.id) && (instance.id = obj.id);
    }
}