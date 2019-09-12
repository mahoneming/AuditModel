export class ProjectListForm {
    type: number;
    projectStatus: number;
    mark: number;
    stage: number;
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

export class ProjectAddForm {
    id: string;
    name: string;
    code: string;
    address: string;
    areaId: string;
    type = '10';
    stage: string;
    projectStatus = '1';
    imageUrl: string;
    description: string;
    mark = '2';
    location: string;
    organizationName: string;
    totalAmount: number;
    takeLimit: number;
    isImportant = '2';
    // isApprove: string = '2';
    auditStatus = 1;
    companyName: string;
    companyContacts: string;
    companyPhoneNumber: string;
    companyAddress: string;
    permissionArray: [
        string
    ]

    constructor(form: any = {}) {
        // console.log(form)
        this.id = form.id || this.id;
        this.name = form.name || this.name;
        this.code = form.code || this.code;
        this.address = form.address || this.address;
        this.isImportant = form.isImportant || this.isImportant;
        // this.isApprove = form.isApprove || this.isApprove;
        this.areaId = form.areaId || this.areaId;
        this.type = form.type || this.type;
        this.stage = form.stage || this.stage;
        this.projectStatus = form.projectStatus || this.projectStatus;
        this.imageUrl = form.imageUrl || this.imageUrl;
        this.description = form.description || this.description;
        this.mark = form.mark || this.mark;
        this.location = form.location || this.location;
        this.organizationName = form.organizationName || this.organizationName;
        this.totalAmount = form.totalAmount || this.totalAmount;
        this.takeLimit = form.takeLimit || this.takeLimit;
        this.companyName = form.companyName || this.companyName;
        this.companyContacts = form.companyContacts || this.companyContacts;
        this.companyPhoneNumber = form.companyPhoneNumber || this.companyPhoneNumber;
        this.companyAddress = form.companyAddress || this.companyAddress;
        this.permissionArray = form.permissionArray || this.permissionArray;
    }
}