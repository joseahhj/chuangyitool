require.config({
	baseUrl: curEnv=='production'?'./assets/js/editor/':'../../../src/assets/js/editor/',
	shim: {
	    'jquery': {
	        exports: '$',
	    },
	    'jquery-ui': {
	        exports: '$',
	        deps: ['jquery'],
	    },
		'file_upload':['jquery']

	},
	paths: {   
		/* libraries */
		'jquery': 'jquery-2.1.1',
		'backbone': 'backbone',
		'underscore': 'underscore1.6.0.min',
	    'snap.svg': 'snap.svg',
	    'text':'text',
	    'sylvester':'sylvester.src',
	    'views'    :'./views',
	    'file_upload': 'ajaxfileupload',
	    'jquery-ui':'jquery-ui-1.11.2'
	}
});


require(['jquery', 'underscore', 'backbone','data/ExternalDataLoader', 
	'data/CanvasXmlV3Parser', 'domain/editor', 'domain/portfolio', 
	'domain/creativework', 'domain/graphics/canvas', 'domain/graphics/layerfactory', 'views/EditorPageWire','widgets/customwidgets'],
	function($, _, Backbone,  ExternalDataLoader, 
		CanvasXmlV3Parser, Editor, Portfolio, CreativeWork, Canvas, LayerFactory, EditorFrame){
		
		//格式化尺寸
		var parseCreativeSize = function(size) {
			var pattern = /^(\d+)[x\*X](\d+)$/;
		    var matcher = (typeof size === 'string') && size.match(pattern);
			    if (!matcher) {
			      return null;
			    }
			    return {
			      width: parseInt(matcher[1]),
			      height: parseInt(matcher[2])
			    };
		};
	    //获取url参数值
		var getQueryString = function(name) {
		    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		    var r = window.location.search.substr(1).match(reg);
		    if (r != null) {
		        return unescape(r[2]);
		    }
		    return null;
		};
		
		//用户选择的尺寸
		var tpIds = sessionStorage.getItem('tpIds')
		
		//用户选择的尺寸
		var sizeNum = '';
		if(tpIds){
			sizeList = tpIds.split(',')
		}else{
			sizeList = [];
		}
		var localHref = window.location.href;
		//localHref = localHref.substring(0,localHref.indexOf('#'));               
		//获取模板数据
	    $.ajax({
			url:'/picmaker/template/getTempDetail',		
			type:'POST',
			dataType:'json',
			contentType: "application/json; charset=utf-8",
			data:JSON.stringify({
				"templateId":getQueryString('tid'),
				"sizeIdList": sizeList
				})
		}).done(function(data){	
				if(data.code ==1){		
			   		var newData = data.content;
			   		var dlist = newData.templateSizeList;
			   		var token = dlist[0].size;	
			   		//window.location.href = localHref + '#edit?creative='+token;	
			   		if(newData.uid !='_root'){		   			
			   			$('.save-input').val(newData.name)
			   		}			   		
			   		portfolio = new Portfolio({
				        id:newData.id,
				        industry: newData.industry,
			            label: newData.label,
			            name: newData.name,
			            picUrl: newData.picUrl,		            
			            templateSizeList: null,
			            score: newData.score,
			            sourceId: newData.sourceId,
			            createTime:newData.createTime,
			            modifyTime:newData.modifyTime,
			            yn: newData.yn,
			            uid: newData.uid,
			            use:newData.use,
			            templateType: newData.templateType,
			            
			        });
			        run(portfolio, dlist, token);
		        }else if(data.code==-100){//未登录
					var oldHref = window.location.href;
					window.location.href = '//passport.jd.com/new/login.aspx?ReturnUrl='+oldHref;					
				}else if(data.code==-300){//没有权限
					var oldHost = window.location.host;
					window.location.href = oldHost+'/toolpage/static/notWhite.html';					
				} 		        
		});
				
		//处理模板数据
		function run(portfolio, dataList, token){		
			
			$('.container').show();
			//以下是数据svg的操作
			var creativeWorks = _(dataList).map(function(creativeSpec){				
		        var json = _(creativeSpec).clone();		        
	        	var size = creativeSpec.size.split('*');
	            _(json).extend({
	                id: creativeSpec.id,
	                size: creativeSpec.size,	                
	                svgInfo: creativeSpec.svgInfo,
	                picUrl: creativeSpec.picUrl,
	                templateId: creativeSpec.templateId,
	                yn: creativeSpec.yn,
	                disabled: !creativeSpec.yn,
	            });	                   
		        return new CreativeWork(json);
		    }); 

	    	portfolio.get('templateSizeList').reset(creativeWorks);

			var AppRouter = Backbone.Router.extend({
				initialize: function() {
		          this.editor_ = new Editor({portfolio: portfolio});
		          this.frame_ = new EditorFrame({model: this.editor_, el: 'body'});	
		          this.edit(token)  
		          this.renderList();		         	
		        },
		      	routes: {
			      //'edit?creative=:token': 'edit',
			      '*hash': 'reset',
			    },			    
			    edit: function(token) {
			       var sizeAll = token.indexOf('*')>-1?token.split('*'):token.split('×');
			      var size = sizeAll[0]+'*'+sizeAll[1];
			      
			      if (!size) {
			          this.reset();
			      }
			      var portfolio = this.editor_.get('portfolio'),
			          creativeWork = 
			              portfolio && portfolio
			                  .findCreativeWork({size:size});
			      if (!!creativeWork) {
			          this.editor_.switchCreativeWork(creativeWork);
			      } else {
			               this.reset();
			      }	
			    },
			    reset: function() {
			        var current = this.editor_.get('creativeWork');
			        if (!current) { 
			            this.editor_.switchCreativeWork(null);
			            current = this.editor_.get('creativeWork');
			        }
			        var size = current.get('size');
			       
			        this.navigate('#creative=' + size, {replace: true, trigger: true});
			    },
				renderList: function(){
					var _this = this;
					var scrollLi = _.template($("#templateSize").text())({'list':dataList});
					$('.sizeBox').append(scrollLi);
					$('.sizeBox').on('click','li',function(){
						var token = $.trim($(this).text())
						_this.edit(token)  
						$(this).addClass('sizeOn').siblings().removeClass('sizeOn')
					})							
				}
			});

			_(creativeWorks).forEach(function(creativeWork) {

		      var width = creativeWork.get('width'),
		            height = creativeWork.get('height'),
		            fileUrl = creativeWork.get('svgInfo');

		      var setupCanvas_ = function(canvasData, creativeWork) {

		          creativeWork.set('modifyTime', _.now());
		          
		         
		          var canvas = new Canvas(_(canvasData).omit('layerList', 'svgNode'), {svgNode: canvasData.svgNode}),
		                layerList =_(canvasData.layerList).map(function(layerJson) {
		                    return LayerFactory.create(layerJson.type, _(layerJson).omit('svgNode'), {svgNode: layerJson.svgNode});
		                });
		            $('.offstage').html(canvas.svgAccessor().node);		          
		            canvas.reset(layerList);
		            canvas.syncToSvg(true);
		            $('.offstage').empty();
		            creativeWork.set('canvas', canvas);		            
		            // if (FILE_VERSION !== EDITOR_VERSION) {
		            //     creativeWork.set('lastSavedTime', NaN);
		            // }
		      };
		      
		      var initialData = {
		            width: width,
		            height: height,
		            viewBox: {
		                x: 0,
		                y: 0,
		                width: width,
		                height: height,
		            },
		            layerList: [{type:'Background',groudId:'background'}],
		        };
		      
		      var onCanvasResolved_ = function(canvasJson) {
		          setupCanvas_(canvasJson, creativeWork);
		      };
		      
		      var onCanvasRejected_ = function(errorMessage) {
		          console.error(errorMessage);
		          setupCanvas_(initialData, creativeWork);
		      };
		      
		        if (fileUrl) {
		            // var fileUrlMatcher = fileUrl.match(/(.+\/+)[^\/]*_(\d+)X(\d+)\.svg\.xml/),
		            //     svgUrl = (fileUrlMatcher && fileUrlMatcher[1] + fileUrlMatcher[2] + 'x' + fileUrlMatcher[3] + '.svg');                
		            // //ExternalDataLoader.load(data.content.templateSizeList[0].svgInfo, CanvasXmlV3Parser);					
							
		            ExternalDataLoader.load(fileUrl, CanvasXmlV3Parser)
		                .done(onCanvasResolved_)
		                // .fail(function(errorMessage) {
		                //     console.warn(errorMessage);
		                //     ExternalDataLoader.load(fileUrl, CanvasXmlParsers[FILE_VERSION])
		                //         .done(onCanvasResolved_)
		                //         .fail(onCanvasRejected_);
		                // });
		        } else {
		            setupCanvas_(initialData, creativeWork);
		        }
		    });
			
			var new_router = new AppRouter();
			//Backbone.history.start();
		};
})

