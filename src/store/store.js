/**
 * Created by huanghaijin on 2018/2/11.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './common/mutations'
import actions from './common/actions'


Vue.use(Vuex);

export default new Vuex.Store({
    state:mutations.state,
    mutations:mutations.mutations,
    actions,
})