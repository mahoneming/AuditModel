export class listForm {
    public OrganizationUnitId: number;
    public Filter: string;
    public MaxResultCount: number = 100;
    public SkipCount: number = 0;
    public nzTotal: number;

    constructor(obj: any = {}) {
        // console.log(form)
        if (!obj) return;
        (obj.OrganizationUnitId) && (this.OrganizationUnitId = obj.OrganizationUnitId);
        (obj.Filter) && (this.Filter = obj.Filter);
        (obj.MaxResultCount) && (this.MaxResultCount = obj.MaxResultCount);
        (obj.SkipCount) && (this.SkipCount = obj.SkipCount);
        (obj.nzTotal) && (this.nzTotal = obj.nzTotal);
    }
}

export class addOrUpdateForm {
    public displayName: string;
    public description: string;
    public parentId: string;
    public sort: number = 0;
    public level: number = 0;
    public id: string;

    constructor(obj: any = {}) {
        // console.log(form)
        if (!obj) return;
        (obj.displayName) && (this.displayName = obj.displayName);
        (obj.description) && (this.description = obj.description);
        (obj.parentId) && (this.parentId = obj.parentId);
        (obj.sort) && (this.sort = obj.sort);
        (obj.level) && (this.level = obj.level);
        (obj.id) && (this.id = obj.id);
    }
}