import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { isNullOrUndefined, isArray } from 'util';
import { MessageService } from './../../services/message.service';

@Component({
  selector: 'app-gum-toolbar',
  templateUrl: './gum-toolbar.component.html',
  styleUrls: ['./gum-toolbar.component.scss']
})
export class GumToolbarComponent implements OnInit {

  public readonly markColorCfg = ['#ff1a2e', '#ffe81a', '#36c626', '#13a4ef', '#b236e7'];

  public readonly backColorCfg = [
    { value: 0x000000, label: '黑色' },
    { value: 0xffffff, label: '白色' },
  ];

  public readonly frontColorCfg = [
    { value: 'gray', label: '灰度' },
    { value: 'normal', label: '原色' },
  ];

  public readonly unitCfg = [
    { value: gum.GUMUNIT.UNIT_MM, label: '按图纸实际单位进行测量计算' },
    // { value: gum.GUMUNIT.UNIT_M, label: '将图纸单位转换为米(m)进行计算' },
  ];

  public readonly markCfg = [
    // { value: 1, label: '长矩形', class: 'mark-rectangle' },
    // { value: 2, label: '椭圆', class: 'mark-ellipse' },
    // { value: 3, label: '曲线', class: 'mark-curves' },
    // { value: 4, label: '文字', class: 'mark-text' },
    // { value: null, label: '隐藏标记', class: 'hidden' },
  ];

  public readonly measureCfg = [
    { value: gum.MEASURESTATE.DIS, label: '长度', class: 'measure-length' },
    { value: gum.MEASURESTATE.ANH, label: '角度', class: 'measure-angle' },
    // { value: gum.MEASURESTATE.AREA, label: '面积', class: 'measure-area' },
    // { value: gum.MEASURESTATE.POINT, label: '坐标', class: 'measure-point' },
    { value: null, label: '隐藏测量', class: 'hidden' },
  ];

  private readonly d3CmdCfg = [
    { cmd: 'move', isMode: true, do: () => { this.triggerGumBtn('平移'); } },
    { cmd: 'scale', isMode: true, do: () => { this.triggerGumBtn('缩放'); } },
    { cmd: 'region', isMode: true, do: () => { this.triggerGumBtn('框选');  this.isRegion = !this.isRegion;
    this.gumEvent.emit({ type: 'region', param: this.isRegion }); } },
    { cmd: 'clipping', isMode: true, do: () => { this.triggerGumBtn('剖切'); } },
    { cmd: 'explode', isMode: true, do: () => { this.triggerGumBtn('分解'); } },
    { cmd: 'zoomwin', isMode: true, do: () => { this.triggerGumBtn('缩放窗口'); } },
    { cmd: 'measure', isMode: true, do: () => { this.triggerGumBtn('测量'); } },
    { cmd: 'wander', isMode: true, do: () => { this.triggerGumBtn('漫游'); } },
    { cmd: 'peel', isMode: false, do: () => { this.triggerGumBtn('剥离选中构件'); } },
    { cmd: 'hidden', isMode: false, do: () => { this.triggerGumBtn('隐藏选中构件'); } },
    { cmd: 'bind', isMode: false, do: () => { this.triggerGumBtn('绑定选中构件'); } },
    { cmd: 'unbind', isMode: false, do: () => { this.triggerGumBtn('解绑选中构件'); } },
  ];

  @Output()
  public gumEvent: EventEmitter<{ type: string, param: any }> = new EventEmitter();

  @Input()
  public gumStyle = null;

  @Input()
  public gumType: '2d' | '3d' = '2d';

  @ViewChild('mkTextInput', { static: false })
  public mkTextInput: ElementRef = null;

  private _benchId = 0;
  private gum3d: gum.IApi3D = null;
  private gumUI: gum.IUI = null;
  private gumParams: gum.IParams = null;

  public isFullScreen: boolean = false;
  // Gantt 图显示状态
  public isScheduleShow = false;
  // 检验批编辑模式状态
  public openEditstatus = false;
  // 是否框选模式
  public isRegion = false;
  public d3State = '';

  public editState = '';

  public setting: {
    backColor: number;
    FrontColor: 'normal' | 'overdide' | 'custom' | 'gray';
    markColor: string;
    unit: gum.GUMUNIT;
  } = {
      backColor: 0x000000,
      FrontColor: 'normal',
      markColor: '#ff1a2e',
      unit: gum.GUMUNIT.UNIT_MM
    };

  public nzmdMarkText = {
    isOpen: false,
    text: 'text',
    x: 0,
    y: 0,
  };

  public get currMsMode() {
    if (this.gumParams && this.gumParams.ms_enable) {
      return this.gumParams.ms_state;
    }
    return undefined;
  }

  public get currMarkMode() {
    if (this.gumParams && this.gumParams.mk2_enable) {
      return this.gumParams.mk2_type;
    }
    return undefined;
  }

  @Input()
  public set benchId(value: number) {
    if (value) {
      this._benchId = value;
      this.gum3d = gum.Apis.getApi(this._benchId)['3D'];
      this.gumUI = gum.Apis.getApi(this._benchId).UI;
      this.gumParams = gum.Apis.getApi(this._benchId).PARAMS;
      this.gumUI.enableToolBars(false);
      this.gum3d.addEventListener('marker2d_addtext', this.mark2dAddTextCb);
      this.gum3d.addEventListener('fileloader_geomallloadend', () => {
        this.gumUI.enableToolBars(false);
      });
    }
  }

  constructor(private messageService: MessageService) { }

  ngOnInit() {
  }

  private mark2dAddTextCb = (ev: { type: string, params: { x: number, y: number } }) => {
    this.nzmdMarkText.isOpen = true;
    this.nzmdMarkText.x = ev.params.x;
    this.nzmdMarkText.y = ev.params.y;
    this.nzmdMarkText.text = 'text';
    setTimeout(() => {
      if (this.mkTextInput) {
        (this.mkTextInput.nativeElement as HTMLInputElement).focus();
      }
    }, 200);
  }

  public home() {
    this.gumUI.do(new gum.HomeCommand());
  }

  public switchMark(type: number | null) {
    this.closeMeasure();
    if (isNullOrUndefined(type)) {
      this.closeMark();
      return;
    }
    if (this.currMarkMode === type || !this.gumParams.mk2_enable) {
      this.gumParams.mk2_enable = !this.gumParams.mk2_enable;
    }
    if (this.gumParams.mk2_state) {
      this.gumParams.mk2_type = type;
    }
    this.gum3d.update();
  }

  public switchMeasure(value: gum.MEASURESTATE | null) {
    this.closeMark();
    if (isNullOrUndefined(value)) {
      this.closeMeasure();
      return;
    }
    if (this.gumParams.ms_state === value || !this.gumParams.ms_enable) {
      this.gumUI.do(new gum.Measure2DCommand());
    }
    if (this.gumParams.ms_enable) {
      this.gumParams.ms_state = value;
    }
  }

  private closeMeasure() {
    if (this.gumParams.ms_enable) {
      this.gumParams.ms_enable = false;
      this.gum3d.dispatchMeasureEvent({ type: 'exit', param: null });
      setTimeout(() => { this.gumUI.enableToolBars(false); }, 0);
    }
  }

  private closeMark() {
    if (this.gumParams.mk2_enable) {
      this.gumParams.mk2_enable = false;
      this.gum3d.update();
    }
  }

  public rotate2d(func: 'cw' | 'antiCw') {
    const angle = func === 'cw' ? -Math.PI / 2 : Math.PI / 2;
    this.gum3d.rotateLeft(angle);
    this.gum3d.controlUpdate();
    this.gum3d.updateBenchCamera();
    this.gum3d.update();
  }

  public colorChange(type: 'back' | 'front' | 'mark', color: any) {
    if (type === 'back') {
      this.gumParams.eg_clearColor = this.setting.backColor;
    }
    if (type === 'front') {
      this.gumParams.material_state = this.setting.FrontColor;
    }
    if (type === 'mark') {
      this.setting.markColor = color;
      this.gumParams.mk2_rectColor = color;
      this.gumParams.mk2_ellipseColor = color;
      this.gumParams.mk2_curvesColor = color;
      this.gumParams.mk2_textColor = color;
      this.gumParams.mk2_color = color;
      this.gum3d.update();
    }
  }

  public unitChange() {
    this.gumParams.ms_unit = this.setting.unit;
  }
  // 全屏按钮
  public switchFullScreen() {
    this.isFullScreen = !this.isFullScreen;
    this.gumEvent.emit({ type: 'fullScreenSwitch', param: this.isFullScreen });
  }
  // 进度按钮
  public openGantt() {
    this.isScheduleShow = !this.isScheduleShow;
    this.gumEvent.emit({ type: 'gantt', param: this.isScheduleShow });

  }
  // 检验批编辑模式
  public openEdit() {
    this.openEditstatus = !this.openEditstatus;
    if(this.openEditstatus == true){
      this.editState = 'openEdit';
    }
    else{
      this.editState = '';
    }
    this.gumEvent.emit({ type: 'openEditstatus', param: this.openEditstatus });

  }
  // 绑定
  public bind() {
    this.gumEvent.emit({ type: 'bind', param: true });
  }
  // 解绑
  public unbind() {
    this.gumEvent.emit({ type: 'unbind', param: true });
  }

  public addTextMark2Gum(from: 'btn' | 'key', event: KeyboardEvent) {
    if (from === 'key' && event.key !== 'Enter') {
      return;
    }
    const size = 48 / this.gum3d.getBenchCamera().zoom;
    this.gum3d.addMarker2DText({
      x: this.nzmdMarkText.x,
      y: this.nzmdMarkText.y,
      text: this.nzmdMarkText.text,
      size,
      color: '#fff',
    });
    this.nzmdMarkText.isOpen = false;
  }

  public cancelAddTextMark2Gum() {
    this.nzmdMarkText.isOpen = false;
  }

  private triggerGumBtn(keyword: string) {
    const gumBtns = document.querySelectorAll('.gum-toolbar .gum-toolbar-item');
    if (gumBtns && gumBtns.length === 0) {
      return;
    }
    let btnFinder: Element = null;
    Array.prototype.forEach.call(gumBtns, (item) => {
      if ((item as HTMLDivElement).title === keyword) {
        btnFinder = item;
      }
    })

    if (!btnFinder) {
      return;
    }
    const mouseupEvent = new MouseEvent('mouseup', { button: 0 });
    btnFinder.dispatchEvent(mouseupEvent);
  }

  public cmd3d(cmdName: string) {
    const d3Cmd = this.d3CmdCfg.find(item => item.cmd === cmdName);
    if (!d3Cmd) {
      return;
    }
    const needDealOld: boolean = (d3Cmd && d3Cmd.isMode && cmdName !== this.d3State);
    if (needDealOld) {
      this.d3State = '';
    }
    d3Cmd.do();
    if (d3Cmd.isMode) {
      this.d3State = this.d3State === d3Cmd.cmd ? '' : d3Cmd.cmd;
    }
  }
}
