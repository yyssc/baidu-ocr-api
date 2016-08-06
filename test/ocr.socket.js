const should = require('should');
const fs = require('fs');
const util = require('util');

// ## dev ocr_srv
const ip = '127.0.0.1';
const port = '39456';
//

var wrong_sk = 'wrong_sk';
var ocr = require('../lib/ocr.socket').create(ip, port);

describe('test/ocr.socket.js', function () {

  describe('直接调用ocr_srv的socket接口', function () {
    it('socket1', function (done) {
      var filePath = 'test/Image_00001.jpg';
      if (!fs.existsSync(filePath)) {
        console.log(util.format("\x1b[31mFile %s not found, please download it from https://drive.google.com/drive/folders/0B_RIK8efdyq-VmZqMUJOaTVtVm8", filePath));
        done();
        return;
      }

      ocr.scan(filePath).then(function (result) {
        result.should.be.an.instanceOf(Object);
        done();

      }).catch(function (err) {
        console.log(err);
        err.should.be.an.instanceOf(Error);
        done();
      });
    });
  });

});
