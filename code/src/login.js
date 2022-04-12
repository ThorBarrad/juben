import Vue from 'vue';
const $=require("jquery");

$("body").append("<div id='app'><main_center></main_center></div>")
import main_center from './components/Index.vue';

var app=new Vue({
    el:"#app",
    components:{main_center}
})