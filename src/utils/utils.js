/**
 * Modify by haijin on 2017/9/20.
 */
    function getQuery(queryName){
        let queryStr = window.location.search.slice(1);
        let queryArr = queryStr.split('&');
        for (let i = 0; i < queryArr.length; i++) {
            let thisArr = queryArr[i].split('=');
            if (thisArr[0] == queryName) {
                return thisArr[1];
            }
        }
    }
    export { getQuery };
    
    function getQuerys(){
        let queryStr = window.location.search.slice(1);
        let queryArr = queryStr.split('&');
        let query = {};
        for (let i = 0, len = queryArr.length; i < len; i++) {
            let queryItem = queryArr[i].split('=');
            query[queryItem[0]] = queryItem[1];
        }
        return query;
    }
export { getQuerys };
function isEmptyObject(e){  //判断{}是否为空
        var t;  
        for (t in e) {return !1;  }
        return !0  
}
export { isEmptyObject };
function typeOf(obj) {
    const toString = Object.prototype.toString;
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    return map[toString.call(obj)];
}
// deepCopy
function deepCopy(data) {
    const t = typeOf(data);
    let o;
    if (t === 'array') {
        o = [];
    } else if (t === 'object') {
        o = {};
    } else {
        return data;
    }
    if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
            o.push(deepCopy(data[i]));
        }
    } else if (t === 'object') {
        for (let i in data) {
            o[i] = deepCopy(data[i]);
        }
    }
    return o;
}
export { deepCopy };

function getCookie(cookieName) {
  var strCookie = document.cookie;
  var arrCookie = strCookie.split("; ");
  for (var i = 0; i < arrCookie.length; i++) {
    var arr = arrCookie[i].split("=");
    if(cookieName == arr[0]){
      arr.shift();
      return decodeURIComponent(arr.join('='));
    }
  }
  return "";
}
export { getCookie };
function delCookie(name) {  //删除cookie
    var exp = new Date();  
    exp.setTime(exp.getTime() - 100);  
    var cval=getCookie(name);  
    if(cval!=null){
        document.cookie= name + "="+cval+";expires="+exp.toUTCString();  
    } 
} 
export { delCookie };

function add0(m){return m<10?'0'+m:m }
function formatTime(time){    
    var time = new Date(time);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}
export { formatTime };
