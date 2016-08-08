## [TIMS-OCR-API](http://www.tchzt.com/) For Nodejs

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]

[![Downloads][downloads-image]][npm-url]

### intro

TIMS OCR提供两种接口：

- Socket
- HTTP（已废弃）

将Socket接口封装成`OCR.scan()`这样的Node.js接口。

API Document: https://yyssc.github.io/tims-ocr-api/jsdoc/

### Advantages

-  支持本地图片 外部图片(速度取决图片大小)
-  识别简单的验证码
-  平时相机拍摄书本的文字,基本能达到 95%
-  支持 shell/nodejs 全局安装可在控制台直接运行
-  bluebird/promise 接口操作灵活

### 识别发票类型

- 增值税专用发票（[票样](examples/sample.jpg)）

### 依赖

- 安装`ocr_srv`并启动`./start.sh`

### Install & Usage

#### 1. Global

```sh
npm install tims-ocr-api -g

ocr --help

# 远程图片
ocr http://7pun4e.com1.z0.glb.clouddn.com/test.jpg

# 本地图片
ocr ./test.jpg
```

##### OCR识别输入和输出

![ocr example](examples/ocrdocument.png)

#### 2. Nodejs

```sh
npm install tims-ocr-api --save
```

FYI [examples](https://github.com/yyssc/tims-ocr-api/tree/master/examples)

```js
var host = '127.0.0.1';
var port = '39456';
var ocr = require('tims-ocr-api').create(host, port);
// 本地图片
ocr.upload('/tmp/test.jpg').then(function (result) {
  return console.log(result)
}).catch(function (err) {
  console.log('err', err);
})
```

### Run UnitTest

```sh
make test
make cov # Coverage rate
```

Note: travis-ci.org will run this test https://travis-ci.org/yyssc/tims-ocr-api

### Build API document

```
grunt [jsdoc]
```

### Publish API doc to github project pages

The generated API document is located in `out/` dir.

`.utility/push-jsdoc-to-gh-pages.sh` will called when [travis-ci](https://travis-ci.org/yyssc/tims-ocr-api) finished Unittest, to push `out/` dir to branch `gh-pages` of current repo.

TODO: `out/` should generated automatically.

### Mock server

You could use a mock test for testing.

https://github.com/yyssc/mock-tims-ocr

### test data

- 增值税专用发票 https://drive.google.com/drive/folders/0B_RIK8efdyq-VmZqMUJOaTVtVm8

### ocr_srv API

![OCR server socket API](https://docs.google.com/drawings/d/1opIHK52EyZV57f3TJeik-IxH2VLxLnRfSMvVLGpJtJs/pub?w=960&h=720)

### License MIT

[downloads-image]: http://img.shields.io/npm/dm/tims-ocr-api.svg

[npm-url]: https://npmjs.org/package/tims-ocr-api
[npm-image]: http://img.shields.io/npm/v/tims-ocr-api.svg

[travis-url]: https://travis-ci.org/yyssc/tims-ocr-api
[travis-image]: https://travis-ci.org/yyssc/tims-ocr-api.svg?branch=master

[coveralls-url]: https://coveralls.io/r/yyssc/tims-ocr-api
[coveralls-image]:https://coveralls.io/repos/yyssc/tims-ocr-api/badge.svg?branch=master&service=github
