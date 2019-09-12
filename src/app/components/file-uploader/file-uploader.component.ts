import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, Injector, TemplateRef, Renderer2 } from '@angular/core';
import { FlowDirective, FlowFile } from '@flowjs/ngx-flow';
import { Subscription, Observable } from 'rxjs';
// import { version, FILEURL } from '../../config';
const version = '1.0';
// const FILEURL = 'http://long.typeo.org/file';
const unitStrArr = ['K', 'M', 'G']; // B,KB,MB,GB,TB,PB,EB,ZB,YB,BB
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
// declare var SparkMD5: any;
import * as SparkMD5 from 'spark-md5';
import { Base64 } from './../../common/helper/base64';
export interface FlowFileModel extends FlowFile {
  fileHash: string;
  url: string;
  percent: number;
  maskWith: number;
  fileInfo: any;
  modelGroupId: string;
}

export interface uploadOptions {

}


@Component({
  selector: 'nag-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})

export class FileUploaderComponent implements OnInit {
  @ViewChild('checkFileInput', { static: false }) public checkFileInput;
  @ViewChild('flowAdvanced', { static: false }) public flow: FlowDirective;
  @ViewChild('transferRow', { static: false }) private transferRow: ElementRef;
  @ViewChild('uploadFileInput', { static: false }) private uploadFileInput;
  @Input() public zzjUploadButton: TemplateRef<void>; // zzUploadButton模板
  @Input() public showProgress = true; // zzUploadButton模板
  @Input('flowFiles') public flowFiles: FlowFileModel[] = [];
  @Input('multiple') public multiple = false;
  @Input('autoUpload') public autoUpload = false;
  @Input('extraParam') public extraParam: any;
  @Input('fileHost') public fileHost: any;
  @Input('checkFile') public checkFile: any;
  @Input('projectId') public projectId = '35542c9d-9c42-4b15-812e-af9bde6aea92';
  @Output() public onSuccess = new EventEmitter();
  @Output() public onSelected = new EventEmitter();
  @Output() public onPaused = new EventEmitter();
  @Output() public onRemove = new EventEmitter();
  @Output() public onStart = new EventEmitter();
  // @Output() public onFail = new EventEmitter();
  public autoUploadSubscription: Subscription;
  private currentChunk: any;
  private fileHash: string;
  private totalChunk: any;
  private FILEURL: string;
  private isUpload = false;
  private chunks: any = [];
  public selectFile: FlowFileModel;
  public constructor(private httpClient: HttpClient, private render2: Renderer2) {
    // console.log(this.getGuid())
  }

  public ngOnInit() {

  }

  public fileUpload(event) {
    event = event || window.event;
    for (const key in event.target.files) {
      if (!isNaN(Number(key))) {
        const file = event.target.files[key];
        this.selectFile = file;
        this.onSelected.emit(file);
        if (Number(key) == event.target.files.length - 1) {
          event.target.value = null;
        }
        if (file.enable == false) {
          return;
        } else {
          this.add(file);
        }
      }
    }

  }

  public sizeTransform(value: any, args?: any): any {
    switch (args) {
      case 'bytes':
        value = value / 1024;
        break;
      default:
        value = value / 1024;
        break;
    }
    let unitIdx = 0;
    let sizeCalc = value; // / 1024;
    for (; unitIdx < unitStrArr.length && sizeCalc > 1024; ++unitIdx) {
      sizeCalc = sizeCalc / 1024;
    }
    return parseFloat(sizeCalc).toFixed(2) + unitStrArr[unitIdx];
  }

  /**
   * 计算进度条宽度
   * @param transfer 
   */
  public getMaskWidth(transfer: FlowFileModel) {
    if (this.transferRow) {
      let percent = transfer.percent;
      let rowWith = this.transferRow.nativeElement.clientWidth;
      let maskWith = percent / 100 * rowWith;
      return maskWith;
    } else {
      return 0;
    }
  }

  /**
   * 选择文件
   * @memberof FileUploaderComponent
   */
  public addFile() {
    this.checkFileInput.nativeElement.click();
  }

  public ngAfterViewInit() {


    // this.flow2.on('fileAdded', function (file, event) {
    //   console.log(file, event);
    // });

    // this.currentSelectedPoint().subscribe((event) => {
    //   console.log(event)
    // })
    this.autoUploadSubscription = this.flow.events$.subscribe(async (event) => {
      if (event.type == "filesSubmitted" && event.event[0][0]) {
        let transfer = event.event[0][0];
        this.pushToList(transfer);
      }
    });
    if (this.multiple) {
      this.render2.setAttribute(this.checkFileInput.nativeElement, 'multiple', 'multiple')
    }
  }

  public currentSelectedPoint(): Observable<any> {
    return this.chunks.asObservable();
  }

  public ngOnDestroy() {
    this.flowFiles.forEach((transfer) => {
      transfer.paused = true;
    });
    this.autoUploadSubscription.unsubscribe();
  }

  public add(file: File) {
    this.flow.flowJs.addFile(file);
  }

  /**
   * 暂停
   * @param transfer 
   */
  public paused(transfer: FlowFileModel) {
    console.log(transfer);
    // this.isUpload = false;
    transfer.paused = true;
    this.onPaused.emit(transfer);
  }

  /**
   * 移除
   * @param transfer 
   * @param index 
   */
  public remove(transfer: FlowFileModel, index?: number) {
    transfer.paused = true;
    transfer.cancel();
    let finder = this.flowFiles.findIndex((file) => {
      return file.fileHash == transfer.fileHash;
    });
    this.flowFiles.splice(finder, 1);
    this.onRemove.emit(transfer);
  }

  /**
   * 添加文件到队列，获取判断文件上传状态
   * @param transfer 
   */
  public async pushToList(transfer: FlowFileModel) {
    console.log(transfer);
    if (transfer.chunks.length > 0) {
      let chunk0 = transfer.chunks[0];
      let function_name = 'slice';
      let fileObj = chunk0.fileObj;
      let startByte = chunk0.startByte;
      let endByte = chunk0.endByte;
      let fileType = chunk0.fileObj.file.type;
      let blob = fileObj.file[function_name](startByte, endByte, fileType);
      // 获取上传url
      this.FILEURL = await this.getUploadUrl();
      if (!this.FILEURL) {
        return;
      }
      // 计算filehesh
      let FileHash = await this.calculate(transfer.file);
      transfer.fileHash = FileHash;
      transfer.paused = true;
      // 获取未上传切片index
      let unUploadData = await this.getStatus(FileHash, transfer.chunks.length);
      let unUploadArray = unUploadData.unUploadChunks;
      if (unUploadData.status == 2) {
        ///////////// 文件已完全上传/////////
        transfer.url = unUploadData.file.url;
        transfer.fileInfo = unUploadData.file;
        if (this.multiple == true) {
          this.flowFiles.push(transfer);
        } else {
          this.flowFiles[0] = transfer;
        }
        transfer.percent = 100;
        this.onSuccess.emit(transfer);
      } else if (unUploadData.status == 0) {
        /////////// 文件未上传过//////////
        transfer.chunks.forEach((item) => {
          item.unUpload = true;
        });
        transfer.percent = 0;
      } else {
        /////////// 文件部分上传///////////
        unUploadArray.forEach((item) => {
          transfer.chunks[item].unUpload = true;
        });
        let chunks = transfer.chunks;
        transfer.percent = Number(((chunks.length - unUploadArray.length) / chunks.length * 100).toFixed(0));
      }

      if (this.transferRow) {
        let rowWith = this.transferRow.nativeElement.clientWidth;
        transfer.maskWith = transfer.percent / 100 * rowWith;
      }

      if (unUploadData.status != 2) {
        if (this.autoUpload) {
          this.start(transfer, 0);
        }
        if (this.multiple == true) {
          this.flowFiles.push(transfer);
        } else {
          this.flowFiles[0] = transfer;
        }
      }
    }
  }

  /**
   * 开始上传
   * @param transfer 
   * @param index 
   */
  public async start(transfer: FlowFileModel, index: number) {
    console.log(transfer);
    let FileHash = transfer.fileHash;
    let chunks = transfer.chunks;
    let chunk = chunks[index];
    transfer.paused = false;
    this.onStart.emit(transfer);
    if (chunk.unUpload) {
      let function_name = 'slice';
      let fileObj = chunk.fileObj;
      let startByte = chunk.startByte;
      let endByte = chunk.endByte;
      let fileType = chunk.fileObj.file.type;
      let chunkSize = chunk.chunkSize;
      let projectId = localStorage.getItem('TenantId');
      let filetype = '.' + fileObj.name.split('.')[fileObj.name.split('.').length - 1];
      let blob = fileObj.file[function_name](startByte, endByte, fileType);
      let that = this;
      let hex = await this.calculate(blob);
      let formData = new FormData();
      if (this.extraParam) {
        for (const key in this.extraParam) {
          formData.append(key, this.extraParam[key]);
        }
        console.log(this.extraParam);
      }
      formData.append('FileHash', FileHash);  // 文件的hash
      formData.append('ChunkHash', hex);  // 当前这一片的hash
      formData.append('Chunk', blob); // 当前这一片的blob
      formData.append('TotalChunks', chunks.length);  // 总片数
      formData.append('ChunkNumber', index.toString()); // 当前这一片的index
      formData.append('CurrentChunkSize', chunkSize); // 当前这一片的大小
      formData.append('FileExtention', filetype); // 文件类型
      formData.append('FileName', fileObj.name);  // 文件名
      formData.append('FileSize', fileObj.size);  // 文件
      formData.append('Tags', "500103,ARCHIVAL_PHASE,BUILDING");  // 文件
      let header = { 'TenantId': this.projectId };
      let res = await that.queryServer({ url: `${this.FILEURL}/api/v${version}/FlowJs/Upload`, method: 'post-form-data' }, formData);
      if (res.success) {
        let data = res.data ? res.data : res.item;
        let percent = Number(((index + 1) / chunks.length * 100).toFixed(0));
        if (percent != 100) {
          transfer.percent = percent;
        } else {
          // 等待最后一片上传，以及文件打包
          transfer.percent = 99;
        }
        transfer.chunks[index].unUpload = false;
        if (that.transferRow) {
          let rowWith = that.transferRow.nativeElement.clientWidth;
          transfer.maskWith = transfer.percent / 100 * rowWith;
        }
        console.log(`第 ${index} 块碎片已上传成功, 进度 ${transfer.percent}%`);
        if (!data && transfer.paused == false) {
          index++;
          this.start(transfer, index);
        } else {
          if (data) {
            // 上传完成
            console.log(data);
            transfer.url = data.url;
            transfer.fileInfo = data;
            console.log('upload finish');
            transfer.percent = 100;
            that.onSuccess.emit(transfer);
          }
        }
      } else {
        console.log(`第 ${index} 块碎片已上传失败`);
      }
    } else {
      if (index < chunks.length - 1 && transfer.paused == false) {
        index++;
        this.start(transfer, index);
      }
    }
  }

  /**
   * 下载文件
   * @param transfer 
   */
  public downLoad(transfer: FlowFileModel) {
    console.log('下载');
    // FileHelper.download(transfer.name, transfer.url)
  }

  /**
   * service: 获取文件已上传状态
   * @param fileHash 
   * @param totalChunk 
   */
  public async getStatus(fileHash: string, totalChunk: number) {
    let param = {
      hash: fileHash,
      totalChunks: totalChunk
    };
    return this.queryServer({ url: `${this.FILEURL}/api/v${version}/FlowJs/UploadFileStatus`, method: 'get' }, param).then((res) => {
      console.log(res);
      if (res.success) {
        let data = res.data ? res.data : res.item;
        return data;
      }
    });
  }
  /**
   * service: 获取上传url
   */
  public async getUploadUrl(): Promise<string> {
    return this.queryServer({ url: `${this.fileHost}/api/v${version}/FlowJs/UploadUrl`, method: 'get' }, {}).then((res) => {
      let data = res.data ? res.data : res.item;
      return data;
    });
  }

  /**
   * tools: 计算文件hex
   * @param file 
   * @param callBack 
   */
  private calculate(file): Promise<string> {
    return new Promise(function (resolve, reject) {
      let blobSlice = File.prototype.slice,
        chunkSize = 2097152,                             // Read in chunks of 2MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();

      fileReader.onload = function (e) {
        // console.log(e.target)
        spark.append(e.target['result']);                   // Append array buffer
        currentChunk++;

        if (currentChunk < chunks) {
          loadNext();
        } else {
          resolve(spark.end());
        }
      };

      fileReader.onerror = function () {
        console.warn('oops, something went wrong.');
      };

      let loadNext = () => {
        let start = currentChunk * chunkSize,
          end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      };

      loadNext();
    });

  }


  public queryServer<T = any>(query: { url: string, method: 'post' | 'get' | 'put' | 'delete' | 'post-form-data' }, param: any, headers?, result?: any): Promise<any> {
    let res = null;
    switch (query.method) {
      case 'post': {
        const headerOptions = this.createHeaders(headers);
        res = this.httpClient.post(query.url, param, { headers: headerOptions });
        break;
      }
      case 'post-form-data': {
        const headerOptions = this.createHeaders(headers);
        res = this.httpClient.post(query.url, param, { headers: headerOptions });
        break;
      }
      case 'get':
        res = this.httpClient.get(query.url, { params: param, headers: this.createHeaders(headers) });
        break;
      case 'put': {
        const headerOptions = this.createHeaders(headers);
        res = this.httpClient.put(query.url, param, { headers: headerOptions });
        break;
      }
      case 'delete': {
        res = this.httpClient.delete(query.url, { headers: this.createHeaders(headers), params: param });
        break;
      }
    }
    return res.pipe(catchError(this.throwError.bind(this))).toPromise().then(this.checkResponeData);
  }

  public createHeaders(headerObj?) {
    let headers: HttpHeaders = new HttpHeaders();
    if (this.getToken()) {
      headers = headers.set('Authorization', 'Bearer ' + this.getToken());
    }
    headers = headers.set('TenantId', Base64.encode(this.projectId));
    for (const key in headerObj) {
      headers = headers.set(key, headerObj[key]);
    }
    return headers;
  }

  private getToken(): string {
    return sessionStorage.getItem('access_token');
  }

  public throwError(error) {
    retry(2);
    console.error(error);
    if (error.error) {
      return of(error.error);
    } else {
      return of({ item: '未知错误' });
    }
  }

  public checkResponeData(res) {
    return res;
  }



}
