export class ProjectListForm {
    type: number;
    projectStatus: number;
    mark: number;
    stage = 3;
    isImportant: number;
    areaId: number;
    // checkType: number;
    filter: string;
    creationTimeRange: string[];
    sorting: string;
    auditStatus: string;
    maxResultCount: number;
    skipCount: number;

    constructor(form: any = {}) {
        // console.log(form)
        this.type = form.type || this.type;
        this.projectStatus = form.projectStatus || this.projectStatus;
        this.mark = form.mark || this.mark;
        this.stage = form.stage || this.stage;
        this.isImportant = form.isImportant || this.isImportant;
        this.areaId = form.areaId || this.areaId;
        // this.checkType = form.checkType || undefined;
        this.filter = form.filter || this.filter;
        this.creationTimeRange = form.creationTimeRange || this.creationTimeRange;
        this.sorting = form.sorting || this.sorting;
        this.auditStatus = form.auditStatus || this.auditStatus;
        this.maxResultCount = form.maxResultCount;
        this.skipCount = form.skipCount;
    }
}