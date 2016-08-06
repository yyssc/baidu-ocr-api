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

##### 效果图



![](https://raw.githubusercontent.com/yyssc/tims-ocr-api/master/examples/test01.jpg)



   的早期世界观是建立在《魔兽争霸3：冰封王座》的基础上的，因此与现在暴雪公司的《魔兽世界》的背景设定有一定的联系，但由于版本更迭又略有不同。整个地图中地形名费伍德森林，费伍德森林是网络游戏《魔兽世界》中的游戏地图，位于卡利姆多境内的一片森林。这片由森林和草场构成的繁荣动荡的土地曾经由卡尔多雷掌管，并曾经处于半神塞纳留斯的保护下。燃烧军团的铁蹄践踏了这片土地，没有被毁灭的树木和生物则被恶魔的暴行永远的诅咒着


#### 2. Nodejs

```sh
npm install tims-ocr-api --save
```

FYI [examples](https://github.com/yyssc/tims-ocr-api/tree/master/examples)

```js
/**

向[北京天创征腾信息科技](http://www.tchzt.com/)申请secret key
**/
var ak = 'your ak';
var sk = 'your sk';
var ip = '';
var port = '';
var secretKey = '1234567890';
var ocr = require('tims-ocr-api').create(ip, port, secretKey, ak, sk);
// 外部图片
ocr.upload({
  url:'http://7pun4e.com1.z0.glb.clouddn.com/test.jpg', // 支持本地路径
  type:'text',
}).then(function (result) {
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
