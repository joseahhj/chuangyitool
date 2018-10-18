<template>
<modal 
    :show="show" 
    small
    :ok-text="okText"
    :title="pushTitle"
    :on-ok="closePush"
    :show-footer="false"
    new-class="tool-modal-small"
    @close="closePush">
    <div slot="modal-body" style="height:100%;overflow-y:auto;overflow-x:hidden">  
        <p>{{this.auditInfo}}</p> 
        <div class="feedback-cont clearfix">
            <div class="item" v-for="(pic,index) in listPic" :class="{oneItem:listPic.length==1}" :key="index">
                  <!-- <v-tooltip :content="renderPop(pic)" :placement="renderPlace(index)"> -->
                <img :src="picHead+pic" alt="">
                  <!-- </v-tooltip> -->
            </div>
        </div>
    </div>
</modal>
</template>
<script>
    import Jad from 'jad'
    export default {
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
            pushTitle:{
                type:String,
                default:''
            },
        },//['show','addParam'],
        data:function() {
            return {
                medium: true,
                okText: '确认',
                picHead:'//img1.360buyimg.com/da/'
            }
        },
        computed:{
            listPic(){
                var tempPic=[];
                if(this.failUrl){
                    tempPic = this.failUrl.split(';')
                }
                tempPic=tempPic.filter(function(val){
                    return val!=''
                })
                return tempPic
            }
        },
        watch:{
        // show(val){

        // }
        },
        components:{
            'modal':Jad.Modal.slideRight,
            vTooltip: Jad.Tooltip,
        },
        methods:{
            closePush:function(){//
                this.$emit("on-show-change",false)
            },
            renderPop:function(pic){
                return '<img src='+this.picHead+pic+'>'
            },


        }
    }
</script>
<style>


.feedback-cont .item img {
    max-width: 500px;
    max-height: 212px;
}

</style>
