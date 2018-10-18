/**
 * Modify by haijin on 2017/11/13.
 */
import Vue from 'vue'
import VueResource from 'vue-resource'
import qs from 'qs'
Vue.use(VueResource);
//拦截器
Vue.http.interceptors.push((request,next)=>{
    // let _flag = false;
    // if(request.body.interceptorFlag){
    //     _flag = true;
    //     delete request.body.interceptorFlag;
    // }
    // request.body.requestFrom  = 0;
    next((res)=>{
        let getProtocol = 'https' == document.location.protocol ? 'https://' : 'http://';
        let oldHref = window.location.href;
        let oldHost = window.location.host;
        if(res.body.code==1){
            return res;
        }else if(res.body.code==-100){//未登录
            window.location.href = 'http://passport.jd.com/new/login.aspx?ReturnUrl='+oldHref;
        }else if(res.body.code==-200){//非京挑客用户错误码没有权限
            window.location.href = getProtocol + oldHost+'/static/notpop.html';
        }else if(res.body.code==-300){//异常错误码
            window.location.href = getProtocol + oldHost+'/static/error.html';
        }else if(res.body.code==-400){//维护升级错误码
            window.location.href = getProtocol + oldHost+'/static/standUp.html';
        }else if(res.body.code==-500){//账户类型错误码
            window.location.href = getProtocol + oldHost+'/static/typeError.html';
        }else if(res.body.code==-600){//虚拟登录错误码
            window.location.href = getProtocol + oldHost+'/static/vitualerror.html';
        } else if(res.body.code==-700){//账户冻结错误码
            window.location.href = getProtocol + oldHost+'/static/freeze.html';
        }  else if(res.body.code==-800){//虚拟商家错误码
            window.location.href = getProtocol + oldHost+'/static/cod.html';
        } else {
            return res;
        }
    })
});


export default {
    post(url,params){
        let _params = params || {};
        //_params.requestFrom=0
        //let _url  = process.env.NODE_ENV=='develop' ? url : url+'?requestFrom=0';
        return Vue.http.post(url,_params)
    },
    postOne(url,params){
        
        let _params = params || {};
        let options = {
            url: url,
            method:'POST',
            body: qs.stringify(_params, { indices: false }),
            headers: {
                'Content-Type':'application/x-www-form-urlencoded'
            }
        };
        return Vue.http(options)
    
    },
    get(url,params){
        let _params = params || {};
        return Vue.http.get(url,_params)
    }
}