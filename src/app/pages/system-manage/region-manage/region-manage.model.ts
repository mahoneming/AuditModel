export class addOrUpdateForm {
    public id: string;
    public parentId: string;
    public name: string;
    public code: string;
    public sort = 0;
    public status = '0';

    constructor(obj: any = {}) {
        // console.log(form)
        if (!obj) return;
        (obj.id) && (this.id = obj.id);
        (obj.parentId) && (this.parentId = obj.parentId);
        (obj.name) && (this.name = obj.name);
        (obj.code) && (this.code = obj.code);
        (obj.sort) && (this.sort = obj.sort);
        (obj.status) && (this.status = obj.status);
    }
}