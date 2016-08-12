/*jslint node: true */

'use strict';

const _ = require('lodash');
const utils = require('./utils.js');

/**
 * Post process OCR result to fix error
 * @exports postprocess
 */
module.exports = function (obj) {
  obj.postprocess = true;
  _.map(obj.buyer, function (field, key) {
    if (field.item === 'buyerNo') {
      var str = utils.char2int(field.value);
    }
  });
  return obj;
};

