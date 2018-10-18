/**
 * Created by yangbing on 2017/11/7.
 * modify by huanghaijin on 2018/2/11.
 */
const merge = require('webpack-merge');
const baseConf = require('./webpack.base');
var webpack = require('webpack');
var path = require('path');
//var Mock = require('mockjs');
//var mockData = require('../src/common/mockData');
//const url = require('url');


var devConfig = merge(baseConf, {
    devtool: '#cheap-module-eval-source-map',
    // module:{
    //     rules:[
    //         {
    //             test: /\.(js|vue)$/,
    //             loader: 'eslint-loader',
    //             enforce: "pre",
    //             exclude: path.resolve(__dirname, "../node_modules")
    //         },
    //
    //     ]
    // },
    devServer: {
        contentBase: path.resolve(__dirname, '../'),
        hot: true,
        historyApiFallback: true,
        publicPath: '/picmaker/',
        noInfo: false,
        disableHostCheck: true,
        proxy: [{
            context: ['!/picmaker/(dll|assets)/**', '!/picmaker/index.html', '/picmaker/**'],
            target: 'http://jzt.jd.com',
            changeOrigin: true
        }, {
            context: ['/common/**'],
            target: 'http://jzt.jd.com',
            changeOrigin: true
        }, ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"debug"'
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ]

});

module.exports = devConfig;