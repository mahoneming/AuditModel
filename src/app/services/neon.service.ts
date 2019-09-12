import { Injectable, OnInit } from "@angular/core";
import { Headers, RequestOptions, Http } from "@angular/http";
import { HttpParams, HttpClient } from "@angular/common/http";
import { InitializeParameters, ISelector, NeonAngular } from "../common/neon";
import { UserInfo } from "../common/userinfo";
import { NzTreeNode } from "ng-zorro-antd";
import { ISpatialStructure } from "../common/ggService";

@Injectable()
export class NeonService implements OnInit{

    private _params: InitializeParameters;
    private _selector: ISelector = NeonAngular.GetSelector();
    private _url = "/api/GeometryAttri";
    private _userInfo: UserInfo;

    Guid: string;

    headers: Headers;
    options: RequestOptions;
    userName: string;
    Id: string;
    
    ngOnInit() {
    }

    constructor(private _http: HttpClient) {
        this.headers = new Headers({ 'Content-Type': 'application/json' });
        this.options = new RequestOptions({ headers: this.headers});
    }

    public SetInitParams(params: InitializeParameters) {

        this._params = params;
    }

    public SetUserInfo(userinfo: UserInfo) {

        this._userInfo = userinfo;
    }

    public InitAndLoad(url: string, projectId?: number, callback?: (data?: any) => void, onLoad?: (data?: any) => void) {

        NeonAngular.Initialize(this._params);
        let _callback = callback || this.modelLoadCallBack;
        let _onLoad = onload || this.modelLoadOverCallback;
        NeonAngular.Load(url, _callback, _onLoad, projectId);
    }

    public SetSelectHander(selectHander: (uuid: any) => any) {

        this._selector.on("OnPropertyChanged", (ev: any) => {       
           selectHander(ev.target.uuid);           
        });
    }

    public SelectFloorAndMajorAndClass = (node: any) => {

        return NeonAngular.SelectFloorAndMajorAndClass(node);
    }

    public GetTreeFilterFromAttri = (data: any, modelName?: string) => {

        return NeonAngular.GetTreeFilterFromAttri(data, modelName);
    }

    public GetTreeFilterFromIfcModelElements = (data: ISpatialStructure) => {

        return NeonAngular.GetTreeFilterFromIfcModelElements(data);
    }

    public SelectFloorAndMajorAndClassByGGservice = (name: NzTreeNode[]) => {

        NeonAngular.SelectFloorAndMajorAndClassByGGservice(name);
    }

    modelLoadCallBack: (data: any) => void;
    modelLoadOverCallback: () => void;

    public SetmodelLoadCallBack = (callback: (data: any) => void) => {

        this.modelLoadCallBack = callback;
    }

    public SetmodelLoadOverCallback = (callback: () => void) => {

        this.modelLoadOverCallback = callback;
    }
}