<template>
    <div class="main_board">

        <div id="left_board">
            <div class="btn circle-btn iconfont" id="left_close_btn">&#xe62c;</div>
            <div class="list">
                
                <div class="li"><div class="icon iconfont">&#xe663;</div><router-link to="/e" class="title">我的剧本</router-link></div>
                <div class="li active"
                v-bind:style="{marginBottom:left_relation_item_show?(left_relation_items.length*50+'px'):'0px'}"
                ><div class="icon iconfont">&#xe6ec;</div><div class="title" 
                    v-on:click="left_relation_item_show=!left_relation_item_show;"
                >智能资料库</div>
                    <div class="child_board" v-bind:style="{height:left_relation_item_show?(left_relation_items.length*50+'px'):'0px'}">
                        <div class="child_item" v-for="left_relation_item in left_relation_items" style="color:white;" :key="left_relation_item.title">
                            {{left_relation_item.title}}
                        </div>
                    </div>
                    </div>
                <div class="li"><div class="icon  iconfont">&#xe69a;</div><div class="title">写作统计</div></div>
                <div class="li"><div class="icon iconfont">&#xe603;</div><div class="title">我的账户</div></div>
            </div>

            <div id="logout" class="iconfont" onclick="logout()">&#xe63a;</div>
        </div>
        <div id="right_board" style="text-align:center;">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import "../css/base.css";
import "../css/jeditor.css";
import "../index"

const $=require("jquery");
import Vue from "vue";
import VueRouter from 'vue-router';
import Manager from './Relation/Manager.vue'
import Relation_Manager from './Relation/Relation_Manager.vue'
import Character_Manager from "./Relation/Character_Manager.vue";
Vue.use(VueRouter);

const routes=[
    {path:"",redirect:"/board/rm"},
    {path:"/board/rm",component:Manager,
        children:[
            {path:"",redirect: "Relation"},
            {path:"Relation",component:Relation_Manager},
            {path:"Character",component: Character_Manager}
        ]
    }
];
const router=new VueRouter({routes});
const base = require("../js/base").default;
export default {
    router,
    data(){
        return{
            left_relation_items:[
                {
                    title:"人物关系",
                    path:"/r",
                },
                {
                    title:"外部资料库",
                    path:"null",
                }
            ],
            left_relation_item_show:false,
        }

    },
    mounted:function(){
            base.reset_rightboard_width();
            // setTimeout(function(){$("#left_close_btn").click()}, 500);

    },
    methods:{
        expand_left_relation:function(){

        }
        
    },
}
</script>
<style scoped>

</style>