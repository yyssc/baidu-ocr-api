var should = require('should');

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

describe('test/ocr.getocrmsg.js', function () {

  describe('ocr信息及文件查询接口', function () {
    it('应该返回指定id的图片对应的JSON数据', function (done) {
      ocr.getOCRMsg('img123')
        .then(function (result) {
          result.should.be.an.instanceOf(Object);
          result.should.have.property('invNum');
          result.should.have.property('tims');
          result.tims.should.be.an.instanceOf(Object);
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
