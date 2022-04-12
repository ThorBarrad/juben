import Vue from 'vue';
const $=require("jquery");
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

$("body").append("<div id='app'><loading_frame></loading_frame></div>")
$("body").css({"margin":0,"padding":0})
import loading_frame from './components/LoadingFrame.vue';

var app=new Vue({
    el:"#app",
    components:{loading_frame}
})