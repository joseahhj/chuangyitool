/**
 * webpack 配置
 * @author shan-er
 */
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry:{
        vendor: ['vue', 'vue-resource','jad']
    },
    output: {
        path:path.resolve(__dirname,'../picmaker/dll'),
        filename: "[name].[hash].js",
        library:"[name]_[hash]"
    },
    resolve:{
        alias: {
            'vue$':'vue/dist/vue.common.js'
        }
    },
    plugins: [
        new CleanWebpackPlugin(['picmaker/dll'],{
            root: path.resolve(__dirname,'../'),
            verbose: true,
            dry: false
        }),
        new AssetsPlugin({
            filename:'vendorConfig.json',
            path:path.resolve(__dirname,'../picmaker/dll')
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings: false
            }
        }),
        new webpack.DllPlugin({
            context: __dirname,
            path:path.join(__dirname,'../picmaker/dll','[name]-manifest.json'),
            name:'[name]_[hash]'
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname ,'../src/assets/common2.0/img/'),
            to: path.resolve(__dirname, '../src/assets/img'),
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname ,'../src/assets/common2.0/fonts/'),
            to: path.resolve(__dirname, '../src/assets/fonts'),
        }]),
        // new CopyWebpackPlugin([{
        //     from: path.resolve(__dirname,'../src/assets/js/lib/'),
        //     to: path.resolve(__dirname,'../picmaker/assets/js/lib'),
        // }]),
        // new CopyWebpackPlugin([{
        //     from: path.resolve(__dirname,'../src/assets/js/editor/'),
        //     to: path.resolve(__dirname,'../picmaker/assets/js/editor'),
        // }]),
        // new CopyWebpackPlugin([{
        //     from: path.resolve(__dirname,'../src/assets/js/pvCount.js'),
        //     to: path.resolve(__dirname,'../picmaker/assets/pvCount.js'),
        // }]),
    ]
}

