/**
 * webpack 配置
 * @author shan-er
 */
const merge = require('webpack-merge');
const config = require('./webpack.base');
var webpack = require('webpack');
var path = require('path');
const url = require('url');
var ms = require('mockservice');
var devConfig = merge(config, {
    // entry: {
    //     index: [
    //         'webpack-dev-server/client?http://localhost:8080',
    //         'webpack/hot/only-dev-server',
    //         './src/index'
    //     ]
    // },
    devtool: 'cheap-module-inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, '../'),
        hot: true,
        historyApiFallback: true,
        publicPath: '/picmaker/',
        noInfo: false,
        setup(app){
            //mock数据
            app.use(function(req, res, next) {
                let parseUrl = url.parse(req.url).pathname
                if (!parseUrl.match(/^\/(picmaker|common)/)) { //不是kuaiche开头的数据，直接next
                    next();
                    return;
                }
                
                var pathname = parseUrl.replace(/\//g, '_');
                
                if(pathname == '_picmaker_'){
                    next();
                    return;
                }
                pathname = '../mock/' + pathname.replace('_', '');
                var mockDataFile = path.join(__dirname, pathname) + ".js";
                if(parseUrl.indexOf('.')<0){
                    var reqUrl = req.url;
                    req.query.path = reqUrl.slice(1);
                    req.url = '/request.ajax?path=' + reqUrl.slice(1);
                    ms.config({
                        name: 'jzt',
                        dir: './mock'
                    });
                    req.body = req.bodyBuffer;
                    ms.serve(req, res);
                }else{

                   next();
            
                }
                
            })
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('develop')
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ]

});
module.exports = devConfig;