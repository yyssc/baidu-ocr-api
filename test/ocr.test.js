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

describe('test/ocr.test.js',function () {
  /*describe('upload from cdn_url  ',function () {
    it('should have result',function (done) {
      ocr.upload({
        url:'http://7xod3k.com1.z0.glb.clouddn.com/mjdalykzuyefpzlgmlnkjizcfcuelxnu',
        type:'text',
      }).then(function (result) {
        result.should.be.an.instanceOf(Object);
        done();
      })
    })
  })
  describe('wrong_sk  ',function () {
    it('should be catch error',function (done) {
      ocr2.upload({
        url:'http://7xod3k.com1.z0.glb.clouddn.com/mjdalykzuyefpzlgmlnkjizcfcuelxnu',
      }).then(function (result) {

      }).catch(function (err) {
        err.should.be.an.instanceOf(Error);
        done();
      })
    })
  })
  describe('upload from cdn_url: merge==false  ',function () {
    it('should have result',function (done) {
      ocr.upload({
        url:'http://7xod3k.com1.z0.glb.clouddn.com/mjdalykzuyefpzlgmlnkjizcfcuelxnu',
        type:'text',
        merge:false
      }).then(function (result) {
        result.should.be.an.instanceOf(Object);
        done()
      })
    })
  })
  describe('upload from wrong local_url  ',function () {
    it('should have result',function (done) {
      ocr.upload({
        url:'http://wrong_url',
        type:'text'
      }).then(function (result) {

      }).catch(function (err) {
        err.should.be.an.instanceOf(Error);
        done()
      })
    })
  })
  describe('upload from local url  ',function () {
    it('should return object',function (done) {
      ocr.upload({
        url:__dirname+'/test01.jpg',
        type:'text'
      }).then(function(result) {
        result.should.be.an.instanceOf(Object);
        done()
      })
    })
  })

  describe('upload from wrong local_url  ',function () {
    it('should have result',function (done) {
      ocr.upload({
        url:'wrong url',
        type:'line'
      }).then(function (result) {

      }).catch(function (err) {
        err.should.be.an.instanceOf(Error);
        done()
      });
    });
  });*/

  describe('ocr信息及文件查询接口', function () {
    it('should have result', function (done) {
      ocr.getOCRMsg({
      }).then(function (result) {
        result.should.be.an.instanceOf(Object);
        result.should.have.property('return_code');
        done();

      }).catch(function (err) {
        err.should.be.an.instanceOf(Error);
        done();
      });
    });
  });

  describe('文件下载接口', function () {
    it('should have result', function (done) {
      ocr.getOCRMsg({
      }).then(function (result) {
        result.should.be.an.instanceOf(Object);
        done();

      }).catch(function (err) {
        err.should.be.an.instanceOf(Error);
        done();
      });
    });
  });

})
