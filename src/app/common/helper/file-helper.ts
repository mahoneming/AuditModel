declare var CryptoJS: any;

export class FileHelper {

  constructor() {}

  static download(name: string, URL: any) {
    let objectUrl = URL + this.createPwd(name);
    console.log(objectUrl)
    let aTag = document.createElement('a');
    document.body.appendChild(aTag);
    aTag.setAttribute('style', 'display:none');
    aTag.setAttribute('href', objectUrl);
    aTag.setAttribute('download', name);
    aTag.click();
    document.body.removeChild(aTag);
  }

  static downloadBatch(name: string, URL: any) {
    let objectUrl = URL + this.createPwd(name);
    console.log(objectUrl)
    let iframe = document.createElement("iframe");
    iframe.setAttribute('style', 'display:none');
    iframe.setAttribute('src', objectUrl);
    iframe.setAttribute('download', name);
    document.body.appendChild(iframe);
    setTimeout(() => {
      iframe.remove();
    }, 5000)
  }

  static downloadBlob(name: string, blob: Blob) {
    let objectUrl = URL.createObjectURL(blob);
    console.log(objectUrl)
    let aTag = document.createElement('a');
    document.body.appendChild(aTag);
    aTag.setAttribute('style', 'display:none');
    aTag.setAttribute('href', objectUrl);
    aTag.setAttribute('download', name);
    aTag.click();
    URL.revokeObjectURL(objectUrl);
    document.body.removeChild(aTag);
  }

  static createPwd(fileName?: string) {
    let appId = 'spiderbim';
    let secretId = "AKIDgaoOYh2kOmJfWVdH4lpfxScG2zPLPGoK";
    let secreteKey = "nwOKDouy5JctNOlnere4gkVoOUz5EYAb";
    // let ticks = "1531450900781";//new Date().getTime();
    let ticks = new Date().getTime();
    let plainText = "a=" + appId + "&s=" + secretId + "&t=" + ticks;
    let hash = CryptoJS.HmacSHA1(plainText, secreteKey);
    let pText = CryptoJS.enc.Utf8.parse(plainText)
    let all = hash.concat(pText);
    let bs = CryptoJS.enc.Base64.stringify(all);
    // document.getElementById("qrCode").innerText = bs;
    // this.pwdUrl = "?s=" + secretId + "&t=" + ticks + "&at=" + bs;
    if (fileName) {
      return "?download=" + fileName + "&a=" + appId + "&s=" + secretId + "&t=" + ticks + "&at=" + bs;
    } else {
      return "?a=" + appId + "&s=" + secretId + "&t=" + ticks + "&at=" + bs;
    }

    // console.log(ticks);
  }


}