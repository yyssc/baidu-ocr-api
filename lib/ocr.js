var crypto = require('crypto');
var Promise = require('bluebird');
var fs = require('fs');
var request = require('request-promise');
Promise.promisifyAll(fs);

var headersToSign = [];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
// This method has been added to the ECMAScript 6 specification and may not be 
// available in all JavaScript implementations yet. However, you can polyfill 
// `String.prototype.startsWith()` with the following snippet:
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

/**
 * TIMS server OCR API wrapper.
 *
 * @class OCR
 * @constructor
 */
function OCR(ip, port, secretKey, ak, sk) {
  this.ip = ip;
  this.port = port;
  this.secretKey = secretKey;
  this.ak = ak;
  this.sk = sk;
}

module.exports.create = function(ip, port, secretKey, ak, sk) {
  return new OCR(ip, port, secretKey, ak, sk);
};

OCR.fn = OCR.prototype;

/**
 * Upload a image to process.
 *
 * @method upload
 * @param {Object} opt
 * @return {Promise}
 */
OCR.fn.upload = function upload(opt) {

  var pathOpt = {
    text:'/v1/recognize/text', // 识别某张图中的所有文字
    line:'/v1/recognize/line', // 将结果作为单行文字去解析
    character:'/v1/recognize/character' // 识别某张图中的单个文字
  }
  var merge = opt.merge;
  if(merge === 'false'||merge ===false)
  {
    merge = false;
  }else{
    merge = true;
  }
  // init data
  var type = opt.type||'text';
  var path = pathOpt[type];
  var url = opt.url;
  var language = opt.language||'CHN_ENG';
  var accessKeyId = this.ak;
  var secretAccessKey = this.sk;
  var requestDate = new Date().toISOString().slice(0, -5) + 'Z';
  var expire = 3600;
  var httpMethod = 'post';

  var params = {}; //
  var headers = {
    'host': 'ocr.bj.baidubce.com',
    'x-bce-date': requestDate
  };
  return new Promise(function (resolve,reject) {
    getImgBase64(url).then(function(result) {
      var data = {
           base64:result,
           language:language
         };
         // get Authorization
       var databuffer = new Buffer(JSON.stringify(data));
       headers['Content-Type'] = 'clarapplication/json';
       headers['Content-Length'] = databuffer.length;

       var content = 'bce-auth-v1/'+ accessKeyId +'/'+ requestDate +'/' + expire;
       // get SigningKey
       var SigningKey = crypto.createHmac('sha256', secretAccessKey).update(content).digest('hex');
       var CanonicalURI = path;
       var CanonicalQueryString = getCanonicalQueryString(params);
       var CanonicalHeaders = getCanonicalHeaders(headers);
       var CanonicalRequest = [httpMethod.toUpperCase(), CanonicalURI, CanonicalQueryString, CanonicalHeaders].join('\n');
       // get Signature
       var Signature = crypto.createHmac('sha256', SigningKey).update(CanonicalRequest).digest('hex');
       // Mosaic Authorization
       headers.Authorization = [content, headersToSign.join(';'), Signature].join('/');
       var url = 'http://'+headers.host+path;
       var options = {

         json:data,
         host: headers.host,
         path: path+'?'+getCanonicalQueryString(params),
         headers: headers,
         method:httpMethod,
         encoding:'UTF-8'
       };
       request(url,options).then(function (result) {
         if(!result.results){
           return reject(result)
         }
         if(merge){
           var words = '';
           var rectangles = [];
           result.results.forEach(function (result) {
             words+= result.word;
             rectangles.push(result.rectangle)
           })
           return resolve({results:{
             words:words,
             rectangles:rectangles
           }})
         }
         return resolve(result);
       }).catch(function (err) {
         reject(err);
       })
    }).catch(function (err) {
      reject(err);
    })
  })

function getCanonicalQueryString(params) {
    var result = [];
    for(var key in params) {
      if(key.toLowerCase() != 'authorization') {
        result.push(normalize(key) + '=' + normalize(params[key]));
      }
    }
    result.sort();
    return result.join('&');
  }

  function getCanonicalHeaders(headers) {
    headersToSign = ['host', 'content-md5', 'content-length', 'content-type'].concat(headersToSign);
    var result = [];
    var tempHeaderToSign = [];
    for(var key in headers) {
      var keyLower = key.toLowerCase();
      var value = headers[key].toString().trim();
      if(/^x-bce-/.test(keyLower) || new RegExp(keyLower).test(headersToSign)) {
        var temp = normalize(keyLower) + ':' + normalize(value);
        tempHeaderToSign.push(normalize(keyLower));
        result.push(temp);
      }
    }
    headersToSign = tempHeaderToSign.sort();
    result.sort();
    return result.join('\n');
  }

  function normalize(input, exceptSlash) {
    var result = '';
    if(input == null) {
      return result;
    }
    input = input.toString();
    for (var i = 0; i < input.length; i++) {
      var ch = input.charAt(i);
      if ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') || ch == '_' || ch == '-' || ch == '~' || ch == '.') {
        result += ch;
      } else if (ch == '/') {
        result += !exceptSlash ? '%2F' : ch;
      } else {
        result += '%' + new Buffer(ch).toString('hex').toUpperCase();
      }
    }
    return result;
  }
  // 获取base64
  function getImgBase64(url) {
    return new Promise(function (resolve,reject) {
    // 外部地址
      if(url.startsWith('http')||url.startsWith('https')){
        request({
          method:'GET',
          url:url,
          headers:{
            'User-Agent': 'Paw/2.1 (Macintosh; OS X/10.10.5) GCDHTTPRequest',
            'Referer':'http://baidu.com'
          },
          encoding:null
        }).then(function (result) {
          resolve(result.toString('base64'));
        }).catch(function (err) {
          reject(err);
        })
      }else{ // 本地地址
        fs.readFileAsync(url)
        .then(function (data) {
          resolve(data.toString('base64'))
        })
        .catch(function (err) {
          reject(err);
        })
      }
    })
  }
};

/**
 * @method getOCRMsg
 * @return {Promise}
 */
OCR.fn.getOCRMsg = function getOCRMsg() {
  return new Promise(function (resolve, reject) {
    var fakeResult = {
    "return_code":'结果代码',
    "error_msg":'错误信息',
    "data":{
               "image_id ":'文件唯一id',  //影像系统图片唯一标识 
"file_pk":'文件pk',//NC系统提供的文件pk（请求报文获取）
"image_url":'文件访问地址',//NC系统可以直接访问的url路径
"invCode":'发票代码',
        "invNum":'发票编码',
        "invDate":'开票日期',
        "taxpayerCode":'购方纳税人识别码',
        "sellerTaxpayerCode":'销售方识别码',
        "invMny":'无税金额',
        "invTaxMny":'含税金额',
        "tax":'税额',
        "upperTaxMny":'大写金额',
        "secret":'密文区',
        "vmemo":'备注',
        "taxpayername":'购方名称',
        "taxpayeraddress":'购方地址电话',
        "taxpayeraccount":'购方开户行及账号',
        "taxsuppliename":'销售方名称',
        "taxsupplieaddr":'销售方地址电话',
        "taxsupplieaccount":'销售方开户行及账号',
"payee":'收款人',
"reviewer":'复合',
"drawer":'开票人'
        
    }
};

    resolve(fakeResult);
  });
};

/**
 * @method getImage
 * @return {Promise}
 */
OCR.fn.getImage = function getImage() {
  return new Promise(function (resolve, reject) {
    var fakeResult = {
      path: "/tmp/xx.png"
    };
    resolve(fakeResult);
  });
};
