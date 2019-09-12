// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const server = JSON.parse(window.localStorage.getItem('server')) || {}
const APDInfo = JSON.parse(window.localStorage.getItem('APDInfo')) || {}

export const environment = {
  production: false,
  // 平台切换(apiPath/HOSTURL)
  apiPath: 'audit', // bim|audit
  // HOSTURL: 'http://bim.am.typeo.devp',
  HOSTURL: 'http://bim.am.typeo.org',
  // HOSTURL: 'http://audit.am.typeo.org',
  // HOSTURL: 'http://bim.am.local.typeo.org',
  PREFIX: APDInfo['apiPath'] || 'am', // 注意项目切换后手动验证
  // 文件服务
  IDENTITYURL: server['identityRootAddress'] || 'http://id.typeo.org',
  FILEURL: server['fileServerRootAddress'] || 'http://jwfs.typeo.org',
  CDNFILEURL: server['fileServerRootAddress'] || 'http://jwfs.typeo.org',
  // 版本
  version: 1
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
