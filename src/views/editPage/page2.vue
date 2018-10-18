<template>
	<div class="mainPage">
        <nav-bar :bread-crumb="breadCrumb"></nav-bar>
        <side-bar ref="barList" active-key="tp"></side-bar>
		<div  class="container" style="display:none">
			<div class="sizeBox">
			    <script id="templateSize" type="text/plain">
			      <ul class="list-size clearfix">
			        <%_.each(list,function(item,index){%>
			          <%var itSize = item.size.split('*')%>
			          <%if(index==0){%>
			            <li class="sizeOn">
			              <a><%= itSize[0]+'×'+itSize[1]%></a>
									</li>
			          <%}else{%>
			            <li>
			              <a><%= itSize[0]+'×'+itSize[1]%></a>
			            </li>
			          <%}%>
			        <%})%>
			      </ul>
			    </script>
			</div>
			<div class="editeMain">
				<div class="chooseBox" id="saveDrop">
					<ul class="edit-upDate"  id="editDrop">
						<li class="editName">
							<p for="" class="ipt-tit fw1">创意任务名称</p>        
							<input type="text" class="save-input" placeholder="30字符以内，不能为空" maxlength="30"/>
						</li>
						<li v-if="!isWireApp">
							<div id="setBox1" style="display: none;">
								<script id="TextBoxBatchSetting" type="text/html">
									<span class="set-dl">
										<input type="text" class="set-input" value=""/>
									</span>
								</script>
								<script  id="PictureBatchSetting" type="text/html">
									<dd>
										<div class="handlePic">
											<input type="text" class="ipt-normal ipt-sku" placeholder="请输入属于该PIN的一个有效的SKU ID获取商品图" maxlength="30"/>
											<span class="btn-gray btnblock" id="skuSubmit">确定</span>
											<span class="mlr20">或</span>
											<span class="btn-fileN btnNewWid" id="fileLocal2">
												<a href="#" class="btn-gray btnblock">上传图片</a>
												<input type="file" class="hide-file" id="fileLoad" name="fileLoad"/>
											</span>
											<span class="ired-color">＊上传的图片在200K以内</span>
										</div>
										<p class="err-color pt5" id="skuTip"></p>
									</dd>
								</script>
								<script id="SelectPicture" type="text/plain">
									<ul class="clearfix list-shop-small">
										<%_.each(listPic,function(item,index){%>
										<li>
											<i class="ico-menu-on"></i>
											<img src="<%=item%>" alt="">
										</li>
										<%})%>
									</ul>

								</script>
								<script id="UploadPicture" type="text/plain">
									<ul class="clearfix list-shop-small" >
										<%_.each(listPic,function(item,index){%>
										<li>
											<i class="ico-menu-on"></i>
											<img src="<%=item%>" alt="">
										</li>
										<%})%>
									</ul>
								</script>
								<script  id="ToudiBatchSetting" type="text/html">
					                <dd class="clearfix setToudi">
				                        <span class="radio-con" data-value="1">
				                         	<input type="radio" name="pic" value="1" checked='checked'/><i></i>
				                        </span>白底商品图
				              
				              			<span class="radio-con ml10" data-value="2">
				              				<input type="radio" name="pic" value="2" /><i></i>
				              			</span>透底商品图

				              			<span class="tips-toud gray ml10" style="display:none">
				              				<em class="colorRed">*</em>
					              			您暂未上传商品的透明底图，模板将无法使用；
					              			请前往 <a href="./productImg.html" class="color-blueNew">"图片创意工具-商品图片库"</a>上传
					              		</span>	
					                </dd>
					            </script>
								<dl class="clearfix" id="batchText">
									<dt class="ipt-tit">
										<span class="fw1">文字</span>
										<span class="c9a" v-if="!isHtsj">（文字内容修改会对所有尺寸生效）</span>
										<span class="c9a" v-if="isHtsj">（文字内容不能为空）</span>
									</dt>
									<dd class="set-body"></dd>
									<p class="red clearfix pt10" v-if="isHtsj">注：文案必须适用于店铺内所有商品。文案内容中不允许包含利益点、具体时间、具体商品名称、类目名称，否则将被审核驳回。</p>
								</dl>
								<dl class="clearfix setPicture mt10" style="display:none" id="batchPicute">
									<dt class="ipt-tit" style="padding-bottom:10px"><span class="fw1">商品图</span></dt>
									<dd class="clearfix pictureList mt10">
										<div id="listPic" class="fleft"></div> 
										<div id="uploadPic" class="fleft"></div> 
									</dd>
									<p class="c9a" style="display:none">＊请选择1张商品图作为展示素材</p>
								</dl>
								<dl class="clearfix setToudi mt10" v-if="isHtsj">
					                <dt class="ipt-tit"  style="padding-bottom:10px"><span class="fw1">选择模板类型</span></dt>
				                    
					            </dl>
							</div>
							<div class="edit-text clearfix" id='setBox3' style="display:none">
								<dl class="set-dl">
									<dt class="ipt-tit">
										<span class="fw1">文字</span>
										<span class="c9a" v-if="!isHtsj">（文字内容修改会对所有尺寸生效）</span>
										<span class="c9a" v-if="isHtsj">（文字内容不能为空）</span>
									</dt>
									<dd><input type="text" class="ipt-name" placeholder="30字符以内，不能为空" maxlength="30"/></dd>
								</dl>
								<dl class="set-dl">
									<dt class="ipt-tit fw1">字体</dt>
									<dd>
										<select name="" class ="selectionBox" id="fontFamily">
											<option value="字体">字体</option>
										</select>
									</dd>
								</dl>
								<dl class="set-dl">
									<dt class="ipt-tit fw1">颜色</dt>
									<dd>
										<input type="button" class="set-bgcolor jscolor" title="文字颜色">
									</dd>
								</dl>
								<dl class="set-dl">
									<dt class="ipt-tit"></dt>
									<dd>
										<span class="btn-ft bold" data-value="bold" title="加粗"><i>T</i>加粗</span>          
										<span class="btn-ft italic" data-value="italic" title="倾斜"><i class="ital">T</i>倾斜</span>
									</dd>
								</dl>

								<script id="TextBoxFontFamilyDropListTemplate" type="text/html">
									<% _(options).forEach(function(value, key) { %>
										<option value="<%- key %>"><%- value %></option>
									<% }); %>
								</script>
								<script id="TextBoxFontSizeDropListTemplate" type="text/html">
									<% _(options).forEach(function(value, key) { %>
										<option value="<%- key %>"><%- value %></option>
									<% }); %>
								</script>
								<p class="red clearfix pt10" v-if="isHtsj">注：文案必须适用于店铺内所有商品。文案内容中不允许包含利益点、具体时间、具体商品名称、类目名称，否则将被审核驳回。</p>
							</div>
							<div id ="setBoxSku" style="display:none">
								<dl class="clearfix setSkuPicture mt10">
									<dt class="ipt-tit"  style="padding-bottom:10px"><span class="fw1">商品图</span></dt>
									<dd>
										<div class="handlePic">
											<input type="text" class="ipt-normal ipt-sku" placeholder="请输入属于该PIN的一个有效的SKU ID获取商品图" maxlength="30"/>
											<span class="btn-gray btnblock" id="skuSubmit">确定</span>
											<span class="mlr20">或</span>
											<span class="btn-fileN btnNewWid" id="fileLocalSku">
												<a href="#" class="btn-gray btnblock">上传图片</a>
												<input type="file" class="hide-file" id="fileSku" name="fileSku"/>
											</span>
											<span class="ired-color">＊上传的图片在200K以内</span>
										</div>
										<p class="err-color pt5" id="skuTip"></p>
									</dd>
									<dd class="clearfix pictureList mt10">
										<div id="listPic" class="fleft">
											<script id="SelectSkuPicture" type="text/plain">
												<ul class="clearfix list-shop-small">
													<%_.each(listPic,function(item,index){%>
													<li>
														<i class="ico-menu-on"></i>
														<img src="<%=item%>" alt="">
													</li>
													<%})%>
												</ul>

											</script>

										</div> 
										<div id="uploadPic" class="fleft">
											<script id="UploadSkuPicture" type="text/plain">
												<ul class="clearfix list-shop-small" >
													<%_.each(listPic,function(item,index){%>
													<li>
														<i class="ico-menu-on"></i>
														<img src="<%=item%>" alt="">
													</li>
													<%})%>
												</ul>
											</script>
										</div> 
									</dd>
									<p class="c9a" style="display:none">＊请选择1张商品图作为展示素材</p>
								</dl>
							</div>
							
							<div class="edit-picture" id ="setBox4" style="display:none">
								<span class="btn-fileN" id="fileLocal2">
									<a href="#" class="btn-red">上传图片</a>
									<input type="file" class="hide-file" id="fileLoad" name="fileLoad"/>
								</span>
								<span class="c9a">＊上传的图片在200K以内</span>
							</div>    
						</li>
						<li v-if="isWireApp" id="setBox1">
							<script id="TextBoxBatchSetting" type="text/html">
				              <td class="set-dl"><input type="text" class="set-input" value=""/></td>
				            </script>
				            <script  id="PictureBatchSetting" type="text/html">
				                  <dd>
				                      <div class="handlePic">
				                            <input type="text" class="ipt-normal ipt-sku" placeholder="请输入属于该PIN的一个有效的SKU ID获取商品图" maxlength="30"/>
				                            <span class="btn-gray btnblock" id="skuSubmit">确定</span>
				                            <span class="mlr20">或</span>
				                            <span class="btn-fileN btnNewWid" id="fileLocal2">
				                            <a href="#" class="btn-gray btnblock">上传图片</a>
				                            <input type="file" class="hide-file" id="fileLoad" name="fileLoad"/>
				                            </span>
				                            <span class="ired-color">＊上传的图片在200K以内</span>
				                      </div>
				                      <p class="err-color pt5" id="skuTip"></p>
				                     
				                  </dd>
				            </script>
				            <script id="SelectPicture" type="text/plain">
				                    <ul class="clearfix list-shop-small">
				                      <%_.each(listPic,function(item,index){%>
				                       <li>
				                         <i class="ico-menu-on"></i>
				                         <img src="<%=item%>" alt="">
				                       </li>
				                       <%})%>
				                    </ul>

				            </script>
				            <script id="UploadPicture" type="text/plain">
				                    <ul class="clearfix list-shop-small" >
				                       <%_.each(listPic,function(item,index){%>
				                       <li>
				                         <i class="ico-menu-on"></i>
				                         <img src="<%=item%>" alt="">
				                       </li>
				                       <%})%>
				                    </ul>
				            </script>
				            <dl class="clearfix">
				              <dt class="ipt-tit"><span class="fw1">文字</span><span class="c9a">（文字内容修改会对所有尺寸生效，请清晰填写文案和利益点，以提高首焦审核通过率）</span></dt>
				              <dd >
				                  <table class="tableSet">
				                      <tr class="set-body" >
				                        
				                      </tr>
				                  </table>
				              </dd>
				            </dl>
				            <dl class="clearfix setPicture mt10">
				                    <dt class="ipt-tit"  style="padding-bottom:10px"><span class="fw1">商品图</span></dt>
				                     <dd class="clearfix pictureList mt10">
				                         <div id="listPic" class="fleft"></div> 
				                         <div id="uploadPic" class="fleft"></div> 
				                     </dd>
				                     <p class="c9a" style="display:none">＊请选择1张商品图作为展示素材</p>
				            </dl>
						</li>
						<li class="btnList clearfix">  
						  <a v-if="isHtsj" href="//xjzt.jd.com/toolsintro/1560.jhtml" class="blue pull-left" target="_blank" style="line-height:30px">
				          	首焦海投模板制作指南 >
				          </a> 
				          <span class="save-image" style="display:none" v-if="!isHtsj">
				            <span class="mrA">
				              <span class="radio-con" clatag="pageclick|keycount|editor__201610109|3"><input type="radio" name="chicun" value="1" /><i></i></span>
				              当前尺寸
				              <span class="radio-con" clatag="pageclick|keycount|editor__201610109|4"><input type="radio" name="chicun" value="2" checked='checked'/><i></i></span>所有尺寸
				            </span>
				            <span class="btn-red-border" clatag="pageclick|keycount|editor__201610109|2">保存图片</span>
				          </span> 
				          <span v-if="isHtsj">
				          	<v-check>模板预审核</v-check>
				          </span>    
				          <span class="btn-red" id="save-save-btn" clatag="pageclick|keycount|editor__201610109|1">保存模板</span>
				          <v-tooltip content="将创意模板保存后，当前页面即允许将该创意保存为图片" placement="left">
				          	<i class="icon-help font14 gray vm" id="svTip"></i>
				          </v-tooltip>
				        </li>			
					</ul>
				</div>  
				<div class="modelEdit pdA clearfix" id="modelBox">
					<div class="operate">
							
						<svg class="drawingboard" width="100%" height="100%"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink">      
							<g transform="matrix(1,0,0,1,0,0)" style="opacity: 1;" class="background">
								<rect x="0" y="0" width="100%" height="100%" fill="#ffffff" style="display: inline;"></rect>
							</g>
							
							<g class="canvas">
							</g>      
							<g class="foreground" v-show="!isWireApp">
								<path class="view-rectangle" d="" fill="#fff" opacity=".9" style="pointer: full"></path>
								<g class="transform-controls"></g>
							</g>
							<g class="maskImage" style="display:none">
								<image xlink:href="" height="762" width="1125" id="maskImage1"></image>
							</g> 
						</svg> 
						<div class="offstage" style="width: 0; height: 0;"></div>
					</div>
				</div>
			</div>
			<!-- 弹窗提示 -->
			
		</div>
	<div class="modal-small modal-save" style="display:none">
	  <span class="btn-close"></span>
	  <div class="mo-bd tipA" v-if="!isHtsj">
	    <p class="mo-lh">如不更改创意任务名称，则之前保存的同名模板将被覆盖，是否继续？</p>
	    <p class="mo-btn"><span class="btn-red" id="btn-yes">是</span><span class="btn-red" id="btn-no">否</span></p>
	    <p class="mo-tar">
	      <span class="checkbox-con">
	        <input id="selectAll" type="checkbox">
	        <i></i>
	      </span>
	      以后不再提示
	    </p>
	  </div>
	  <div class="mo-bd tipA" v-if="isHtsj">
	    <p class="mo-lh">请您更改创意任务名称，才可以继续保存</p>
	    <p class="mo-btn"><span class="btn-red" id="btn-no">知道了</span></p>
	    
	  </div>
	</div>
	</div>
</template>
<script>
	import Jad from 'jad'
	import navBar from '../../components/topAndSide/topNavV2.vue'//公用导航
	import sideBar from '../../components/topAndSide/sideBarV2.vue'//公用左侧菜单
	import {getQuery} from '../../utils/utils.js'
	import CanvasXmlParser from '../../editUtils/canvasXmlParser.js'
	export default {
	    name: 'editTemplate',
        data () {
        	return {
				isloading: false,
				templateSizeList: [],
				wrapList: {},
				parseDate: {},
        		breadCrumb:[{'title':'创意库','href':'/material/#/index','isNext':true}, {'title':'图片创意工具','href':'./template.html','isNext':true}, {'title':'模板编辑'}]
        	}
        },
        components:{
        	vTooltip: Jad.Tooltip,
	        navBar,
	        sideBar,
	        vCheck: Jad.Checkbox
	    },
	    computed:{
	    	isWireApp(){
	    		let isSj = getQuery('label')&&getQuery('label').indexOf('12,')>-1
	    		return isSj
	    	},
	    	isHtsj(){
	    		let isSj = getQuery('label')&&getQuery('label').indexOf('14,')>-1
	    		return isSj
	    	}
		},
		watch:{
			templateSizeList:{
				handler(val){
					let parseData = {}
					val.forEach(item=>{
						parseData[item.size] = CanvasXmlParser.parse(item.svgInfo)
					})
					this.parseDate = parseData
					console.log(this.parseDate,'this.parseDate')
				},
				deep:true
			}
		},
        async created(){

        },
	    mounted(){
	    	let me = this
			this.$nextTick(function(){
				if(me.isWireApp){
					//$('#requireId').attr('data-main',`${JSPATH}/AppSj.js`)
					me.loadScript(`${JSPATH}/AppWire.js`)
				}else if(me.isHtsj){
					me.loadScript(`${JSPATH}/AppHt.js`)
				}else{
					//$('#requireId').attr('data-main',`/src/assets/js/editor/views/App.js`)
					me.loadScript(`${JSPATH}/App.js`)
				}
				
			})
			this.getModel()
		},
	    methods:{
	    	loadScript(url,id) {
				var script = document.createElement("script");
				script.type = "text/javascript";

				script.src = url;

				document.body.appendChild(script);
			},
			getModel(){
				let me = this
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
				var sizeList = null;
				if(tpIds){
					sizeList = tpIds.split(',')
				}else{
					sizeList = [];
				}
				var localHref = window.location.href;
				//localHref = localHref.substring(0,localHref.indexOf('#'));               
				//获取模板数据
				Http.post('/picmaker/template/getTempDetail', {
						"templateId":20223,
						"sizeIdList": sizeList
						}).then(function(re) {
							let res = re.body
							if(res.code == 1){
								let newData = res.content
								me.templateSizeList = newData.templateSizeList
								me.wrapList = {
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
									transparentSkuPicUrl:newData.transparentSkuPicUrl,//透底图
									whiteSkuPicUrl:newData.whiteSkuPicUrl,//白底图
									hasTransparentPic:newData.hasTransparentPic,//是否有透底图
									auditStandardPicUrl:newData.auditStandardPicUrl,//审核图片
								}
							}else if(res.code==-100){//未登录
								var oldHref = window.location.href;
								window.location.href = '//passport.jd.com/new/login.aspx?ReturnUrl='+oldHref;					
							}else if(res.code==-300){//没有权限
								var oldHost = window.location.host;
								window.location.href = oldHost+'/toolpage/static/notWhite.html';					
							}
				})
				
			}
	    },
	}
</script>
 <style>
    .transform-box * {
      stroke: #ff00ff;
    }
    .transform-box.selected .groupTag {
      fill: #ff00ff;
    }
    .transform-box .translate {
      fill: rgba(255,255,255,0);
      cursor: move;
    }
    .transform-box * {
      fill: #EFEFEF;
    }
    .transform-box {
      visibility: hidden;
    }
    .transform-box path {
      visibility: visible;
      opacity: 0.0;
    }
    .transform-box path:hover {
      opacity: 0.75;
    }
    .transform-box.selected,.transform-box.selected path {
      visibility: visible;
      opacity: 1.0;
    }
    .transform-box.selected:not(.grouped) .groupTag {
      display: none;
    }
    .canvas * {
      clip: auto;
    }          
    .drawingboard {
      -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        fill:#eee
    }
</style>