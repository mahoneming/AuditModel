export class listRightForm {
    public Filter: string;
    public MaxResultCount: number = 1000;
    public SkipCount: number = 0;
    public nzTotal: number;
    public Role: number;

    constructor(obj: any = {}) {
        // console.log(form)
        if (!obj) return;
        (obj.Filter) && (this.Filter = obj.Filter);
        (obj.MaxResultCount) && (this.MaxResultCount = obj.MaxResultCount);
        (obj.SkipCount) && (this.SkipCount = obj.SkipCount);
        (obj.nzTotal) && (this.nzTotal = obj.nzTotal);
        (obj.Role) && (this.Role = obj.Role);
    }
}

export class listLeftForm {
    public Filter: string;
    public MaxResultCount: number = 1000;
    public SkipCount: number = 0;
    public nzTotal: number;
    public ExcludeRole: number;

    constructor(obj: any = {}) {
        // console.log(form)
        if (!obj) return;
        (obj.Filter) && (this.Filter = obj.Filter);
        (obj.MaxResultCount) && (this.MaxResultCount = obj.MaxResultCount);
        (obj.SkipCount) && (this.SkipCount = obj.SkipCount);
        (obj.nzTotal) && (this.nzTotal = obj.nzTotal);
        (obj.ExcludeRole) && (this.ExcludeRole = obj.ExcludeRole);
    }
}