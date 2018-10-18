/**
 * modify by haijin on 2017/10/15.
 */
const webpack = require('webpack');
const glob = require('glob');
const path = require('path');
const extractTextPlugin = require('extract-text-webpack-plugin');
const commonSass = new extractTextPlugin('assets/css/common.css');
const htmlPlugin = require('html-webpack-plugin');
const buildConf = require('./config');
const vendorConfig = require('../picmaker/dll/vendorConfig.json');
const vendorManifest = require('../picmaker/dll/vendor-manifest.json');
const extractSass = new extractTextPlugin({
    filename: 'assets/css/common-[hash].css',
    disable: process.env.NODE_ENV === "develop"
});
var getEnrty = function() {
    // let entries = {
    //     vendor: ['vue', 'vuex', 'vue-resource','jad']
    // };
    let entries = {};
    glob.sync('./src/views/**/*.js').forEach(function(name) {
        let index = name.lastIndexOf('/');
        let filename = name.slice(index + 1);
        let entryName = filename.slice(0, -3);
        var _entry = ''
        if (entryName.indexOf('_') > 0) {
            _entry = entryName.split('_')[1] + '/' + entryName.split('_')[0]
        } else {
            _entry = entryName
        }
        //let _entry = entryName.split('_')
        entries[_entry] = [name];
    });
    return entries
};
var entries = getEnrty();
var folderAll = {}
    // var chunks = Object.keys(entries).slice(1);
var chunks = Object.keys(entries);
var htmlArr = chunks.map(function(name) {
    let isDot = name.indexOf('/')
    var _name = '';
    var preName = ''
    if (isDot > 0) {
        preName = name.split('/')[0] + "/"
        _name = name.split('/')[1]
    } else {
        _name = name
    }
    return new htmlPlugin({
        template: "src/views/" + preName + _name + "/" + _name + ".html",
        filename: "../picmaker/" + name + ".html",
        inject: true,
        publicCss: buildConf.commonCss(isDot),
        publicHeadJs: buildConf.headjs(isDot),
        publicBotJs: buildConf.botJs(isDot),
        specialJs: buildConf.teJs(isDot),
        editJs: buildConf.editJs(isDot),
        uploadJs: buildConf.upLoadJs(isDot),
        editCss: buildConf.EditCss(isDot),
        vendorJs: (isDot > 0 ? '../' : '') + 'dll/' + vendorConfig.vendor.js,
        chunks: [name],
        tagEnv: JSON.stringify(process.env.NODE_ENV + ''),
        hash: false,
        minify: { //压缩HTML文件
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: false //删除空白符与换行符
        }
    })
});
module.exports = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, '../picmaker/'),
        filename: 'assets/js/[name]_[hash:8].js'
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: path.resolve(__dirname, "../node_modules")
            },
            // {
            //     test: require.resolve('snapsvg/dist/snap.svg.js'),
            //     use: 'imports-loader?this=>window,fix=>module.exports=0',
            // },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: true
                        }
                    }, {
                        loader: "sass-loader"
                    }],
                    fallback: "style-loader"
                })
            },
            {
                test: /\.css/,
                loader: 'style-loader!css-loader',

            },
            {
                test: /\.(woff|eot|svg|ttf|TTF|ttc|dfont)(\?(\w|#)+)?$/,
                loader: 'url-loader?limit=20480&name=[name].[ext]&outputPath=../../../toolpage/font/zh/',
                exclude: [path.resolve(__dirname, "../src/assets/fonts"), path.resolve(__dirname, "../toolpage/font/en")],
            },
            {
                test: /\.(woff|eot|svg|ttf|TTF|ttc|dfont)(\?(\w|#)+)?$/,
                loader: 'url-loader?limit=20480&name=[name].[ext]&outputPath=../../../toolpage/font/en/',
                exclude: [path.resolve(__dirname, "../src/assets/fonts"), path.resolve(__dirname, "../toolpage/font/zh")],
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: 'file-loader?name=[name].[ext]&outputPath=assets/images/&publicPath=../picmaker/',
            },
            {
                test: /\.(woff|eot|svg|ttf)(\?(\w|#)+)?$/,
                loader: 'file-loader?limit=20480&name=[name].[ext]&outputPath=assets/fonts/&publicPath=../picmaker/',
                exclude: path.resolve(__dirname, "../toolpage")
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'jspath': path.resolve(__dirname, '../src/assets/js'),
            // 'snapsvg': 'snapsvg/dist/snap.svg.js',
        },

    },
    plugins: [extractSass,
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     filename: 'assets/js/vendor.[hash:8].js'
        // }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: vendorManifest
        }),
        new webpack.DefinePlugin({
            JSPATH: JSON.stringify(process.env.NODE_ENV !== 'production' ? '../src/assets/js/editor/views' : './assets/js/editor/views')
        })
    ].concat(htmlArr)

};