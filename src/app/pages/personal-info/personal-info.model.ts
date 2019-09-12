export class personalInfoModel {
    public name: string;
    public emailAddress: string;
    public phoneNumber: string;
    public avatar: string;
    public position: string;
    public gender: number = 2;

    constructor(obj?) {
        const instance = this;
        if (!obj) return;
        (obj.name) && (instance.name = obj.name);
        (obj.emailAddress) && (instance.emailAddress = obj.emailAddress);
        (obj.phoneNumber) && (instance.phoneNumber = obj.phoneNumber);
        (obj.avatar) && (instance.avatar = obj.avatar);
        (obj.position) && (instance.position = obj.position);
        (obj.gender) && (instance.gender = obj.gender);
    }

}