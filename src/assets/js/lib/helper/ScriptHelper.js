/* ==================== ScriptHelper 开始 ==================== */
/* scriptHelper 脚本帮助对象.
   创建人: ziqiu.zhang  2008.3.5
   添加函数: 
   getScroll():得到鼠标滚过的距离-兼容XHTML
   getClient():得到浏览器当前显示区域的大小-兼容XHTML
   showDivCommon():显示图层.
   
   使用举例:
    <div id="testDiv" style="display:none; position:absolute; border:1px #000000;">我是测试图层我是测试图层</div>
    <div style="width:400px; text-align:center;"><div><a href="#" onclick="ScriptHelper.showDivCommon(this,'testDiv', 20, 70)">事件源</a></div></div>

 */

function scriptHelper()
{
}


//  得到鼠标滚过的距离 scrollTop 与 scrollLeft  
/*  用法与测试:
    var myScroll = getScroll();
    alert("myScroll.scrollTop:" + myScroll.scrollTop);
    alert("myScroll.scrollLeft:" + myScroll.scrollLeft);
*/
scriptHelper.prototype.getScroll = function () 
{     
        var scrollTop = 0, scrollLeft = 0;
        
        scrollTop = (document.body.scrollTop > document.documentElement.scrollTop)? document.body.scrollTop:document.documentElement.scrollTop;
        if( isNaN(scrollTop) || scrollTop <0 ){ scrollTop = 0 ;}
        
        scrollLeft = (document.body.scrollLeft > document.documentElement.scrollLeft )? document.body.scrollLeft:document.documentElement.scrollLeft;
        if( isNaN(scrollLeft) || scrollLeft <0 ){ scrollLeft = 0 ;}
        
        return { scrollTop:scrollTop, scrollLeft: scrollLeft}; 
}

//  得到浏览器当前显示区域的大小 clientHeight 与 clientWidth
/*  用法与测试:
    var myScroll = getScroll();    
    alert("myScroll.sTop:" + myScroll.sTop);
    alert("myScroll.sLeft:" + myScroll.sLeft);
*/
scriptHelper.prototype.getClient = function ()
{
    //判断页面是否符合XHTML标准
    var isXhtml = true;
    if( document.documentElement == null || document.documentElement.clientHeight <= 0)
    {
        if( document.body.clientHeight>0 )
        {
            isXhtml = false;
        }
    }
        
    this.clientHeight = isXhtml?document.documentElement.clientHeight:document.body.clientHeight;
    this.clientWidth  = isXhtml?document.documentElement.clientWidth:document.body.clientWidth;            
    return {clientHeight:this.clientHeight,clientWidth:this.clientWidth};        
}


//  显示图层,再次调用则隐藏
/*  参数说明:
    sObj        : 要弹出图层的源对象
    divObj       : 要显示的图层对象
    sObjHeight  : 事件源的高度,默认为20.需要手工传入是因为对于由于事件源对象可能是各种HTML元素,有些元素高度的计算无法跨浏览器通用.
    moveLeft    : 手工向左移动的距离.不移动则为0(默认).
    divObjHeight: 弹出层的高度.如果传入大于0的此参数, 则当事件源下方空间不足时,在事件源上方弹出层.如果不传此参数则一直在事件源下方弹出.
    
    用法与测试:
    <div><a href="#" onclick="ScriptHelper.showDivCommon(this,'testDiv', 20, 20)">事件源</a></div>  
*/
scriptHelper.prototype.showDivCommon = function (sObj,divObj, sObjHeight, moveLeft, divObjHeight)
{
    //取消冒泡事件
    if( typeof(window)!='undefined' && window != null &&  window.event != null )
    {
        window.event.cancelBubble = true;
    }
    else if( ScriptHelper.showDivCommon.caller.arguments[0] != null )
    {
        ScriptHelper.showDivCommon.caller.arguments[0].cancelBubble = true;
    }    
    

    
    //参数检测.如果没有传入参数则设置默认值
    if( moveLeft == null )
    {
        moveLeft = 0;        
    }
    if( sObjHeight == null )
    {
        sObjHeight = 20;
    }
    if(divObjHeight == null)
    {
        divObjHeight = 0;
    }
    
    var sObjOffsetTop = 0;      //事件源的垂直距离
    var sObjOffsetLeft = 0;     //事件源的水平距离
    var myClient = this.getClient();
    var myScroll = this.getScroll();
    var sWidth = $(sObj).width();    //事件源对象的宽度
    var sHeight = sObjHeight;    //事件源对象的高度
    var bottomSpace;            //距离底部的距离
    
    /* 获取事件源控件的高度和宽度.*/            
    if( sWidth == null )
    {
        sWidth = 100;//无法获取则为100
    }
    else
    {
        sWidth = sWidth + 1; //留出1px的距离            
    }    
        
    
    if( divObj.style.display.toLowerCase() != "none" )
    {
        //隐藏图层
        divObj.style.display = "none";    
    }
    else
    {
        if( sObj == null )
        {
            alert("事件源对象为null");
            return false;
        }
            
        /* 获取事件源对象的偏移量 */
        sObjOffsetTop = $(sObj).offset().top;
        sObjOffsetLeft = $(sObj).offset().left;
//        var tempObj = sObj; //用于计算事件源坐标的临时对象
//        while( tempObj && tempObj.tagName.toUpperCase() != "BODY" )
//        {
//            sObjOffsetTop += tempObj.offsetTop;
//            sObjOffsetLeft += tempObj.offsetLeft;
//            tempObj = tempObj.offsetParent();                            
//        }
//        tempObj = null;            

        
        /* 获取距离底部的距离 */
        bottomSpace = parseInt(myClient.clientHeight) - ( parseInt(sObjOffsetTop) - parseInt(myScroll.scrollTop)) - parseInt(sHeight);    
        
        /* 设置图层显示位置 */
        //如果事件源下方空间不足且上方控件足够容纳弹出层,则在上方显示.否则在下方显示
        if( divObjHeight>0 && bottomSpace < divObjHeight && sObjOffsetTop >divObjHeight )
        {
            divObj.style.top =     ( parseInt( sObjOffsetTop ) - parseInt( divObjHeight ) - 10).toString() + "px";
        }
        else
        {
            divObj.style.top =     ( parseInt( sObjOffsetTop ) + parseInt( sHeight ) ).toString() + "px";
            
        }        
        
        //事件源右方展开，若空间不足，则左移
        if(parseInt( sObjOffsetLeft ) - parseInt( moveLeft ) + $(divObj).width() > document.body.clientWidth - 25) {
        	divObj.style.left = ( document.body.clientWidth - $(divObj).width() - 25 ).toString() + "px";
        }
        else {
        	divObj.style.left = ( parseInt( sObjOffsetLeft ) - parseInt( moveLeft ) ).toString() + "px"; 
        }
               
        divObj.style.display="block";
    }    
}



//  关闭图层
/*  参数说明:
    divObj        : 要隐藏的图层对象    
    
    用法与测试:
    ScriptHelper.closeDivCommon(testDiv);    
*/
scriptHelper.prototype.closeDivCommon = function (divObj)
{

    if( divObj != null )    
    {
        divObj.style.display = "none";    
    }    
}

//建立scriptHelper类的一个实例对象.全局使用.
var ScriptHelper = new scriptHelper();

/* ==================== ScriptHelper 结束 ==================== */    