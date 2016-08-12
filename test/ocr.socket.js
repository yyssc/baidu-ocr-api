/*jslint node: true */

'use strict;'

const should = require('should');
const fs = require('fs');
const util = require('util');

// ## dev ocr_srv
const ip = '127.0.0.1';
const port = '39456';
//

const filePath = 'test/Image_00001.jpg';
const wrong_sk = 'wrong_sk';
const ocr = require('../').create(ip, port);

describe('OCR', function () {
  describe('#scan()', function () {
    before(function () {
      if (!fs.existsSync(filePath)) {
        console.log(util.format("\x1b[31mFile %s not found, please download it from https://drive.google.com/drive/folders/0B_RIK8efdyq-VmZqMUJOaTVtVm8", filePath));
        this.skip();
        return;
      }
    });

    context('when processing a local image', function () {
      it('should have some properties in result', function (done) {
        ocr.scan(filePath).then(function (result) {
          const ocrObj = result.data;
          const ocrOriginalStr = result.old;

          ocrObj.should.be.an.instanceOf(Object);
          ocrObj.should.have.property('fileId');
          ocrObj.should.have.property('message');
          ocrObj.should.have.property('result');
          ocrOriginalStr.should.be.an.instanceOf(String);

          done();
        }).catch(function (err) {
          console.log(err);
          err.should.be.an.instanceOf(Error);
          done();
        });
      });
    });

    context('when processing a local image with post processing', function () {
      it('should have some properties in result', function (done) {
        ocr.scan(filePath, /*enablePostProcessing*/true).then(function (result) {
          const ocrObj = result.data;
          const ocrOriginalStr = result.old;
          ocrObj.should.be.an.instanceOf(Object);
          ocrObj.should.have.property('fileId');
          ocrObj.should.have.property('message');
          ocrObj.should.have.property('result');
          ocrObj.postprocess.should.equal(true);
          ocrOriginalStr.should.be.an.instanceOf(String);
          done();
        }).catch(function (err) {
          console.log(err);
          err.should.be.an.instanceOf(Error);
          done();
        });
      });
    });
  });
});
