/**
 * Created by huanghaijin on 2018/2/11.
 */
import Http from '../../httpCom/http'

export default {

    async getSelectPlanList({commit}, params = {}) {
        await Http.postOne('/common/widget/user_campaign_all_v2', params).then(({body}) => {
            if (body.code == 1) {
                body.data && commit('UPDATE_STATE_BY_FIELDS', {field: 'planSelectList', value: body.data || []})
            }
        })
    },
    async getSelectAdGroupList({commit}, params = {}) {
        await Http.postOne('/common/widget/user_adgroup_all_v2', params).then(({body}) => {
            if (body.code == 1) {
                body.data && commit('UPDATE_STATE_BY_FIELDS', {field: 'adGroupSelectList', value: body.data || []})
            }
        })
    },

    async getUserMenuTools({commit}, params = {}) {
        await Http.postOne('/common/menu', params).then(({body}) => {
            if (body.code == 1) {
                body.data && commit('UPDATE_STATE_BY_FIELDS', {field: 'userTools', value: body.data.child || []})
            }
        })
    },
    async getLoginInfo({commit}) {
        await Http.postOne('/common/getLoginInfo').then(({body}) => {
            if (body.code == 1) {
                body.data && commit('SET_USER_INFO', body.data);
            } else {
                let oldHref = window.location.href;
                window.location.href = 'http://passport.jd.com/new/login.aspx?ReturnUrl=' + oldHref;
            }
        })
    },
    async getAuthForUser({commit}) {
        await Http.postOne('/common/getAuthByPin').then(({body}) => {
            if (body.code == 1) {
                body.data && commit('UPDATE_STATE_BY_FIELDS', {field: 'userAuth', value: body.data});
            }
        })
    },
    getPlanSelect({commit}, params = {}) {
        Http.postOne('/kuaiche/normal/camp/select', params).then((re) => {
            let {code, data = []} = re.body;
            if (code === 1) {
                commit('UPDATE_STATE_BY_FIELDS', {field: 'planSelect', value: data})
            }
        })
    },
    getUnitSelect({commit}, params = {}) {
        Http.postOne('/kuaiche/normal/group/select', params).then((re) => {
            let {code, data = []} = re.body;
            if (code === 1) {
                commit('UPDATE_STATE_BY_FIELDS', {field: 'unitSelect', value: data})
            }
        })
    },

}