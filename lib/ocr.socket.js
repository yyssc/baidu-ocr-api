const crypto = require('crypto');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const net = require('net');

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

module.exports.create = function(ip, port) {
  return new OCRSocket(ip, port);
};

OCRSocket.fn = OCRSocket.prototype;

OCRSocket.fn.scan = function scan(filePath) {
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

    var xmllength = bodyStr.length;
    var xmllength = pad(xmllength, 7);

    const options = {
      port: self.port,
      host: self.ip
    };
    const socket = net.connect(options, () => {
      console.log('Connected');
      socket.write(socketLengthStr); // request head
      socket.write(xmllength); // json head
      socket.write(bodyStr); // json body
      socket.write(imgBuf); // image file stream
    });
    socket.on('close', () => {
      resolve({
        success: true
      });
    });
    socket.on('connect', () => {
    });
    socket.on('data', (/*Buffer*/data) => {
      console.log('on data event');
      console.log(typeof data);
      console.log(data);
      console.log('Received: ' + data);
      socket.destroy(); // kill client after server's response
    });
    socket.on('error', () => {
      console.log('on error event');
    });
  });
};
