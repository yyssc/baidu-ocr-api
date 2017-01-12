/*jslint node: true */

'use strict;'

const debug = require('debug')('ocr');
const crypto = require('crypto');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const net = require('net');

const postprocess = require('./postprocess');

Promise.promisifyAll(fs);

/**
 * 123 -> 000123
 * @function
 * @param {Integer} num The number needed to append padding
 * @param {Integer} size The padding count
 * @return {String} after padding
 */
function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

/**
 * Socket API wrapper for TIMS OCR server
 * @class OCRSocket
 */
function OCRSocket(ip, port) {
  this.ip = ip;
  this.port = port;
}

/**
 * OCR module (socket wrapper)
 * @module OCRSocket
 * @see OCR
 */

/**
 * Create OCRSocket instance
 * @param {String} ip IP address of local socket to connect
 * @param {String} port port of local socket to connect
 */
module.exports.create = function (ip, port) {
  return new OCRSocket(ip, port);
};

OCRSocket.fn = OCRSocket.prototype;


/**
 * OCR scan a local image file
 * @param {String} filePath local file path of a image
 * @param {Boolean} enablePostProcess Whether to enable post process for OCR result
 * @return {Promise} JSON format result of recognization result
 */
OCRSocket.fn.scan = function scan(filePath, enablePostProcess) {
  var self = this;
  return new Promise(function (resolve, reject) {
    var body = {
      fileId: 'img123',
      mod: 0, // 0->sync, 1->async
      IP: '127.0.0.1',
      port: '8088'
    };
    var bodyStr = JSON.stringify(body);

    var imgBuf = fs.readFileSync(filePath);

    var socketLength = 15 + 7 + bodyStr.length + imgBuf.length;
    var socketLengthStr = socketLength - 15 + "";
    var socketLengthStr = pad(socketLengthStr, 15);

    var jsonlength = bodyStr.length;
    var jsonlength = pad(jsonlength, 7);

    const options = {
      port: self.port,
      host: self.ip
    };

    // Create a TCP/IP socket to connect to OCR server on localhost
    const socket = net.connect(options, () => {
      debug('Connected');
      debug(socketLengthStr);
      socket.write(socketLengthStr); // request head
      debug(jsonlength);
      socket.write(jsonlength); // json head
      socket.write(bodyStr); // json body
      socket.write(imgBuf); // image file stream
    });
    socket.on('close', () => {
      var data = self.ocrResult;
      if (enablePostProcess) {
        data = postprocess(data);
      }
      resolve({
        data: data,
        old: self.ocrResultStr
      });
    });
    socket.on('connect', () => {
    });
    socket.on('data', (/*Buffer*/data) => {
      debug('on data event');
      //debug(data);
      debug('Received: ' + data);
      // TODO(d3vin): cut string according to socket API.
      var body = data.toString().substr(22);
      self.ocrResult = JSON.parse(body);
      self.ocrResultStr = body;
      socket.destroy(); // kill client after server's response
    });
    socket.on('error', (e) => {
      console.error('on error event:', e);
      console.error('Make sure the OCR server is started')
    });
  });
};
