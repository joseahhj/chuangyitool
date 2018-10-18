<template>
	  <div class="chooseBox">
    <dl class="sch-menu">
      <dt class="sch-menu-tit">
        模板类目
      </dt>
      <dd class="sch-menu-sort" id='tagFilter' @click="changeIndustry">
        <a 
            :data-industry="item.industry" :key="index"
            :class="{'menu-on':param.industry == item.industry}"
            :clstag="'pageclick|keycount|template__201610108|'+index" 
            v-for="(item,index) in industryList">
          <i class="ico-menu-on"></i>
          {{item.name}}
        </a>
      </dd>
    </dl>
    <dl class="sch-menu">
      <dt class="sch-menu-tit">
        扩展主题
      </dt>
      <dd class="sch-menu-sort" id='labFilter' @click="changeLabel">
        <a :data-label="item.label" :key="item"
           v-for="item in labelList" 
           :class="{'menu-on':param.label == item.label}">
           <i class="ico-menu-on"></i>
           {{item.name}}
           <v-tooltip :content="item.tips" v-if="item.tips">
                <i class="icon-help font14 gray vm"></i>
           </v-tooltip>
        </a>
      </dd>
    </dl>    
  </div>
  
</template>
<script>
    import {getQuery} from '../utils/utils.js'
    import Jad from 'jad'
	export default {
		name:'cateList',
        props:['updateList'],
        data(){
            return {
                param:{
                    industry:'',
                    label:'',
                    pageIndex:1
                },
                industryList:[
                    {
                        industry:'',
                        name:'全部'
                    },{
                        industry:1,
                        name:'家用电器'
                    },{
                        industry:2,
                        name:'手机电脑'
                    },{
                        industry:3,
                        name:'服装家具'
                    },{
                        industry:4,
                        name:'个护化妆'
                    },{
                        industry:5,
                        name:'奢侈品'
                    },{
                        industry:6,
                        name:'运动户外'
                    },{
                        industry:7,
                        name:'食品饮品'
                    },{
                        industry:8,
                        name:'母婴'
                    },{
                        industry:9,
                        name:'图书'
                    }
                ],
                labelList:[
                    {
                        label:'',
                        name:'全部'
                    },{
                        label:14,
                        name:'首焦海投',
                        tips:'仅首焦海投计划广告适用'
                    },{
                        label:12,
                        name:'无线首焦',
                        tips:'仅品牌聚效广告适用'
                    },{
                        label:11,
                        name:'京东饭粒'
                    },{
                        label:13,
                        name:'单品推广'
                    },{
                        label:10,
                        name:'通用'
                    }
                ],

            }
        },
        created(){
            let label = getQuery('label')
            if(label){
                this.param.label = label
                this.updateList && this.updateList(this.param)
            }
        },
        components:{
            vTooltip: Jad.Tooltip,
        },
        methods:{
            changeIndustry(e){
                let industry = e.target.getAttribute('data-industry')
                this.param.industry = industry
                this.updateList && this.updateList(this.param)
            },
            changeLabel(e){
                let label = e.target.getAttribute('data-label')
                this.param.label = label
                this.updateList && this.updateList(this.param)
            }
        }
	}
</script>
<style scoped>
.jad-popover-cont{
    margin-top:-1px;
    vertical-align: top
}
</style>
