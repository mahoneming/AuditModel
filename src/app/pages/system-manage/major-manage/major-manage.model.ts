export class listForm {
    public Filter: string;
    public MaxResultCount: number = 10;
    public SkipCount: number = 0;
    public nzTotal: number;
    public status: string = '0';

    constructor(obj: any = {}) {
        console.log(obj)
        if (!obj) return;
        (obj.Filter) && (this.Filter = obj.Filter);
        (obj.MaxResultCount) && (this.MaxResultCount = obj.MaxResultCount);
        (obj.SkipCount) && (this.SkipCount = obj.SkipCount);
        (obj.nzTotal) && (this.nzTotal = obj.nzTotal);
        (obj.status) && (this.status = obj.status);
    }
}