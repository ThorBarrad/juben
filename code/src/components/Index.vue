<template>
    <router-view></router-view>
</template>

<script>
    const $=require("jquery");
    import Vue from "vue";
    import VueRouter from 'vue-router';
    import Login from "./Login/Login.vue";
    import Register from "./Login/Register.vue";
    import RegisterSuccess from "./Login/RegisterSuccess.vue";
    import Retrievef from "./Login/Retrievef.vue";
    import Retrieves from "./Login/Retrieves.vue";
    import RetrieveSuccess from "./Login/RetrieveSuccess.vue";
    import LoginFrame from "./LoginFrame.vue";

    import MainFrame from "./Mainframe.vue";
    import Manager from "./Relation/Manager.vue";
    import Relation_Manager from "./Relation/Relation_Manager.vue";
    import Character_Manager from "./Relation/Character_Manager.vue";
    import ExternalDB from "./ExternalDB.vue"
    import ExternalDBFrame from "./ExternalDBFrame.vue"
    import Building from './Building.vue'
    import Jeditor_Ju from "./Editor/Jeditor_Ju.vue";
    import Jeditor_Ji from "./Editor/Jeditor_Ji.vue";
    import Jeditor_chang from "./Editor/Jeditor_chang.vue";
    import Jeditor_changv2 from "./Editor/Jeditor_changv2.vue";
    import Jeditor_editor from "./Editor/Jeditor_editor.vue";
    import jeditor_fast_editor from "./Editor/jeditor_simple_editor.vue";

    import user_info from "./User/info.vue"
    import jeditor_all_chang from "./Editor/jeditor_all_chang.vue";
    import "../index"


    Vue.use(VueRouter);
    const routes=[
        {
          path:"/",redirect:"user"
        },
        {
            path:"/user",component: LoginFrame,alia:"/",
            children:[
                {path:"",redirect:"login"},
                {path: "login", component: Login, alias: ''},
                {path: "register",
                    redirect: 'login',
                    // component: Register,
                    props: true},
                {path: "register/success", component: RegisterSuccess, props: true},
                {path: "retrieve/first", component: Retrievef, props: true},
                {path: "retrieve/second", component: Retrieves, props: true},
                {path: "retrieve/success", component: RetrieveSuccess, props: true},
                ]
        },
        {
            path:"/board",component: MainFrame,
            children:[
                {path:"e",component:Jeditor_Ju,alias: '/'},
                {path:"e/:encode_drama_id",component:Jeditor_Ji,props:true},
                {path:"e/:encode_drama_id/allCards",component:jeditor_all_chang,props:true},
                {path:"e/:encode_drama_id/:encode_episode_id",component:Jeditor_changv2,props:true},
                // {path:"e2/:encode_drama_id/:encode_episode_id",component:Jeditor_changv2,props:true},
                {path:"e/:encode_drama_id/:encode_episode_id/:encode_scene_id",component:Jeditor_editor,props:true},
                {path:"faste/:encode_drama_id/:encode_episode_id/:encode_scene_id",component:jeditor_fast_editor,props:true},
                {path:"board/rm",component:Manager,
                    children:[
                        {path:"",redirect: "Character"},
                        {path:"Relation",component:Relation_Manager},
                        {path:"Character",component: Character_Manager}
                    ]
                },
                {path:"board/ed",component:ExternalDB},
                {path:"board/edf",component:ExternalDBFrame},
                {path:"building",component:Building},

                {path:"u",component:user_info},
            ]
        }
    ];
    const router=new VueRouter({routes});

    /** 验证用户是否登录 **/
    router.beforeEach((to,from,next) => {
            if(to.fullPath.split("/")[1]=='user'){
                next()
            }else{
                if(sessionStorage.getItem('token')){
                    $.ajax({
                        url:ROOT_HOST+"/user/UserIsLogin",
                        type:'POST',
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        data:JSON.stringify({"token":sessionStorage.getItem('token')}),
                        dataType:"json",
                        success : function(num){
                            console.log(num)
                            if(num.code==1001){
                                    next();
                                }else{
                                    alert('您的token已超时，请重新登录');
                                    next('/user');
                                }
                        },
                        error : function(xhr){
                            next('/user');
                        }
                    });
                }else{
                    next('/user');
                }
            }
    })
    export default {
        router,
        data(){
            return{

            }
        },
        mounted:function(){
        },
        methods: {


        }
    }
</script>

<style scoped>

</style>
