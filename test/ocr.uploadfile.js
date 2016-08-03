var should = require('should');
var ak = 'b7d11214c8fc452db3de12028cf46daa';
var sk = '64631fe987f4423bb0a117101bf90a45';
// TIMS-server
const ip = '124.207.70.41';
const port = '8199';
const secretKey = '1234567890';
const wrongSecretKey = '0987654321';
//
var wrong_sk = 'wrong_sk';
var ocr = require('../').create(ip, port, secretKey, ak, sk);
var ocr2 = require('../').create(ip, port, wrongSecretKey, ak, wrong_sk);

describe('test/ocr.uploadfile.js',function () {

  describe('图像上传接口', function () {
    it('should have result', function (done) {
      ocr.uploadFile({
      }).then(function (result) {
        result.should.be.an.instanceOf(Object);
        result.should.have.property('bill_pk');
        done();

      }).catch(function (err) {
        err.should.be.an.instanceOf(Error);
        done();
      });
    });
  });

});
