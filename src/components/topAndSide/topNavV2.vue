<template>
   <div class="navbar">
        <div class="pull-left pageTitle" id="breadcrumb">
            <ul class="listBreadcrumb clearfix">
                <li v-for="(item,index) in breadCrumb" :key="index">
                   
                    <a :href="item.href" v-if="item.isNext">
                        {{item.title}}
                    </a>
                    <span v-else :class="{'cur':!item.isNext}">{{item.title}}</span>
                    <i class="icon icon-angle-right" v-if="item.isNext"></i>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import Jad from 'jad'
    export default {
        name:'vTop',
        props:['breadCrumb'],
        //mixins:[Mixins],
        components:{
            vTooltip: Jad.Tooltip,
            dropDown: Jad.DropDown,
            dropDownMenu: Jad.DropDown.Menu,
            dropDownItem: Jad.DropDown.Item,
            
        },
        data(){
            return {
                openLetter:false,
                downWidth:0,
                campaignId: 0,
                adGroupId: 0,
                toShowTrend:'',
                isShowTrend:false,
                addParam:''
            }
        },
        
        
        

        
    }
</script>
<style>
    .breadcrumbV2 li{
        float: left;
        height: 51px;
        line-height: 51px;
        font-size: 12px;
        padding-right: 5px;
    }
    .breadcrumbV2 .cur{
        color: #999
    }
    .logout{
        height: 30px;
        line-height: 30px;
        display: block;
    }
    .logout i{
        font-size: 16px
    }
</style>
