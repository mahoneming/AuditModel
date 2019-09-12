import { Injectable } from '@angular/core';
import { RequestClientService } from '../request-client.service';
import { HOSTURL, PREFIX } from 'src/app/config';

@Injectable({
    providedIn: 'root'
})
export class FileManageService {

    constructor(private RequestClientService: RequestClientService) { }

    /**
     * 创建文件夹
     * @param params 创建参数
     * @returns Promise对象
     */
    public async createFolder(params) {
        const res = await this.RequestClientService.post(HOSTURL + `/api/services/${PREFIX}/DocumentLibrarys/CreateFolder`, params);
        return res;
    }

    /**
     * 获取文件夹目录-分页数据集合
     * @param params 获取参数
     * @returns Promise对象
     */
    public async QueryFloderPagedList(params) {
        const res = await this.RequestClientService.post(HOSTURL + `/api/services/${PREFIX}/DocumentLibrarys/QueryFloderPagedList`, params);
        return res;
    }

    /**
     * 获取文件夹目录-分页数据集合
     * @param params 获取参数
     * @returns Promise对象
     */
    public async QueryFloderPagedListForCheckP(params) {
        const res = await this.RequestClientService.post(HOSTURL + `/api/services/${PREFIX}/DocumentLibrarys/QueryFloderPagedListForCheckP`, params);
        return res;
    }


    /**
     * 获取检验批模板列表-分页数据集合
     * @param params 获取参数
     * @returns Promise对象
     */
    public async QueryProjectCategoryTemplatePagedList(params) {
        // tslint:disable-next-line: max-line-length
        const res = await this.RequestClientService.post(HOSTURL + `/api/services/${PREFIX}/DocumentLibrarys/QueryProjectCategoryTemplatePagedList`, params);
        return res;
    }
     /**
     * 创建验收节点
     * @param params 获取参数
     * @returns Promise对象
     */
    public async CreateCheckP(params) {
        // tslint:disable-next-line: max-line-length
        const res = await this.RequestClientService.post(HOSTURL + `/api/services/${PREFIX}/DocumentLibrarys/CreateCheckP`, params);
        return res;
    }

    /**
     * 修改名称 文件/文件夹
     * @param params 修改参数
     * @returns Promise对象
     */
    public async Rename(params) {
        const res = await this.RequestClientService.post(HOSTURL + `/api/services/${PREFIX}/DocumentLibrarys/Rename`, params);
        return res;
    }
    
    /**
     * 同步上传
     * @param params 修改参数
     * @returns Promise对象
     */
    public async AsyncFile(params) {
        const res = await this.RequestClientService.post(HOSTURL + `/api/services/${PREFIX}/Zhuye/AsyncFile`, params);
        return res;
    }

    /**
     * 批量删除至回收站 文件/文件夹
     * @param params 删除参数
     * @returns Promise对象
     */
    public async BatchRemove(params) {
        const res = await this.RequestClientService.post(HOSTURL + `/api/services/${PREFIX}/DocumentLibrarys/BatchRemove`, params);
        return res;
    }

    /**
     * 获取文件库-分页数据集合
     * @param params 获取参数
     * @returns Promise对象
     */
    public async QueryPagedList(params) {
        const res = await this.RequestClientService.post(HOSTURL + `/api/services/${PREFIX}/DocumentLibrarys/QueryPagedList`, params);
        return res;
    }

    /**
     * 获取检验批文件及目录-分页数据集合
     * @param params 获取参数
     * @returns Promise对象
     */
    public async QueryPagedListForCheckP(params) {
        const res = await this.RequestClientService.post(HOSTURL + `/api/services/${PREFIX}/DocumentLibrarys/QueryPagedListForCheckP`, params);
        return res;
    }

    /**
     * 批量从回收站删除 文件/文件夹
     * @param params 删除参数
     * @returns Promise对象
     */
    public async removeFiles(params) {
        const res = await this.RequestClientService.post(HOSTURL + `/api/services/${PREFIX}/DocumentLibrarys/BatchRemoveOnRecycle`, params);
        return res;
    }


    /**
     * 创建文件
     * @param params 参数
     * @returns Promise对象
     */
    public async CreateFile(params) {
        const res = await this.RequestClientService.post(HOSTURL + `/api/services/${PREFIX}/DocumentLibrarys/CreateFile`, params);
        return res;
    }


    /**
     * 移动文件
     * @param params 参数
     * @returns Promise对象
     */
    public async MoveToFolder(params) {
        const res = await this.RequestClientService.post(HOSTURL + `/api/services/${PREFIX}/DocumentLibrarys/MoveToFolder`, params);
        return res;
    }

}
