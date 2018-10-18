<template>
    <modal 
        :show="show" 
        medium
        :ok-text="okText"
        :title="title"
        :show-footer="false"
        @close="closePush"
        >
        <div slot="modal-body" style="height: 100%; overflow-y: auto;" id="autoScroll">
            <div class="yulan-pic" v-if="previewList.length">
                <p class="yl-pic"><img :src="previewList[0].picUrl" alt=""></p>
                <p>图片尺寸：<span class="yl-size">{{previewList[0].size}}</span></p>
                <p class="yulan-btn">
                  <span class="btn-red make-size" data-id="22477" @click="nextPush">开始制作</span>
                  <span class="btn-gray" id="btn-back" @click="closePush">返回</span>
                </p>
            </div>
            <div class="scroll-model clearfix">
                <span class="btn-left-rule"></span>
                <span class="btn-right-rule"></span>
                <div class="spec-list-cont clearfix">
                  <ul class="spec-list push-li clearfix" style="width: 875px; height: 530px; left: 0px;">
                    <li 
                        v-for="item in previewList" 
                        :key="item.size"
                        :data-size="item.size"
                        :data-src="item.picUrl">
                      <p class="spec-fz">{{item.size}}</p>
                      <em class="spec-rect">
                        <img :src="item.picUrl" alt="">
                     </em>
                    </li>
                  </ul>
                </div>      
            </div>
        </div>
    </modal>
</template>
<script>
    import Jad from 'jad'
    export default {
        name:"pushAddSku",
        props:{
            show:{
                type:Boolean,
                default:false
            },
            currentId:{
                type:[String, Number],
                default:''
            },
            nextOpen:{
                type:Function,
                default:null
            },
        },
        data:function() {
            return {
                title: '预览',
                okText: '确认',
                isCenter:true,
                previewList:[]
            }
        },
        components:{
            'modal':Jad.Modal.slideRight
        },
        mounted(){
            
            this.getPreview(this.currentId)
            
            
        },
        watch:{
            show(val){
                if(val){
                    this.getPreview(this.currentId)
                }else{
                    this.previewList = []
                }
            },
            previewList:{
                handler(val){
                    let me = this
                    if(val.length){
                        this.$nextTick(function(){
                            me.silderPic()
                        })
                    }
                },
                deep:true
            }
        },
        methods:{
            nextPush:function(){
                this.$emit("on-show-change",false);
                this.nextOpen(this.currentId)
            },
            closePush:function(){
                this.$emit("on-show-change",false);
            },
            getPreview(id) {  
                let me =this
                let params = {}
                params.templateId = id
                Http.postOne('/picmaker/originality/previewSystemImg', params).then(function(re) {
                    let res = re.body
                    
                    if(res.code==1){
                        me.previewList = res.content || {};
                    }
                })  
            },
            silderPic(){
                $('#autoScroll').banqh({
                    box:"#autoScroll",//总框架
                    pic:".yulan-pic",//大图框架
                    pnum:".scroll-model",//小图框架
                    prev_btn:".btn-left-rule",//小图左箭头
                    next_btn:".btn-right-rule",//小图右箭
                    autoplay:false,//是否自动播放
                    interTime:5000,//图片自动切换间隔
                    delayTime:400,//切换一张图片时间        
                    order:0,//当前显示的图片（从0开始）
                    picdire:true,//大图滚动方向（true为水平方向滚动）
                    mindire:true,//小图滚动方向（true为水平方向滚动）
                    min_picnum:3,//小图显示数量
                    pop_up:false//大图是否有弹出框
                })
            }

        }
    }
</script>
