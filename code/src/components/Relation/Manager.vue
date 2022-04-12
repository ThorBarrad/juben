<template>
    <div id="all_board">
        <div id="top_title">

            <div class="title" id="rm" v-on:click="torm">人物管理</div>
            <div class="title" id="rmg" v-on:click="tormg">人物关系管理</div>
        </div>
        <div id="search">
            <el-input type="text" id="search_input" style="width: calc(100% - 100px);float:left;" />
            <input type="button" id="search_btn" class="btn" value="搜索" />
        </div>
        <div id="ju_select">
            <div class="select_title">请选择剧目</div>
            <select type="text" id="select_input" class="drama_select" v-model="drama_index" v-on:change="change_drama">
                <option v-for="(drama,index) in drama_data" :value="index">{{drama.drama_name}}</option>
            </select>
        </div>
        <router-view :drama_index="drama_index" :drama_data="drama_data" :relation_type_data="relation_type_data" :relation_data="relation_data" :character_data="character_data" :alter_list="alter_list"></router-view>
    </div>
</template>

<script>
    import "../../css/relation_manager.css";
    import "../../index.js"
    import Character_Manager from "./Character_Manager.vue";
    import Relation_Manager from "./Relation_Manager.vue";
    const $=require("jquery");
    const Loadding = require("../../js/loadding").default.Loadding;
    export default {
        name: "Manager",
        components: {
            Character_Manager:Character_Manager,
            Relation_Manager:Relation_Manager
        },
        data(){
            return{
                drama_index:0,
                drama_data:[],
                relation_type_data:[],
                character_data:[],
                relation_data:[],
                alter_list:[],
            }
        },
        beforeRouteLeave(to, from, next){
            if (this.alter_list.length!=0){
                const answer = window.confirm('请确定数据是否保存，确定要离开？')
                if (answer) {
                    next()
                } else {
                    next(false)
                }
            }else{
                next()
            }
        },
        mounted:function() {
            var that=this;
            var loadding = new Loadding();
            loadding.add_title("初始化");
            loadding.__init__();
                loadding.add_process(
                    "加载剧场列表",
                    function () {
                        $.ajax({
                            url: ROOT_HOST + "/relation/api/drama",
                            type: 'POST',
                            async: false,
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            success: function (data) {
                                that.drama_data = data.drama;
                                that.relation_type_data = data.relation;
                            },
                            error: function (xhr) {
                            }
                        });
                    }
                );
            // if (!that.get_drama_local_storage()) {
                loadding.add_process(
                    "加载关系列表",
                    that.change_drama_loading
                );
            // }
            loadding.start();
            // window.onbeforeunload = function (e) {
            //     that.set_drama_local_storage();
            //     that.set_total_local_storage();
            // };
        },
        methods:{
            torm:function(){
                if (this.$router.currentRoute.path!="/board/rm/Character")
                    this.$router.push("Character");
            },
            tormg:function(){
                if (this.$router.currentRoute.path!="/board/rm/Relation")
                    this.$router.push("Relation");
            },
            find_character_name:function(id){
                console.log(id);
                for (var i=0;i<this.character_data.length;i++)
                {
                    if (this.character_data[i].id==id)
                        return this.character_data[i].name;
                }
            },
            change_drama:function(){
                var that=this;
                var first_loadding = new Loadding();
                first_loadding.add_title("加载中");
                first_loadding.__init__();
                first_loadding.add_process(
                    "加载关系列表",
                    this.change_drama_loading
                );
                first_loadding.start();
            },
            change_drama_loading:function(){
                var that=this;
                if (that.drama_data.length>0) {
                    var id = this.drama_data[this.drama_index].id;
                    $.ajax({
                        url: ROOT_HOST + "/relation/api/drama_relation/" + id,
                        type: 'POST',
                        async: false,
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        success: function (data) {
                            that.character_data = data.character;
                            that.relation_data = data.relation;
                            for (var i = 0; i < that.relation_data.length; i++) {
                                that.relation_data[i].ju_name = that.drama_index;
                                that.relation_data[i].main_character = that.find_character_name(that.relation_data[i].main_character);
                                that.relation_data[i].second_character = that.find_character_name(that.relation_data[i].second_character);
                            }
                            that.set_drama_local_storage();
                        },
                        error: function (xhr) {
                        }
                    });
                }
            },
            get_drama_local_storage:function () {
                var relation_data=sessionStorage.getItem("relation_list");
                var character_data=sessionStorage.getItem("character_list");
                var alter_list=sessionStorage.getItem("alter_list");
                if (relation_data!=null && character_data!=null && alter_list!=null)
                {
                    this.drama_index=sessionStorage.getItem("drama_index");
                    this.relation_data=JSON.parse(relation_data);
                    this.character_data=JSON.parse(character_data);
                    this.alter_list=JSON.parse(alter_list);
                    console.log(this.drama_index,this.relation_data,this.character_data);
                    return true;
                }
                return false;
            },
            set_drama_local_storage:function () {
                window.sessionStorage.setItem("relation_list",JSON.stringify(this.relation_data));
                window.sessionStorage.setItem("character_list",JSON.stringify(this.character_data));
                window.sessionStorage.setItem("alter_list",JSON.stringify(this.alter_list));
                window.sessionStorage.setItem("drama_index",this.drama_index);
            },
            set_total_local_storage:function () {
                window.sessionStorage.setItem("drama_list",JSON.stringify(this.drama_data));
                window.sessionStorage.setItem("relation_type_list",JSON.stringify(this.relation_type_data));
            },
            get_total_local_storage:function () {
                var drama_data=sessionStorage.getItem("drama_list");
                var relation_type_data=sessionStorage.getItem("relation_type_list");
                if (drama_data!=null && relation_type_data!=null)
                {
                    this.drama_data=JSON.parse(drama_data);
                    console.log(this.drama_data);
                    this.relation_type_data=JSON.parse(relation_type_data);
                    return true;
                }
                return false;
            },
        }
    }
</script>

<style scoped>

</style>
