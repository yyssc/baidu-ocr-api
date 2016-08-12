/*jslint node: true */

'use strict';

const _ = require('lodash');

/**
 * Post process OCR result to fix error
 * @exports postprocess
 */
module.exports.char2int = function (str) {
  if (/^\d+$/.test(str)) {
    // no char in string
    return str;
  }
  const mapping = {
    'z': '2',
    'l': '1',
    'O': '0',
    'o': '0'
  }
  _.forEach(mapping, function (value, key) {
    str = str.replace(key, value);
  });
  return parseInt(str);
};

