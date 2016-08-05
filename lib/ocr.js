const crypto = require('crypto');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const request = require('request-promise');
const request2 = require('request');

Promise.promisifyAll(fs);

var headersToSign = [];

/**
 * get source image path
 *
 * @method getImg
 * @param {String} url source image path or url.
 * @param {String} path dest image path.
 * @return {Promise} path of image file
 */
function getImg(url, path) {
  if (url.startsWith('http') || url.startsWith('https')) {
    return download(url, path);
  } else {
    return new Promise(function (resolve, reject) {
      resolve(url);
    });
  }
}

/**
 * download image from internet.
 *
 * @method download
 * @param {String} uri download url
 * @param {String} tmpPath file path
 * @return {Promise}
 */
function download(uri, tmpPath) {
  return new Promise(function (resolve, reject) {
  	request.head(uri, function(err, res, body){
  	  //console.log('content-type:', res.headers['content-type']);
  	  //console.log('content-length:', res.headers['content-length']);

  	  request(uri)
        .pipe(fs.createWriteStream(tmpPath))
        .on('close', function () {
          //console.log('request close');
          resolve(tmpPath);
			  })
        .on('error', function (err) {
          console.log('Exception: download file!');
          console.log(err);
          reject(err);
        });
  	});
	});
}

/**
 * TIMS server OCR API wrapper
 * @class OCR
 */
function OCR(host, secretKey) {
  this.host = host;
  this.secretKey = secretKey;
}

module.exports.create = function(host, secretKey) {
  return new OCR(host, secretKey);
};

OCR.fn = OCR.prototype;

/**
 * ocr信息及文件查询接口
 * @function uploadFile
 * @memberof OCR
 * @return {Promise}
 */
OCR.fn.uploadFile = function uploadFile(opt) {
  var self = this;

  var fileParam = {
    "bill_pk": opt.bill_pk,
  	"note_type": 0,
    "doc_name": "test.jpg为上海增票",
    "recognize_type": "同步",
    "data": {
      "file_pk": opt.file_pk,
      "file_name": "test.jpg",
      "file_format": "jpg",
      "file_size": "", // stat --printf="%s" test.jpg
      "file_md5": "", // md5=($(md5sum test.jpg));echo $md5
      "desc": "a test.jpg image"
  	}
  };

  var path = '/TIMS-Server/postController/uploadFile';
  var httpMethod = 'post';
  var headers = {
    'host': self.host,
    'secretKey': self.secretKey
  };

  return new Promise(function (resolve, reject) {
    // download dest path is /tmp/xxdebug.jpg
    getImg(opt.url, '/tmp/xxdebug.jpg').then(function(filePath) {

       // request-promise lib
       var options = {
         uri: 'http://' + headers.host + path,
         // application/x-www-form-urlencoded (URL-Encoded Forms)
         //form : {},
         // multipart/form-data (Multipart Form Uploads)
         formData: {
           file_param: JSON.stringify(fileParam),
           file: fs.createReadStream(filePath)
         },
         headers: headers,
         method: httpMethod,
         encoding: 'UTF-8',
         json: true
       };
       request(options).then(function (result) {
         if (result.return_code !== 0) {
           return reject(new Error("return code is not 0"));
         }
         var ret = {
           invNum: result.data.invNum,
           tims: result // just for debug
         };
         return resolve(ret);
       }).catch(function (err) {
         reject(err);
       });
    }).catch(function (err) {
      reject(err);
    });
  });
};

/**
 * ocr信息及文件查询接口
 * @function getOCRMsg
 * @param {String} imageUUID 影像系统图片唯一标识
 * @memberof OCR
 * @return {Promise} 增值税专用发票识别后返回的JSON结果
 */
OCR.fn.getOCRMsg = function getOCRMsg(imageUUID) {
  var self = this;

  var path = '/TIMS-Server/postController/getOCRMsg';
  var httpMethod = 'post';
  var headers = {
    'host': self.host,
    'secretKey': self.secretKey
  };

  return new Promise(function (resolve, reject) {
    // request-promise lib
    var options = {
      uri: 'http://' + headers.host + path,
      // application/x-www-form-urlencoded (URL-Encoded Forms)
      //form : {},
      // multipart/form-data (Multipart Form Uploads)
      formData: {
        file_id: imageUUID
      },
      headers: headers,
      method: httpMethod,
      encoding: 'UTF-8',
      json: true
    };
    request(options).then(function (result) {
      if (result.return_code !== 0) {
        return reject(new Error("return code is not 0"));
      }
      var ret = {
        invNum: result.data.invNum,
        tims: result // just for debug
      };
      return resolve(ret);
    }).catch(function (err) {
      console.log("exception in request!");
      reject(err);
    });
  });
};

/**
 * 文件下载接口
 * @method getImage
 * @memberof OCR
 * @return {Promise}
 */
OCR.fn.getImage = function getImage(imageUUID, savedFilePath) {
  var self = this;

  var path = '/TIMS-Server/cMImageController/getImage';
  var httpMethod = 'get';
  var headers = {
    'host': self.host,
    'secretKey': self.secretKey
  };

  return new Promise(function (resolve, reject) {
    // request-promise lib
    var options = {
      uri: 'http://' + headers.host + path,
      // application/x-www-form-urlencoded (URL-Encoded Forms)
      //form : {},
      // multipart/form-data (Multipart Form Uploads)
      //formData: {
      //  file_id: imageUUID
      //},
      qs: {
        file_id: imageUUID
      },
      headers: headers,
      method: httpMethod
    };
    request2(options)
      /*.then(function (result) {
      if (result.return_code !== 0) {
        return reject(new Error("return code is not 0"));
      }
      var ret = {
        invNum: result.data.invNum,
        tims: result // just for debug
      };
      return resolve(ret);
    }).catch(function (err) {
      console.log("exception in request!");
      reject(err);
    });*/
      .pipe(fs.createWriteStream(savedFilePath))
      .on('response', function(response) {
        console.log('request [response] event')
        console.log(response.statusCode) // 200
        console.log(response.headers['content-type']) // 'image/png'
      })
      .on('error', function(err) {
        console.log('request [error] event');
        console.log(err)
      })
      .on('close', function () {
        console.log('request [close] event')
        resolve(savedFilePath);
      })

  });
};

OCR.fn.socket = function socket() {
  return new Promise(function (resolve, reject) {
    const net = require('net');
    const options = {
      port: '39456',
      host: '127.0.0.1'
    };
    const socket = net.connect(options, () => {
      console.log('Connected');
      socket.write('test');
    });
    socket.on('close', () => {
      resolve({
        success: true
      });
    });
    socket.on('connect', () => {
    });
    socket.on('data', (data) => {
      console.log('on data event');
      console.log(data);
      console.log('Received: ' + data);
      socket.destroy(); // kill client after server's response
    });
    socket.on('error', () => {
      console.log('on error event');
    });
  });
};
