/**
 * webpack 配置
 * @author shan-er
 */
const merge = require('webpack-merge');
const config = require('./webpack.base');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const commonSass = new extractTextPlugin('assets/css/common.css');
const htmlPlugin = require('html-webpack-plugin');
const buildConf = require('./config');
const vendorConfig = require('../picmaker/dll/vendorConfig.json');
const vendorManifest = require('../picmaker/dll/vendor-manifest.json');
const extractSass = new extractTextPlugin({
    filename: 'assets/css/common-[hash].css',
    
});
var prodConf = merge(config, {
    devtool: '#nosources-source-map',
    // output: {
    //     filename: '[name].[chunkhash:8].bundle.js',
    //     chunkFilename: '[name].[chunkhash:8].js',
    //     path: path.resolve(__dirname, '../picmaker/'),
    //     publicPath: './js/'
    // },
    
    plugins: [
        
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new CleanWebpackPlugin(['picmaker'], {
            root: path.resolve(__dirname, '../'),
            verbose: true,
            dry: false,
            exclude: ['dll']
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname,'../src/assets/js/lib/'),
            to: path.resolve(__dirname,'../picmaker/assets/js/lib'),
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname,'../src/assets/js/editor/'),
            to: path.resolve(__dirname,'../picmaker/assets/js/editor'),
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname,'../src/assets/scss/fonttemplate.css'),
            to: path.resolve(__dirname,'../picmaker/assets/css/fonttemplate.css'),
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname,'../src/assets/js/pvCount.js'),
            to: path.resolve(__dirname,'../picmaker/assets/js/pvCount.js'),
        }]),
    ]
});
prodConf.module.rules[6].use='file-loader?name=[name].[ext]&outputPath=assets/images/&publicPath=../../';
prodConf.module.rules[7].loader='file-loader?limit=20480&name=[name].[ext]&outputPath=assets/fonts/&publicPath=../../';
module.exports = prodConf;