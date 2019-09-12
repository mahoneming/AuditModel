export class listForm {
    public Filter: string;
    public MaxResultCount: number = 10;
    public SkipCount: number = 0;
    public nzTotal: number;

    constructor(obj: any = {}) {
        // console.log(form)
        if (!obj) return;
        (obj.Filter) && (this.Filter = obj.Filter);
        (obj.MaxResultCount) && (this.MaxResultCount = obj.MaxResultCount);
        (obj.SkipCount) && (this.SkipCount = obj.SkipCount);
        (obj.nzTotal) && (this.nzTotal = obj.nzTotal);
    }
}