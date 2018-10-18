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
						<!--其他-->
						<li v-if="!isWireApp && !isHtsj">
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
												<input type="file" class="hide-file" id="fileLoad2" name="fileLoad2"/>
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
								<dl class="clearfix" id="batchText">
									<dt class="ipt-tit">
										<span class="fw1">文字</span>
										<span class="c9a">（文字内容修改会对所有尺寸生效）</span>
									</dt>
									<dd class="set-body"></dd>
								</dl>
								<dl class="clearfix setPicture mt10" style="display:none" id="batchPicute">
									<dt class="ipt-tit" style="padding-bottom:10px"><span class="fw1">商品图</span></dt>
									<dd class="clearfix pictureList mt10">
										<div id="listPic" class="fleft"></div> 
										<div id="uploadPic" class="fleft"></div> 
									</dd>
									<p class="c9a" style="display:none">＊请选择1张商品图作为展示素材</p>
								</dl>
							</div>
							<div class="edit-text clearfix" id='setBox3' style="display:none">
								<dl class="set-dl">
									<dt class="ipt-tit">
										<span class="fw1">文字</span>
										<span class="c9a">（文字内容修改会对所有尺寸生效）</span>
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
						<!--首焦海投-->
						<li v-if="isHtsj">
							<div id="setBoxFix">
								<p class="ipt-tit fw1">
									图层编辑
									<span class="blue ml10 normal" @click="openPush">已删除图层<em id="deleteBtn"></em></span>
								</p> 
								<script id="deleteLen" type="text/html">
									<em>(<%=deleteLen%>)</em>
								</script>
								<ul class="fix-dl clearfix"></ul>
								<script id="BatchFix" type="text/html">
									<li>
										<% var selectInfo= listLayer.selected ? 'fix-txt-select' : '',
											groupId = listLayer.groupId%>
										<div class="fix-txt-info <%=selectInfo%>">
											<%if(groupId){%>
												<%var mapTxt = {
														'product':'主推商品层',
														'productDec':'商品装饰层',
														'text':'文案层',
														'textDec':'文案装饰层',
														'logo':'logo',
														'bgDec':'背景装饰层',
														'texture':'文理',
														'background':'背景层'
												},
												tagText = groupId.match(/^[a-z|A-Z]+/gi),
												tagNum = groupId.match(/\d+$/gi);
												%>
												<%=listLayer.txtIndex +1%>-<%=mapTxt[tagText]%><%=tagNum%>
												<%if(listLayer.groupId =='product'){%>
													<div class="help-hover">
														<i class="jad-icon jad-icon-help gray font14" style="font-size: 12px;"></i>
														<div class="jad-popup jad-tooltip jad-tooltip-top">
															<div class="jad-tooltip-arrow"></div> 
															<div class="jad-tooltip-inner">
																商品图层不可删除、替换，广告播出时示例商品图将自动替换为店铺内商品图
															</div>
														</div>
													</div>
												<%}%>
											<%}else{%>
												<%=listLayer.txtIndex +1%>-'其他'
											<%}%>
											<%if(listLayer.groupId!='product' && mapTxt[tagText] != '文案层'){%>
												<i class="jad-icon jad-icon-cancel4 deleteLayer" style="font-size: 12px;"></i>
											<%}%>
										</div>
										<% var selectClass = listLayer.selected ? 'fix-selected' : ''%>
										<p class="fix-img-small <%=selectClass%>">
											<%if(listLayer.type=='Image'){%>
												<img src="<%=listLayer.xlinkHref%>" alt="">
												<span class="fix_placehodler"></span>
											<%}else{%>
												<span style="font-family:<%=listLayer.fontFamily%>;font-weight:<%=listLayer.fontWeight%>;"><%=listLayer.text%></span>
											<%}%>
										</p>
										<div class="jad-popup jad-tooltip jad-tooltip-bottom fix-tooltip">
											<div class="jad-tooltip-arrow"></div> 
											<div class="jad-tooltip-inner">
												<%if(listLayer.type=='Image'){%>
													<span style="background-image:url(<%=listLayer.xlinkHref%>)" class="fix-bgImg"></span>
												<%}else{%>
													<span style="font-family:<%=listLayer.fontFamily%>;font-weight:<%=listLayer.fontWeight%>;font-size:<%=listLayer.fontSize/2%>px;"><%=listLayer.text%></span>
												<%}%>
											</div>
										</div>
									</li>
								</script>
							</div>
							<div id="setBox1" style="display: none;">
								<script id="TextBoxBatchSetting" type="text/html">
									<span class="set-dl" style="width:33%">
										<input type="text" class="set-input" value="" style="width:100%"/>
									</span>
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
										<span class="fw1">推广文字</span>
										<span class="ml10 batchTextCheckBox" :data-autotext="isAutoText+''">
											<v-check v-model="isAutoText">使用海投自动化文案</v-check>
											<v-tooltip :content="contxt" placement="bottom">
												<i class="icon-help font14 gray vm"></i>
											</v-tooltip>
										</span>
										<p class="c9a" v-if="!isAutoText">注：文案必须适用于店铺内所有商品。文案内容中不允许包含利益点、具体时间、具体商品名称、类目名称，否则将被审核驳回。</p>
										<p class="c9a" v-if="isAutoText">注：您只需设计文案显示位置，无需再编辑文案，广告播出时将为您自动填充优质文案。</p>
									</dt>
									<dd class="set-body"></dd>
									<dd class="red clearfix pt10" id="batchIptError" style="display:none"></dd>
								</dl>
								<dl class="clearfix setPicture mt10" style="display:none" id="batchPicute">
									<dt class="ipt-tit" style="padding-bottom:10px"><span class="fw1">商品图</span></dt>
									<dd class="clearfix pictureList mt10">
										<div id="listPic" class="fleft"></div> 
										<div id="uploadPic" class="fleft"></div> 
									</dd>
									<p class="c9a" style="display:none">＊请选择1张商品图作为展示素材</p>
								</dl>
								<dl class="clearfix setToudi mt10">
					                <dt class="ipt-tit"  style="padding-bottom:10px"><span class="fw1">选择模板类型</span></dt>
				                </dl>
							</div>
							<div class="edit-text clearfix" id='setBox3' style="display:none">
								<div class="ipt-tit">
									<span class="fw1">推广文字</span>
									<span class="ml10 batchTextCheckBox" :data-autotext="isAutoText+''">
										<v-check v-model="isAutoText">使用海投自动化文案</v-check>
										<v-tooltip :content="contxt" placement="bottom">
											<i class="icon-help font14 gray vm"></i>
										</v-tooltip>
									</span>
									<p class="c9a" v-if="!isAutoText">注：文案必须适用于店铺内所有商品。文案内容中不允许包含利益点、具体时间、具体商品名称、类目名称，否则将被审核驳回。</p>
									<p class="c9a" v-if="isAutoText">注：您只需设计文案显示位置，无需再编辑文案，广告播出时将为您自动填充优质文案。</p>
								</div>
								<dl class="set-dl" style="width:33%;min-width:320px">
									<dt class="ipt-tit">
										<span class="fw1">文字</span>
									</dt> 
									<dd><input type="text" class="ipt-name" placeholder="30字符以内，不能为空" maxlength="30" style="width:100%" /></dd>
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
								<p class="red clearfix pt10" id="textBoxIptError" style="display:none"></p>
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
							</div>
							<div class="edit-picture" id ="setBox4" style="display:none">
								<span class="btn-fileN" id="fileLocal2">
									<a href="#" class="btn-red">上传图片</a>
									<input type="file" class="hide-file" id="fileLoad" name="fileLoad"/>
								</span>
								<span class="c9a">＊上传的图片在200K以内</span>
							</div>    
						</li>
						<!--无线首焦-->
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
				          <span v-if="isHtsj" class="preView-model">
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
					<div class="operate" style="position:relative">
						<svg class="drawingboard" width="100%" height="100%"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink">      
							<g transform="matrix(1,0,0,1,0,0)" style="opacity: 1;" class="background" id="svgInnerBg">
								<rect x="0" y="0" width="100%" height="100%" style="display: inline;"></rect>
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
							<g class="autoText" v-if="isAutoText">
								<image xlink:href="//img1.360buyimg.com/picmaker/jfs/t21664/217/2747119323/3957/fde55918/5b6169e5Nc25d1cf8.png" height="32" width="178" x="18" y="16"></image>
							</g> 
							<g fill="none" stroke="#FD4545" stroke-width="2" v-show="!isWireApp">
								<path stroke-dasharray="10,10" d="" class="view-border"/>
							</g>
						</svg> 
						
						<div class="offstage" style="width: 0; height: 0;"></div>
					</div>
				</div>
			</div>
		</div>
		<!--弹窗-->
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
				<p class="mo-btn" style="text-align:right;"><span class="btn-red" id="btn-no">知道了</span></p>
			</div>
		</div>
		<div class="jad-modal jad-modal jad-confirm jad-confirm-info" id="confirmBox" style="display:none">
			<div class="jad-modal-dialog jad-modal-sm">
				<div class="jad-modal-content">
					<div class="jad-modal-body" style="max-height: 500px;">
						<div>
							<div class="jad-confirm-header">
								<h3 class="jad-confirm-title">提示</h3>
							</div> 
							<div class="jad-confirm-content" id="tipMsg"></div>
						</div>
					</div> 
					<div class="jad-modal-footer">
						<button type="button" class="jad-btn jad-btn-secondary" @click="closeConfirm">知道了</button>
					</div>
				</div>
			</div>
		</div>
		<script id="deleteLayer" type="text/html">
			<%var mapTxt = {
					'product':'主推商品层',
					'productDec':'商品装饰层',
					'text':'文案层',
					'textDec':'文案装饰层',
					'logo':'logo',
					'bgDec':'背景装饰层',
					'texture':'文理',
					'background':'背景层'
			}%>
			
				<%var groupId = deleteLayers.groupId,
					tagText = groupId.match(/^[a-z|A-Z]+/gi),
					tagNum = groupId.match(/\d+$/gi),
					classSelect = deleteLayers.selected?'select-on':'';
				%>
				<li class="<%=classSelect%>">
					<i class="ico-menu-on"></i>
					<p class="delete-imgBox">
						<%if(deleteLayers.type=='Image'){%>
							<img src="<%=deleteLayers.xlinkHref%>" alt="">
							<span class="fix_placehodler"></span>
						<%}else{%>
							<span style="font-family:<%=deleteLayers.fontFamily%>;font-weight:<%=deleteLayers.fontWeight%>;"><%=deleteLayers.text%></span>
						<%}%>
					</p>
					<p>
						<%=deleteLayers.txtIndex +1%>-<%=mapTxt[tagText]%><%=tagNum%>
					</p>
				</li>
			
		</script>
		<ul class="delete-layer-ul" style="display:none" id="hiddenDeleteList">
		</ul>
		<right-modal 
			:show="isShowDelete" 
			medium
			:ok-text="okText"
			:title="title"
			:on-ok="redoLay"
			@close="closePush"
			new-class="delete-modal-medium"
			>
			<div slot="modal-body" style="height: 100%; overflow-y: auto;">
				<div class="deleteTip">请选择需要恢复的图层</div>
				<div id="deleteLayerModal"></div>
			</div>
		</right-modal>
	</div>
</template>
<script>

	import Jad from 'jad'
	import navBar from '../../components/topAndSide/topNavV2.vue'//公用导航
	import sideBar from '../../components/topAndSide/sideBarV2.vue'//公用左侧菜单
	import {getQuery} from '../../utils/utils.js'
	export default {
	    name: 'editTemplate',
        data () {
        	return {
				contxt:'<p>若您使用海投自动化文案，广告播出时将根据商品特性自动填充文案</p><p>第一行：宣传性文案（如：好货大放送、爆款优质冰箱）</p><p>第二行：商品利益点文案（如：满199-100、超快送达）</p><p>第三行：“立即抢购”等</p>',
				isloading:false,
				isAutoText:false,
				isShowDelete:false,
				okText:'恢复',
				title:'已删除图层恢复',
        		breadCrumb:[{'title':'创意库','href':'/material/#/index','isNext':true}, {'title':'图片创意工具','href':'./template.html','isNext':true}, {'title':'模板编辑'}]
        	}
        },
        components:{
        	vTooltip: Jad.Tooltip,
	        navBar,
	        sideBar,
			vCheck: Jad.Checkbox,
			'rightModal':Jad.Modal.slideRight
	    },
	    computed:{
	    	isWireApp(){//无线首焦
	    		let isSj = getQuery('label')&&getQuery('label').indexOf('12,')>-1
	    		return isSj
	    	},
	    	isHtsj(){//首焦海投
	    		let isSj = getQuery('label')&&getQuery('label').indexOf('14,')>-1
	    		return isSj
	    	}
	    },
        async created(){

		},
		watch:{
			isAutoText(val){
				$('.set-input').prop('disabled',val)
				$('.ipt-name').prop('disabled',val)
				if(val){
					this.$nextTick(()=>{
						$('.set-input').trigger('change')
						$('.ipt-name').trigger('change')
					})
				}
			},
			isShowDelete(val){
				if(val){
					this.$nextTick(()=>{
						$('#deleteLayerModal').html($('#hiddenDeleteList'))
						$('#deleteLayerModal .delete-layer-ul').show()
					})
					$('body').css('overflow','hidden')
				}else{
					$('body').css('overflow','auto')
					$('.mainPage').append($('#hiddenDeleteList'))
					$('#hiddenDeleteList').hide()
				}
				//body-inner
			}
		},
	    mounted(){
			let me = this
			//JSPATH 在build/webpck.base.js中定义
			//主要js在src/assets/js/editor/
			this.$nextTick(function(){
				if(me.isWireApp){
					//无线首焦
					//$('#requireId').attr('data-main',`${JSPATH}/AppSj.js`)
					me.loadScript(`${JSPATH}/AppWire.js`)
				}else if(me.isHtsj){
					//首焦海投
					me.loadScript(`${JSPATH}/AppHt.js`)
				}else{
					//通用、单品推广、饭粒
					//$('#requireId').attr('data-main',`/src/assets/js/editor/views/App.js`)
					me.loadScript(`${JSPATH}/App.js`)
				}
				//console.log(sessionStorage.getItem('templateSizeList'), 'portfolio')
			})
			$('.operate').trigger('mousedown')

		},
	    methods:{
			closeConfirm(){
				$('#confirmBox').hide()
			},
			openPush(){
				var len = parseInt($('#deleteBtn').text().split('(')[1],10)
				if(!len){
					Jad.Notification['info']({
	                    message: '您未删除图层',
	                })
	                return
                }
				this.isShowDelete = true
			},
			closePush(){
				this.isShowDelete = false
			},
			redoLay(){
				this.closePush()
			},
	    	loadScript(url,id) {
			  var script = document.createElement("script");
			  script.type = "text/javascript";
			  
			  script.src = url;
			  
			  document.body.appendChild(script);
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
	.deleteTip{
		margin:0 20px 10px;
		background: #F6F1E5;
		padding: 5px 10px;
	}

</style>