const should = require('should');
const assert = require('assert');
const fs = require('fs');

// TIMS-server
//const host = '124.207.70.41:8199';
//const secretKey = '1234567890';
//const wrongSecretKey = '0987654321';
// mock TIMS-server
const host = '101.200.74.182:3004';
const secretKey = 'tims';
const wrongSecretKey = '0987654321';
//

var wrong_sk = 'wrong_sk';
var ocr = require('../lib/ocr.http').create(host, secretKey);
var ocr2 = require('../lib/ocr.http').create(host, wrongSecretKey);

describe.skip('test/ocr.getimage.js', function () {

  describe('文件下载接口', function () {
    it('应该返回指定id的图片', function (done) {
      ocr.getImage('img123', '/tmp/save_as_image.jpg')
        .then(function (savedFilePath) {
          console.log(savedFilePath);
          if (!fs.existsSync(savedFilePath)) {
            assert.ok(false, 'file not found!');
          }
          done();
        })
        .catch(function (err) {
          console.log('Exception: mocha test!')
          console.log(err);
          console.log(err.stack);
          err.should.be.an.instanceOf(Error);
          done();
        });
    });
  });

});
