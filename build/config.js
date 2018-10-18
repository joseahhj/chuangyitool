/**
 * modify by haijin on 2018/5/14.
 */
var fs = require('fs');
var path = require('path');
var cssPrefixPath = process.env.NODE_ENV!='production'?'/src/assets/scss' : 'assets/css';
var jsPrefixPath = process.env.NODE_ENV!='production'?'/src/common2.0/js' : 'assets/js';
var jsBotPrefixPath = process.env.NODE_ENV!='production'?'/src/assets/js' : 'assets/js';
var hostPath = process.env.NODE_ENV=='production'?'' : '//mmjzt.jd.com';


module.exports = {
    "headjs":function(isDot){
        var rendDot = process.env.NODE_ENV=='production'&&isDot>0?'../':''
        return [
           "<script type='text/javascript' src='"+hostPath+"/public/js/head-new.js'></script>",
            "<script type='text/javascript' src='"+jsBotPrefixPath+"/lib/jquery/jquery1.11.min.js'></script>",
        ].join('')
    },
    
    "botJs":function(isDot){
        var rendDot = process.env.NODE_ENV=='production'&&isDot>0?'../':''
        return [
            "<script type='text/javascript' src='//wl.jd.com/wl.js'></script>",
            "<script type='text/javascript' src='"+rendDot+jsBotPrefixPath+"/pvCount.js'></script>",
        ].join('')
    },
    "editJs":function(isDot){
        var rendDot = process.env.NODE_ENV=='production'&&isDot>0?'../':''
        return [
             "<script type='text/javascript' src='"+rendDot+jsBotPrefixPath+"/editor/require.js' id=requireId></script>",
             "<script type='text/javascript' src='"+rendDot+jsBotPrefixPath+"/editor/sylvester.src.js'></script>",
             "<script type='text/javascript' src='"+rendDot+jsBotPrefixPath+"/editor/jscolor.min.js'></script>",
             
        ].join('')
    },
    "upLoadJs":function(isDot){
        var rendDot = process.env.NODE_ENV=='production'&&isDot>0?'../':''
        return [
             "<script type='text/javascript' src='"+rendDot+jsBotPrefixPath+"/editor/ajaxfileupload.js'></script>"
        ].join('')
    },
    "teJs":function(isDot){
        var rendDot = process.env.NODE_ENV=='production'&&isDot>0?'../':''
        return [
             "<script type='text/javascript' src='"+rendDot+jsBotPrefixPath+"/lib/silderScroll.js'></script>",
        ].join('')
    },
    "commonCss":function(isDot){
        var rendDot = process.env.NODE_ENV=='production'&&isDot>0?'../':''
        return [
            "",
        ].join('')
    },
    
    "EditCss":function(isDot){
        var rendDot = process.env.NODE_ENV=='production'&&isDot>0?'../':''
        return [
            "<link rel='stylesheet' href='"+rendDot+cssPrefixPath+"/fonttemplate.css'>",
        ].join('')
    },
    // "jaq":"<script type='text/javascript'>"+ fs.readFileSync(path.resolve(__dirname,'../src/utils/jaq.js'),'utf-8')+"</script>"
};