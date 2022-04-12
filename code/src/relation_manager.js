import Vue from 'vue';

const $=require("jquery");

$("body").append("<div id='app'><main_center></main_center></div>")

// css imported

import "./css/relation_manager.css"

import main_center from './components/Mainframe2.vue';

var app=new Vue({
    el:"#app",
    components:{main_center}
})
