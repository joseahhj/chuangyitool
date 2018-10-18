/**
 * Created by huanghaijin on 2018/5/10.
 */
import * as types from './mutationTypes'
const state = {
    pageTitle: '',
    breadcrumb: [
        {title: '创意工具'},
    ],
    listBreadcrumb: [
        {title: '创意工具', href:'/normal_v2/planList'},
    ],
    currentProduct:{title: '创意工具', href: '/'},
    userMenus: [
        {text: '素材库', href: '/index', authId: -1, mid: 1},
        {text: '视频制作', href: '/list', authId: -1, mid: 2},
        {
            text: '创意工具', href: '/report', authId: -1, mid: 3,
            children: [
                {text: '创意模板库', href: '/report/account', mid: 4, authId: -1},
                {text: '我的创意库', href: '/report/effect', mid: 5, authId: -1},
                {text: '商品图片库', href: '/report/effect', mid: 5, authId: -1},
            ]
        },
        {text: '素材榜', href: '/material', authId: -1, mid: 6},
    ],
    userTools:[],
    currentMenu:'1,1',
    planSelectList:[],
    adGroupSelectList:[],
    materialSelectList:[],
    allMediaList:[],
    mediaSelectList:{},
    planSelect:[],
    unitSelect:[],
    creativeSelect:[],
    isCx:false,
    userType: 1,
    ka:0,
    pin:'',
    userAuth:[],
    showLoading:false,
    windowHeight:'',
    showPopover: false,
    popoverMsg: '',
    popoverTriggerDom: '',
    clickOrOrderCaliber: 0,
    clickOrOrderDay: 15,
    orderStatusCategory: 0,
    startDay: '',
    endDay: '',
    campaignType: 'all',
    putType:'',
    currentCampaignType:'',
    showPublicChart: false,
    publicChart: {
        dimension: 'adgroup',
        putType: 1,
        id: 0,
    },
    modalOpening: false,
    currentAdGroupId: 0,
    currentCampaignId: 0,
    shopId: 0,
    currentGroupName: '',
    currentCampaignName: '',
    listIndexTab: '',
    showSearchDmpSummary: false,
    searchDmpSummary: {
        columns: [],
        data: []
    }
};


const mutations = {
    [types.SET_BREADCRUMB](state, data){
        state.breadcrumb = data;
    },
    [types.SET_LIST_BREADCRUMB](state, data){
        state.listBreadcrumb = data;
    },
    [types.SET_PAGETITLE](state, pageTitle){
        state.pageTitle = pageTitle
    },
    [types.UPDATE_STATE_BY_FIELDS](state,obj){
        let {field,value} = obj;
        if(state.hasOwnProperty(field)){
            state[field] = value
        }
    },
    [types.SET_USER_INFO](state,obj){
        state.userType = obj.userType||1;
        state.pin = obj.pin||'';
        state.isCx = !!obj.isCx;
        state.ka = obj.ka||0;
    },
    [types.OPEN_LOADING](state){
        state.showLoading = true;
    },
    [types.CLOSE_LOADING](state){
        state.showLoading = false;
    },
    [types.OPEN_MANUAL_POPOVER](state, {msg = '', dom = {}}){
        state.popoverMsg = msg;
        state.popoverTriggerDom = dom;
        state.showPopover = true;
    },
    [types.CLOSE_MANUAL_POPOVER](state){
        state.showPopover = false;
    },
    [types.SET_PARAMS_DATE](state, {start, end}){
        state.startDay = start;
        state.endDay = end;
    },
    [types.OPEN_PUBLIC_CHART](state, obj){
        state.showPublicChart = true;
        state.publicChart = Object.assign({},obj);
        state.modalOpening = true;
    },
    [types.CLOSE_PUBLIC_CHART](state){
        state.showPublicChart = false;
        state.modalOpening = false;
    },
    [types.OPEN_SOME_MODAL](state){
        state.modalOpening = true;
    },
    [types.CLOSE_SOME_MODAL](state){
        state.modalOpening = false;
    },
    [types.OPEN_UNIT_LIST](state, {id, name, campaignType, putType}){
        state.currentCampaignId = id;
        state.currentCampaignName = name;
        state.currentAdGroupId = 0;
        state.campaignType = campaignType;
        state.putType = putType;
        state.shopId = 0;
    },
    [types.OPEN_CREATIVE_LIST](state, {campaignId, id, campaignName, name, campaignType, shopId, putType}){
        state.currentCampaignId = campaignId;
        state.currentCampaignName = campaignName;
        state.currentGroupName = name;
        state.currentAdGroupId = id;
        state.campaignType = campaignType;
        state.putType = putType;
        state.shopId = shopId;
    },
    [types.OPEN_INDEX_LIST](state){
        state.currentCampaignId = 0;
        state.currentAdGroupId = 0;
        state.shopId = 0;
    },
    [types.SET_INDEX_TAB](state, tab) {
        state.listIndexTab = tab
    },
    [types.RESET_INDEX_TAB](state) {
        state.listIndexTab = ''
    },
    [types.SET_SEARCH_DMP_INFO](state, { show, data, columns}) {
        state.showSearchDmpSummary = show
        state.searchDmpSummary.data = data
        state.searchDmpSummary.columns = columns
    }
};

export default {
    state,
    mutations,
}
