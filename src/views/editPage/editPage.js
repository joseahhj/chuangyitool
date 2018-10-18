/**
 * @ 入口文件
 * @author 
 */
import Vue from 'vue'
// import VueRouter from 'vue-router'

//import store from '../../store/store.js'
import Jad from 'jad'
import Http from '../../httpCom/http'
import page from './page.vue';


window.Vue = Vue;
window.Jad = Jad;
// window.Store = store;
window.Http = Http;

require('jad/dist/jad.css');
require('../../assets/scss/common.scss');

new Vue({
	el: '#main',
	render: h => h(page)
});