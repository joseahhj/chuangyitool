# 创意工具

整体降低图片广告制作与投放门槛，提高现有广告主广告投放效率，提高潜在广告主广告投放积极性，使图片广告更加规范、美观，进而提高平台收益与用户体验。

#### 功能概述

- 创意制作：广告主只需提供已有的商品图等图片及文案内容，即可选用多种风格，多种尺寸的模板进行创意图片编辑合成；

- 创意使用：广告主可将已编辑的创意模板保存至自己的创意库，以便后续继续使用；也可将已合成的创意图片保存至自己的创意库并下载，以便在产品线中上传使用。



## 入门

### 先决条件
* node 环境

### 开发前准备
先下载公共资源项目：
````
git clone git@git.jd.com:ads-fe/jztFeSeparation.git
````
新建projects文件，将本项目放入projects文件夹。
进入本项目，在src文件夹下新建common2.0的软连接

### 安装与运行

克隆项目到本地
````
git clone git@git.jd.com:ads-fe/fe-picmaker.git
````
克隆后端上线库 
```
 git clone http://source.jd.com/app/ads.business.union.original_tool.git
```
文件夹 ads.business.union.original_tool/original_tool-web/src/main/webapp/toolpage/font拷一份到本地跟src 同级toolpage/font

安装相关依赖
````
npm i
````
启动之前，需要先打包第三方文件库，即生成dll文件夹

```
npm run dll
```
运行
````
npm run dev

````
运行链接
[localhost:8081/picmaker/template.html]

联调
````
npm run debug

````

## 运行测试用例

测试用例执行命令

暂无


## 部署

打包测试
````
npm run build

````


## 构建

* [backbone](http://backbonejs.org/) - 依赖库
* [underscore](http://www.css88.com/doc/underscore/) - 依赖库
* [jquery](http://jquery.com/) - 依赖库
* [snap.svg](http://snapsvg.io/docs/) - 依赖库
* [snap.svg 中文](http://www.zhangxinxu.com/GitHub/demo-Snap.svg/demo/basic/) - 依赖库
* [Vue](https://cn.vuejs.org/) - 依赖库
* [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server) - 服务



## 开发者

* 黄海金 - <huanghaijin@jd.com>


## 许可证

MIT

## 致谢

* 感谢







