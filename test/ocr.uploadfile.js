var should = require('should');

// ## TIMS-server
//const host = '124.207.70.41:8199';
//const secretKey = '1234567890';
//const wrongSecretKey = '0987654321';
// ## mock TIMS-server
//const host = '101.200.74.182:3004';
//const secretKey = 'tims';
//const wrongSecretKey = '0987654321';
// ## dev TIMS server 
const host = '101.200.74.182:8088';
const secretKey = '11111';
const wrongSecretKey = '0987654321';
//

var wrong_sk = 'wrong_sk';
var ocr = require('../').create(host, secretKey);
var ocr2 = require('../').create(host, wrongSecretKey);

describe('test/ocr.uploadfile.js', function () {

  describe('图像上传接口', function () {
    it('应该返回相应JSON数据', function (done) {
      ocr.uploadFile({
        url: 'test/test01.jpg',
        bill_pk: 'bill123',
        file_pk: 'img123'
      }).then(function (result) {
        result.should.be.an.instanceOf(Object);
        result.should.have.property('invNum');
        result.should.have.property('tims');
        result.tims.should.be.an.instanceOf(Object);
        done();

      }).catch(function (err) {
        console.log(err);
        err.should.be.an.instanceOf(Error);
        done();
      });
    });
  });

});
