<template>
    <modal 
        :show="show" 
        medium
        :ok-text="okText"
        :title="title"
        :on-ok="showPush"
        @close="closePush"
        >
        <div slot="modal-body" style="height: 100%; overflow-y: auto;">
            <div class="yulan-pic">
                <p><img :src="detailInfo.picUrl" alt=""></p>
                <p class="yu-tip"><span>模板类目：{{detailInfo.name}}</span><span>使用量：{{detailInfo.use}}</span></p>        
            </div>
            <div class="chse-tit">
                可选尺寸: <span v-if="isNoneSelect" class="red">请选择想要编辑的尺寸</span>
                <p class="fr chBox">
                  <label>
                        <div class="checkbox-con">
                            <input 
                            type="checkbox"
                            v-model="checkAll"
                            @change="onCheckAll"
                            > 
                            <i></i>
                        </div>
                        全选
                    </label>
                </p>     
            </div>
            <div class="scroll-model  sort-chicun clearfix">
                <div class="sch-menu-sort clearfix">
                    <span 
                        v-for="item in detailInfo.templateSizeList" 
                        :key="item"
                        :class="{'menu-on':selected.indexOf(item.id)>-1}"
                        @click="selectedHandler(item.id)"
                        >
                        <i class="ico-menu-on"></i>
                        {{item.size}}
                    </span>
                </div>    
          </div>
         <!--  <p class="yulan-btn position-btn">
            <span class="btn-red" id="btn-sure">确定</span>
            <span class="btn-gray" id="btn-back">取消</span>
          </p> -->
        </div>
    </modal>
</template>
<script>
    import Jad from 'jad'
    export default {
        name:"pushSizeInfo",
        props:{
            show:{
                type:Boolean,
                default:false
            },
            currentId:{
                type:[String, Number],
                default:''
            },
        },
        data:function() {
            return {
                title: '尺寸信息',
                small: true,
                okText: '确认',
                isCenter:true,
                selected:[],
                detailInfo:{},
                checkAll:false,
                isNoneSelect:false,
            }
        },
        mounted(){
            this.getTempDetail(this.currentId)
        },
        watch:{
            show(val){
                if(val){
                    this.getTempDetail(this.currentId)
                }else{
                    this.detailInfo = {}
                }
            },
            selected:{
                handler(val){
                    let templateSizeList = this.detailInfo.templateSizeList
                    if(val.length == templateSizeList.length){
                        this.checkAll= true
                    }else{
                        this.checkAll= false
                    }
                }
            }
        },
        components:{
            'modal':Jad.Modal.slideRight
        },
        methods:{
            onCheckAll(){
                let me = this
                let templateSizeList = me.detailInfo.templateSizeList
                let selected = []
                if(me.checkAll){
                    me.selected = []
                    templateSizeList.map(function(item){
                        me.selected.push(item.id)
                    })
                    
                    // me.selected = selected
                }else{
                   me.selected = [] 
                }
            },
            selectedHandler(id){
                let selected = this.selected
                let index = selected.indexOf(id)
                this.isNoneSelect = false
                if(index>-1){
                    this.selected = selected.filter(function(item){
                        return item != id
                    })
                }else{
                   selected.push(id) 
                }
            },
            showPush:function(){
                let me = this
                let selected = me.selected
                if(!selected.length){
                    me.isNoneSelect = true
                    return
                }
                sessionStorage.setItem('tpIds',selected.join(','))
                window.location.href = './editPage.html?tid='+me.currentId
                //me.$router.push({path:'/editPage',query:{tid:me.currentId}})
                me.closePush()
            },
            closePush:function(){
                this.$emit("on-show-change",false);
            },
            getTempDetail(id) {  
                let me =this
                let params = {}
                params.templateId = id
                Http.post('/picmaker/template/getTempDetail', params).then(function(re) {
                    let res = re.body
                    if(res.code==1){
                        me.detailInfo = res.content || {};
                    }
                })  
            },

        }
    }
</script>
