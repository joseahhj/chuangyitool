<template>
    <div class="sidebar">
        <div class="logo"><a href="//jzt.jd.com"></a></div>
        <div class="jd-car mb10" >
            <drop-down placement="right"  trigger="click" style="width:140px">
                <a class="box-btn" href="javascript:void(0);">创意库<i class="icon-angle-right"></i></a>
                <div class="sideToolWrap" slot="list">
                    <div class="sideToolBox"  v-for="item in userMenu" :key="item">
                        <ul class="clearfix">
                            <li v-for="val in item.child" :key="val">
                            <a  :target="val.target" :href="val.href" :class="val.icon"></a>
                            <p>{{val.title}}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </drop-down>
        </div>
        <v-menu :active-key="activeKey" :open-keys="openKeys">   
            <v-item item-key="sucaiku" class="kc-menu">
                <a href="/material/#/index" class="font14 pl30">素材库</a> 
            </v-item>
            <v-item item-key="video" class="kc-menu" v-show="isShowVideo">
                <a href="/material/#/video" class="font14  pl30" v-if="isShowVideo">视频创意工具</a>  
            </v-item>
            <v-sub title="<span class='font14 vm'>图片创意工具</span>" item-key="Normal">
                <v-item item-key="tp" class="kc-menu">
                    <a href="./template.html">
                        创意模板库
                    </a>
                </v-item>
                <v-item item-key="myTp" class="kc-menu">
                    <a href="./myTemplateList.html">
                        我的创意库
                    </a>
                </v-item>
                <v-item item-key="pic" class="kc-menu">
                    <a href="./productImg.html">
                        商品图片库
                    </a>
                </v-item>
            </v-sub>
            <v-sub v-if="isShowBillboard" title="<span class='font14 vm'>优秀创意榜</span>" item-key="Billboard">
                <v-item item-key="rank" class="kc-menu">
                    <a href="./billboard.html">行业创意排行榜</a>
                </v-item>
                <v-item item-key="mine" class="kc-menu">
                    <a href="/material/#/my/material">我的创意榜</a>
                </v-item>
            </v-sub>
            <v-item v-else item-key="rank" class="kc-menu">
                <a href="/material/#/my/material" class="font14 pl30">我的素材榜</a>
            </v-item>
        </v-menu>
    </div>
</template>
<script>
    import Jad from 'jad'
    import Http from '../../httpCom/http'
    import {getCookie,delCookie,isEmptyObject} from '../../utils/utils'
    export default {
        name:'vSide',
        //mixins:[Mixins],
        props:['activeKey'],
        components:{
                vMenu: Jad.Menu,
                vItem: Jad.Menu.MenuItem,
                vSub: Jad.Menu.SubMenu,
                dropDown: Jad.DropDown,
                dropDownMenu: Jad.DropDown.Menu,
        },
        data(){
            return {
                openKeys:['Normal', 'Report', 'Billboard'],
                userMenu:[],
                userAuth:'',
                isHt:false,
                isKc:false,
                isMs:false,
                norUrl:0,
                isShowVideo:false,
                isShowBillboard: true
            }
        },
        async created(){
            //await getPin()
            await this.getAuthPin()
            this.getUserMenu();
        },
        methods:{
            async getAuthPin(){//白名单、非白名单
                var me =this
                await Http.postOne('/common/getAuthByPin',{requestFrom: 0}).then(function(re){
                  if(re.body.code==1&&re.body.data.length){
                        var tepData = re.body.data.join(',')+',';
                        if(tepData.indexOf('57,')>-1 && tepData.indexOf('66,')>-1){
                            me.isShowVideo = true
                        }
                        // 88： 优秀素材榜黑名单
                        if(tepData.indexOf('88,') > -1){
                            me.isShowBillboard = false
                        }
                    }
                })   
            },
            getUserMenu(){
                var me =this
                Http.postOne('/common/menu',{requestFrom: 0}).then(function(re){
                  if(re.body.code==1&&re.body.data.child){
                        me.userMenu=re.body.data.child
                  }
                })
            },
        }
        
    }
</script>
<style>
    .sideToolWrap{
        display: block;
        height: auto;
        position: static;
        border:none;
        box-shadow: 0 0 0 0
    }
    
    .pl30{padding-left: 30!important}
    .kc-menu{position: relative;height: 32px}
    .kc-menu{opacity: 1}
    .kc-menu div,
    .kc-menu a{
        position: absolute;
        left:0;
        top:0;
        width: 100%;
        height: 100%;
        padding-left: 40px;
        opacity: 0.5;
        cursor: pointer;
    }
    .kc-menu div.jad-menu-item-active,
    .kc-menu a.jad-menu-item-active,
    .jad-menu-item-active a{
        opacity: 1
    }
    .jad-menu i+span{
        margin-left:-4px;
    }
    
</style>