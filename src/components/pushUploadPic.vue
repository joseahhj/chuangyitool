<template>
<modal 
    :show="show" 
    medium
    new-class="modal-upload"
    :ok-text="okText"
    :title="title"
    :on-ok="saveList"
    @close="closePush">
    <div slot="modal-body" style="height:100%;overflow-y:auto;overflow-x:hidden">  
        <ul class="upload-list-tp clearfix">
            <li v-for="(item,index) in dataList" class="grid-li" :key="index">
                <div class="clearfix mb10">
                    <p class="bg-grid sku-pic-box pull-left upload-toudi">
                        <img :src="item.picUrl">
                        <span class="mask-topacity" @click="deleteTouDi(index)">
                            <i class="icon-trash-o2 font16"></i>
                        </span>
                    </p>
                    <p class="sku-pic-zt bg-gray pull-right pt45" v-if="!item.skuPicUrl">
                        <i class="icon-notice2 font16"></i><br/>
                        <span v-if="item.isLoadSkuPic">正在获取商品主图...</span>
                        <span v-else>未获取到商品主图</span>
                    </p>
                    <p class="sku-pic-zt bg-white pull-right" v-if="item.skuPicUrl">
                        <span class="block mt10 mb10">对应主图</span>
                        <img :src="item.skuPicUrl" width="100" height="100"/>
                    </p>
                </div>
                <div class="tit-info">
                    <span class="vm inline-block">SKU ID: </span>
                    <template v-if="!isErro(item,index)">
                        <span class="edName">{{item.skuId}}</span>
                        <span class="btn-bianji" @click="showInput(item,index)"></span>
                    </template>

                    <template v-if="isErro(item,index)">
                        <p class="inline-block tips  relative" :class="{'tips-error':isErro(item,index,true)}">
                            <input 
                                :ref="'item'+index"
                                type="text" 
                                placeholder="请输入SKU ID" 
                                v-model="item.skuId" 
                                class="skuIpt" 
                                @change="getSku(item)"
                                @focus="setIndex(index)" 
                                @blur="setIndex('-1')" 
                                @input="filterSkuId(item,index)"> 
                            <i class="icon-notice"></i> 
                            <span class="tips-tit">{{skuList[item.skuId].msg || '请输入正确的SKU ID'}}</span>
                        </p>
                    </template>
                </div>
            </li>
            
            <li v-if="maxLength>0" class="relative">
                <div class="defaultUpload" :class="isLoadErro?'bg-white':'bg-grid'">
                    <v-upload @on-change="changeFiles"
                              ref="vupload"
                              :max-length="maxLength"
                              :max-size="1028"
                              accept="image/png"
                              multiple
                              :delay="isDelay"
                              multiple-model="sync"
                              
                              @multiple-success="loadSuccess"
                              @multiple-error="loadErro"
                              action="/picmaker/skuPic/multiupload"
                              name="fileload">
                        <template slot="customButton">
                            <span class="color-blueNew default-tit" v-if="!isLoadErro && !isLoadPic">
                                <i class="font16">+</i>
                                上传透底图
                            </span>
                            <div class="loading-box" v-if="isLoadErro">
                                <span class="colorRed"><i class="icon-notice font14"></i> 上传失败</span>
                                <span class="color-blueNew">点击重新上传</span>
                            </div>
                        </template>
                    </v-upload>
                </div>
                <div class="progessUpload bg-white" v-if="isLoadPic">
                    <div class="loading-box">
                        <p class="mb20">素材上传中</p>
                        <span class="progress-wrap">
                            <em class="progress-inner" 
                            :class="{'progressWidth':proWidth > 0 && proWidth < 100}" 
                            :style="{width: proWidth && (proWidth +'%')}"></em>
                        </span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    <template slot="header">
        <div>
            <h2 class="inline-block">上传透底图</h2>
            <span class="red ml10 font12" v-if="maxLength<=0">批量上传已达上限20张！</span>
        </div>
        <p class="font12 gray pl20 pr20" style="line-height:1.5;position:relative;top:-10px">
            * 仅支持上传PNG格式，支持批量上传，最多一次上传20张图；
            图片尺寸要求为350*350px；
            文件名称建议命名格式为“****(sku id)”，其中****代表文字，()为文件对应的sku id，
            系统可根据文件名称中的sku id获取到对应的实际商品主图，以便审核。
        </p>
    </template>
</modal>
</template>
<script>
    import Jad from 'jad'
    // import Upload from './Upload/Upload.vue'
    export default{
        name:'pushUploadPic',
        props:{
            show:{
                type:Boolean,
                default:false
            },
            failUrl:{
                type:String,
                default:''
            },
            auditInfo:{
                type:String,
                default:''
            },
            updateList:{
                type:Function,
                default(){
                    return null
                }
            }
        },
        data:function() {
            return {
                title: '上传透底图',
                isDelay:true,//能不能上传图片
                medium: true,
                okText: '确认',
                picHead:'//img1.360buyimg.com/da/',
                dataList:[],
                curId:'',
                skuIpt:'',
                picNames:{},
                isLoadPic:false,
                isLoadErro:false,
                curIndex:-1,
                overSkuId:[],
                tempSku:'',
                isBlur:true,
                proWidth:0,
                isLoadSkuPic:false,
            }
        },
        watch:{
            show(val){
                if(!val){
                    this.dataList = []
                    this.overSkuId = []
                    this.isLoadSkuPic = false,
                    this.curIndex = -1
                }
            }
        },
        computed:{
            //重复sku id 计数
            skuList(){
                let dataList = this.dataList
                let overSkuId = this.overSkuId
                let skuObj={};

                for(let i = 0; i < dataList.length; i++){
                    if(!skuObj[dataList[i].skuId]){
                        skuObj[dataList[i].skuId] = {}
                        skuObj[dataList[i].skuId].count = 1
                        skuObj[dataList[i].skuId].skuPicUrl = dataList[i].skuPicUrl
                    }else{
                        skuObj[dataList[i].skuId].count += 1
                    }
                }

                for(let key in skuObj){
                    let index = overSkuId.indexOf(Number(key))
                    let isNormalSku = this.isNormalSku(key)
                    skuObj[key].msg = ''
                    if(index > -1){
                        skuObj[key].count = 6
                    }
                    if((key && skuObj[key].count >= 6)){
                        skuObj[key].msg="该SKU ID上传主图已达上限5张!"
                    }
                    if((key && !skuObj[key].skuPicUrl) || !isNormalSku){
                        skuObj[key].msg="请输入正确的SKU ID!"
                    }
                }
                return skuObj
            },
            //剩余传图片的个数
            maxLength(){
                return 20 - this.dataList.length
            }
        },
        
        components:{
            'modal':Jad.Modal.slideRight,
            vTooltip: Jad.Tooltip,
            vUpload:  Jad.Upload //Upload
        },
        methods:{
            //是否显示输入框
            isErro(item,index,flag){
                return (!flag && this.curIndex === index) 
                        || this.skuList[item.skuId].msg != '' 
                        || !item.skuId 
                        || !item.skuPicUrl
            },
            //删除图片
            deleteTouDi(vindex){
                this.overSkuId = []
                this.dataList = this.dataList.filter(function(item,index){
                    return vindex !== index
                })
            },
            //input获取焦点和失去焦点
            setIndex(index){
                this.curIndex = index
            },
            //input实时输入校验
            filterSkuId(item,index){
                item.skuId = item.skuId.replace(/([^\d]*)/g,"");
                this.curIndex = index
            },
            //校验sku是否合法
            isNormalSku(skuId){
                let reg = /^(\d)*$/
                return reg.test(skuId) && skuId !==''
            },
            //关闭弹窗
            closePush:function(){//
                this.$emit("on-show-change",false)
            },
            //点击编辑按钮显示输入框
            showInput(item,index){
                let me =this
                this.curIndex = index
                this.$nextTick(function(){
                    me.$refs['item'+index][0].focus()
                })
                
            },
            //根据sku获取主图
            getSku(item,e){
                let me = this
                item.skuPicUrl = ''
                item.isLoadSkuPic = true
                this.overSkuId=[]
                if(this.isNormalSku(item.skuId)){
                    Http.postOne('/picmaker/skuPic/querySkuMainPic',{skuId:item.skuId})
                    .then(function(re) {
                        let res = re.body
                        if(res.code==1){
                            item.skuPicUrl = res.content
                            
                        }else{
                            Jad.Notification['error']({
                                message: res.msg || 'SKU ID获取主图失败',
                                description:''
                            })
                        }
                        item.isLoadSkuPic = false
                        me.curIndex = -1
                    })
                }
            },
            //保存透明图
            saveList(){
                let me = this
                let dataList = this.dataList
                let skuList = this.skuList
                let picErro = []
                let endParam = []
                let overSku = []
                let emptySku = false
                if(!dataList.length){
                    Jad.Notification['error']({
                        message: '您暂未上传透明底图',
                        description:''
                    })
                    return false
                }
                if(dataList.length){
                    for(let i=0; i < dataList.length; i++){
                        let param = {}
                        if(!me.isNormalSku(dataList[i].skuId)){
                           emptySku = true
                           break;
                        }
                        if(!dataList[i].skuPicUrl){
                            picErro.push(dataList[i].skuId)
                        }
                        param.picUrl = dataList[i].picUrl
                        param.skuPicUrl = dataList[i].skuPicUrl
                        param.skuId = dataList[i].skuId
                        endParam.push(param)
                    }
                    for(let key in skuList){
                        if(skuList[key].count >= 6){
                            emptySku = true
                            break;
                        }
                    }
                }
                for(let key in skuList){
                    if((key && skuList[key].count >= 6)){
                        overSku.push(key)
                    }
                }
                if(picErro.length){
                    Jad.Notification['error']({
                        message: 'SKU ID <span class="red">"'+picErro.join(',')+'"</span>获取主图失败',
                        description:''
                    })
                    return false
                }
                if(overSku.length){
                    Jad.Notification['error']({
                        message: 'SKU ID <span class="red">"'+overSku.join(',')+'"</span>上传主图已达上限5张!',
                        description:''
                    })
                    return false
                }
                if(emptySku){
                    return false
                }
                this.savePostLi(endParam)
            },
            savePostLi(endParam){
                let me = this
                Http.post('/picmaker/skuPic/savePic',{skuPiVocList:endParam})
                .then(function(re) {
                    let res = re.body
                    if(res.code==1){
                        if(res.content && res.content.length){
                            me.overSkuId = res.content
                            Jad.Notification['error']({
                                message: 'SKU ID <span class="red">"'+me.overSkuId.join(',')+'"</span>上传主图已达上限五张',
                                description:''
                            })
                        }else{
                            Jad.Notification['success']({
                                message: res.msg || '保存成功',
                                description:''
                            })
                            me.updateList && me.updateList()
                            me.closePush()
                        }
                    }else{
                        Jad.Notification['error']({
                            message: res.msg || '保存失败',
                            description:''
                        })
                    }
                })
            },
            //点击上传按钮
            changeFiles(Obj){
                let dataList = this.dataList
                let len = Obj.length - 1
                this.proWidth = 1
                if(this.maxLength <= 0){
                    while (len>=0) {
                        this.$refs.vupload.delFile(len)
                        len--
                    }
                    this.isDelay = true
                }else{
                    this.isDelay = false
                    this.isLoadPic = true
                    this.isLoadErro = false
                }
                //this.isDelay = false
            },
            //上传图片成功
            loadSuccess(obj){
                let me = this
                let fileList = obj.fileList
                this.proWidth = 100
                if(fileList.code == 1){
                    this.isLoadPic = false
                    this.isLoadErro = false
                    me.dataList= me.dataList.concat(fileList.content)
                    if(fileList.msg){
                        Jad.Modal.info({
                            title:'提示',
                            content: fileList.msg, 
                        })
                    }
                }else{
                    this.isLoadPic = false
                    this.isLoadErro = true
                    if(fileList.msg){
                        Jad.Modal.info({
                            title:'提示',
                            content: fileList.msg, 
                        })
                    }
                }
                
            },
            //上传图片失败
            loadErro(obj){
                this.isLoadPic = false
                this.isLoadErro = true
            },
            //上传进度
            // onprog(ev){
            //     this.proWidth = Math.round(ev.loaded / ev.total * 100) + '%';
            // }


        }
    }
</script>

