import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.use(VueRouter);

const $=require("jquery");

$("body").append("<div id='app' style='background:white;'><Index></Index></div>")

// css imported 

import "./css/base.css"

import Index from './components/Index.vue';

var app=new Vue({
    el:"#app",
    components:{Index}
})