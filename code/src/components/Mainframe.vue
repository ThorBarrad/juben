<template>
    <div class="main_board">
        <div id="left_board">
            <div class="btn circle-btn iconfont" id="left_close_btn">&#xe62c;</div>
            <div class="list">

                <div :class="'li '+(item.active?'active':'')" v-for="item in menu_items" :key="item.idx" @click="active_menu(item.idx)"><div class="icon iconfont" v-html="item.icon"></div><div class="title">{{item.title}}</div></div>
                <!-- <div class="li"
                v-bind:style="{marginBottom:left_relation_item_show?(left_relation_items.length*50+'px'):'0px'}"
                ><div class="icon iconfont">&#xe6ec;</div><div class="title"
                    v-on:click="left_relation_item_show=!left_relation_item_show;"
                >智能资料库</div>

                </div> -->
            </div>
            <div id="logout" class="iconfont" @click="logout">&#xe63a;</div>
        </div>
        <div id="right_board" style="">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import "../css/base.css";
import "../css/jeditor.css";
import "../index"
// import Jeditor_Ju from "./Editor/Jeditor_Ju.vue";
// import Jeditor_Ji from "./Editor/Jeditor_Ji.vue";
// import Jeditor_chang from "./Editor/Jeditor_chang.vue";
// import Jeditor_editor from "./Editor/Jeditor_editor.vue";
// import jeditor_fast_editor from "./Editor/jeditor_simple_editor.vue";
const $=require("jquery");
// import Vue from "vue";
// import VueRouter from 'vue-router';
// import Manager from "./Relation/Manager.vue";
// import Relation_Manager from "./Relation/Relation_Manager.vue";
// import Character_Manager from "./Relation/Character_Manager.vue";
// import ExternalDB from "./ExternalDB.vue"
// import ExternalDBFrame from "./ExternalDBFrame.vue"
// import Building from './Building.vue'
// Vue.use(VueRouter);

// const routes=[
//     {path:"/e",component:Jeditor_Ju,alias: '/'},
//     {path:"/e/:encode_drama_id",component:Jeditor_Ji,props:true},
//     {path:"/e/:encode_drama_id/:encode_episode_id",component:Jeditor_chang,props:true},
//     {path:"/e/:encode_drama_id/:encode_episode_id/:encode_scene_id",component:Jeditor_editor,props:true},
//     {path:"/faste/:encode_drama_id/:encode_episode_id/:encode_scene_id",component:jeditor_fast_editor,props:true},
//     {path:"/board/rm",component:Manager,
//         children:[
//             {path:"",redirect: "Relation"},
//             {path:"Relation",component:Relation_Manager},
//             {path:"Character",component: Character_Manager}
//         ]
//     },
//     {path:"/board/ed",component:ExternalDB},
//     {path:"/board/edf",component:ExternalDBFrame},

//     {path:"/building",component:Building},
// ];
// const router=new VueRouter({routes});
const base = require("../js/base").default;
export default {
    // router,
    data(){
        return{
            menu_items:[
                {
                    idx:0,
                    active:true,
                    icon:"&#xe663;",
                    title:"我的剧本",
                    path:"/board/e",
                },
                {
                    idx:1,
                    active:false,
                    icon:"&#xe6ec;",
                    title:"人物关系",
                    path:"/board/board/rm",
                }
                ,
                {
                    idx:2,
                    active:false,
                    icon:"&#xe6ec;",
                    title:"外部资料库",
                    path:"/board/board/ed",
                }
                ,
                {
                    idx:3,
                    active:false,
                    icon:"&#xe69a;",
                    title:"写作统计",
                    path:"/board/building",
                }
                ,
                {
                    idx:4,
                    active:false,
                    icon:"&#xe603;",
                    title:"我的账户",
                    path:"/board/u",
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

        active_menu:function(menu_idx){
            for(var i =0; i< this.menu_items.length;i++){
                if(menu_idx == i){
                    this.menu_items[menu_idx].active = true;
                }
                else{
                    this.menu_items[i].active = false;
                }
            }
            // disable one
            // if(menu_idx == 3)return;
            this.$router.push(this.menu_items[menu_idx].path);
        },
        logout:function(){
            var that = this;
            $.ajax({
                    url:ROOT_HOST+"/user/logout",
                    type:'POST',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success : function(returndata){
                        sessionStorage.removeItem("token");
                        that.$router.push("/user");
                        that.$cookies.remove('password');
                    },
                    error : function(xhr){
                    }
                });
        }
    },
}
</script>
<style scoped>
iframe{
            height: 100%;
    width: 100%;
    border: 0px solid white;
    }
</style>
