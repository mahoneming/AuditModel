const server = JSON.parse(window.localStorage.getItem('server')) || {}
const APDInfo = JSON.parse(window.localStorage.getItem('APDInfo')) || {}

export const environment = {
  production: true,
  apiPath: 'audit',
  HOSTURL: 'http://audit.am.typeo.org',
  PREFIX: APDInfo['apiPath'] || 'am', // 注意项目切换后手动验证
  // 文件服务
  IDENTITYURL: server['identityRootAddress'] || 'http://id.typeo.org',
  FILEURL: server['fileServerRootAddress'] || 'http://jwfs.typeo.org',
  CDNFILEURL: server['fileServerRootAddress'] || 'http://jwfs.typeo.org',
  version: 1
};