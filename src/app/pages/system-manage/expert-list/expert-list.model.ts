export class listForm {
    public Filter: string;
    public MaxResultCount: number = 10;
    public SkipCount: number = 0;
    public nzTotal: number;
    public Role: string;
    public OrganizationUnitPrimaryId: string = '00000000-0000-0000-0000-000000000001';

    constructor(obj: any = {}) {
        // console.log(form)
        if (!obj) return;
        (obj.Filter) && (this.Filter = obj.Filter);
        (obj.MaxResultCount) && (this.MaxResultCount = obj.MaxResultCount);
        (obj.SkipCount) && (this.SkipCount = obj.SkipCount);
        (obj.nzTotal) && (this.nzTotal = obj.nzTotal);
        (obj.Role) && (this.Role = obj.Role);
        (obj.OrganizationUnitPrimaryId) && (this.OrganizationUnitPrimaryId = obj.OrganizationUnitPrimaryId);
    }
}

export class addForm {
    public assignedRoleNamesValue: string;
    public assignedRoleNames: string[] = [];
    public organizationUnitsValue: string;
    public organizationUnits: string[] = [];
    public sendActivationEmail: boolean;
    public setRandomPassword: boolean;
    public user: any = {
        EmailAddress: undefined,
        isActive: true,
        isLockoutEnabled: false,
        isTwoFactorEnabled: false,
        name: undefined,
        password: undefined,
        phoneNumber: undefined,
        shouldChangePasswordOnNextLogin: false,
        surname: '',
        userName: ''
    }

    constructor(obj: any = {}) {
        // console.log(form)
        if (!obj) return;
        (obj.assignedRoleNamesValue) && (this.assignedRoleNamesValue = obj.assignedRoleNamesValue);
        (obj.assignedRoleNames) && (this.assignedRoleNames = obj.assignedRoleNames);
        (obj.organizationUnitsValue) && (this.organizationUnitsValue = obj.organizationUnitsValue);
        (obj.organizationUnits) && (this.organizationUnits = obj.organizationUnits);
        (obj.sendActivationEmail) && (this.sendActivationEmail = obj.sendActivationEmail);
        (obj.setRandomPassword) && (this.setRandomPassword = obj.setRandomPassword);
        (obj.user) && (this.user = obj.user);
    }
}