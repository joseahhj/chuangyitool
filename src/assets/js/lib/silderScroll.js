//var $ = $.noConflict();
//ban_qh
$.fn.banqh = function(can){
	can = $.extend({
					box:null,//总框架
					pic:null,//大图框架
					pnum:null,//小图框架
					prev_btn:null,//小图左箭头
					next_btn:null,//小图右箭头
					prev:null,//大图左箭头
					next:null,//大图右箭头
					pop_prev:null,//弹出框左箭头
					pop_next:null,//弹出框右箭头
					autoplay:false,//是否自动播放
					interTime:5000,//图片自动切换间隔
					delayTime:800,//切换一张图片时间
					pop_delayTime:800,//弹出框切换一张图片时间
					order:0,//当前显示的图片（从0开始）
					picdire:true,//大图滚动方向（true水平方向滚动）
					mindire:true,//小图滚动方向（true水平方向滚动）
					min_picnum:null,//小图显示数量
					pop_up:false,//大图是否有弹出框
					pop_div:null,//弹出框框架
					pop_pic:null,//弹出框图片框架
					pop_xx:null,//关闭弹出框按钮
					mhc:null//朦灰层
				}, can || {});
	
	
	var picminnum = $(can.pnum).find('ul li').length;
	
	var picminw = $(can.pnum).find('ul li').outerWidth(true);
	var picminh = $(can.pnum).find('ul li').outerHeight(true);
	var pictime;
	var tpqhnum=0;
	var xtqhnum=0;		
	$(can.pnum).find('ul').width(picminnum*picminw).height(picminnum*picminh);
	$(can.pnum).find('li').eq(0).addClass("spec-on").siblings(this).removeClass("spec-on");
	var showBigPic = function(id,size,url){	
		    $(can.pic).find('.yl-pic>img').attr('src',url);	
		    $(can.pic).find('.yl-size').text(size);
		    $(can.pic).find('.make-size').attr('data-id',id)
	}	
	//点击小图切换大图
	$(can.pnum).find('li').click(function () {
        tpqhnum = xtqhnum = $(can.pnum).find('li').index(this);
        //show(tpqhnum);
		minshow(xtqhnum);
    }).eq(can.order).trigger("click");
	//小图左右切换			
	$(can.prev_btn).click(function(){		
		if(xtqhnum==0){xtqhnum=picminnum};
		xtqhnum--;		
		minshow(xtqhnum);	
	})
	$(can.next_btn).click(function(){		
		if(xtqhnum==picminnum-1){xtqhnum=-1};
		xtqhnum++;
		minshow(xtqhnum)		
	})	
		
	//小图切换过程
	function minshow(xtqhnum){
		var mingdjl_num =xtqhnum-can.min_picnum+2.5;
		var mingdjl_w=-mingdjl_num*picminw;
		var mingdjl_h=-mingdjl_num*picminh;
		if(can.mindire==true){
			if(xtqhnum==picminnum-1){mingdjl_w=-(mingdjl_num-1)*picminw;}
			if(xtqhnum<2){mingdjl_w=0;}	
			$(can.pnum).find('ul').stop().animate({'left':mingdjl_w},can.delayTime);
			$(can.pnum).find('li').eq(xtqhnum).addClass("spec-on").siblings(this).removeClass("spec-on");
			var id = $(can.pnum).find('li').eq(xtqhnum).data('id');
			var size = $(can.pnum).find('li').eq(xtqhnum).data('size');
			var url = $(can.pnum).find('li').eq(xtqhnum).data('src');
			showBigPic(id,size,url)
		}
	}
}
