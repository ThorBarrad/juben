<template>
    <div class="main_board">
        <div class="center_main">
            <div class="backto iconfont" v-on:click="$router.push('/board/e/'+encode(drama_id) +'/allCards');">&#xe6a8;</div>
            <div class="searchbar">
                <el-select
                        @keyup.enter.native="(searchcontent==''?null:$router.push('/board/e/'+encode(drama_id) + '/'+encode(searchcontent)))"
                        class="search_input"
                        v-model="searchcontent"
                        filterable
                        placeholder="请输入剧本名称"
                >
                    <el-option
                            style="width: 100%;"
                            v-for="item in episode_data"
                            :key="item.id"
                            :label="item.episode_name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <div class="search_btn">
                    <div class="btn" @click="(searchcontent==''?null:$router.push('/board/e/'+encode(drama_id) + '/'+encode(searchcontent)))">Search</div>
                </div>
            </div>
            <div class="item_board">
                <div class="jumu_item" id="new_add_jumu_item">
                    <div class="title" id="new_jumu" style="cursor:pointer;" v-on:click="add_new_show=true;">新建剧集</div>
                    <div class="hidden_menu">
                        <div class="btn" style="width:100%;">上传</div>
                    </div>
                </div>
                <div style="height:180px;width:2px;background:#ddd;margin:20px 10px;"></div>
                <div class="jumu_item" v-for="episode in episode_data" :key="episode.id" @dblclick="$router.push('/board/e/'+encode(episode.drama_id) + '/'+encode(episode.id))">
                    <div v-on:click="$router.push('/board/e/'+encode(episode.drama_id) + '/'+encode(episode.id))" class="title">{{episode.episode_name}}</div>
                    <div class="c_time">{{episode.c_time}}</div>
                    <div class="hidden_menu">
                        <div class="btn"><a class="hidden_a" :href="ROOT_HOST+'/tool/downloadword/'+(new Date()).getTime()+'/'+drama_id+'/'+episode.id">下载</a></div>
                        <div class="btn"  v-on:click="show_edit(episode.id)">编辑</div>
                        <div class="btn" v-on:click="show_delete(episode.id)">删除</div>
                    </div>
                    
                </div>
                <!-- <div class='shuju'>
                    <el-button plain @click="open2">
                        页面详情
                    </el-button>
                </div> -->
            </div>
        </div>
        <div class="msgBox" id="add_new_juji_board" v-show="add_new_show">
            <div class="btn close_btn"  v-on:click="add_new_show=false"></div>
            <div class="title">新建剧目</div>
            <div class="form" id="new_form">

                <div class="item">
                    <div class="item_title">剧目名称</div>
                    <div class="item_content">
                        <input type="text" v-model="new_episode.episode_name" name="episode_name">
                    </div>
                </div>
                <div class="item">
                    <div class="item_title">主要角色</div>
                    <div class="item_content">
                        <input type="text" v-model="new_episode.main_roles" name="main_roles">
                    </div>
                </div>
                <div class="item">
                    <div class="item_title">剧集序号</div>
                    <div class="item_content">
                        <input type="text" v-model="new_episode.episode_rank"  name="episode_rank">
                    </div>
                </div>
            </div>

            <div style="height:40px;margin:10px;margin-top:20px;">
                <div class="left left_40"><div class="btn reset_btn" v-on:click="reset(new_episode)">reset</div></div>
                <div class="right right_60"><div class="btn submit_btn"  v-on:click="add_new">submit</div></div>
            </div>
        </div>
        <div class="msgBox" id="edit_juji_board" v-show="edit_show">
            <div class="btn close_btn"  v-on:click="edit_show=false"></div>
            <div class="title">编辑剧集</div>
            <div class="form">

                <div class="item">
                    <div class="item_title">剧集名称</div>
                    <div class="item_content">
                        <input type="text" v-model="edit_episode.episode_name" name="episode_name">
                    </div>
                </div>
                <div class="item">
                    <div class="item_title">主要角色</div>
                    <div class="item_content">
                        <input type="text" v-model="edit_episode.main_roles" name="main_roles">
                    </div>
                </div>
                <div class="item">
                    <div class="item_title">剧集序号</div>
                    <div class="item_content">
                        <input type="text" v-model="edit_episode.episode_rank"  name="episode_rank">
                    </div>
                </div>
            </div>

            <div style="height:40px;margin:10px;margin-top:20px;">
                <div class="left left_40"><div class="btn reset_btn" v-on:click="reset_from(edit_episode,episode_data[episode_data_map[edit_episode.id]])">reset</div></div>
                <div class="right right_60"><div class="btn submit_btn" v-on:click="edit">submit</div></div>
            </div>
        </div>

        <div class="msgBox" id="question_board" v-show="delete_show" style="border-top: 5px solid #F44336;">
            <div style="text-align: justify;
            font-size: 18px;
            font-weight: 900;
            padding: 15px 50px;">你正在进行删除操作，删除后文件无法恢复，是否继续？</div>


            <div style="height:40px;margin:10px;margin-top:20px;">
                <div class="left left_40"><div class="btn delete_btn" v-on:click="delete_episode">delete</div></div>
                <div class="right right_60"><div class="btn cancel_btn" v-on:click="delete_show=false;">cancel</div></div>
            </div>
        </div>
    </div>
</template>

<script>
import "../../css/jeditor.css";
import "../../index"
const $=require("jquery");
const Loadding = require("../../js/loadding").default.Loadding;
const base = require("../../js/base").default;
export default {
    props:["encode_drama_id"],
    data(){
        return{
            drama_id:0,
            ROOT_HOST:ROOT_HOST,
            searchcontent:"",
            episode_data:[],
            episode_data_map:{},
            add_new_show:false,
            form_cover:false,
            delete_show:false,
            edit_show:false,
            need_to_delete:-1,
            new_episode:{
                "episode_name":"",
                "main_roles":"",
                "episode_rank":"",
            },
            edit_episode:{
                "id":"",
                "episode_name":"",
                "main_roles":"",
                "episode_rank":"",
            }
        }
    },
    mounted:function(){
        base.reset_rightboard_width();
        var that = this;
        this.drama_id=window.atob(this.encode_drama_id);
        var first_loadding = new Loadding();
        first_loadding.add_title("初始化");
        first_loadding.__init__();
        first_loadding.add_process(
            "拉取数据",
            function(){
                $.ajax({
                    type:"POST",
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    url: ROOT_HOST+ "/jeditor/api/episode/"+that.drama_id,
                    async:false,
                    dataType:"json",
                    success:function(returndata){
                        //console.log("这是returndata")
                        //console.log(returndata)
                        that.episode_data = returndata.episode;
                        //console.log("这是剧集数据")
                        //console.log(that.episode_data)
                        that.save_character_data(returndata.character);
                        console.log("这是人物角色数据")
                        console.log(returndata.character)
                        //console.log(returndata)
                        for(var i=0;i<returndata.episode.length;i++){
                            that.episode_data_map[returndata.episode[i].id]=i;
                        }
                    }
                });
                //console.log(that.episode_data);
            }
        );
        first_loadding.start();

    },
    methods:{
        save_character_data:function(characters){
            if (sessionStorage.getItem("character_list")==null || sessionStorage.getItem("current_drama_id") != this.drama_id)
            {
                window.sessionStorage.setItem("character_list",JSON.stringify(characters));
                window.sessionStorage.setItem("current_drama_id", this.drama_id);
            }
        },
        show_delete:function(id){
            if(id == -1){return;}
            this.need_to_delete = id;
            this.delete_show=true;
        },
        open2() {
            this.$notify.info({
                title: '当前剧集总数为',
                message: this.episode_data.length,
                offset: 300,
            });
        },
        reset_from:function(item1,item2){
            console.log(item1,item2)
            for(let i in item2){item1[i]=item2[i];}
        },
        delete_episode:function(){
            if(this.need_to_delete == -1){return;}
            var that = this;
            var id = that.need_to_delete;

            var del_loadding=new Loadding();
            del_loadding.add_title("删除剧集");
            del_loadding.__init__();
            del_loadding.add_process(
                "删除",
                function(){
                    $.ajax({
                        type:"POST",
xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
url: ROOT_HOST + "/jeditor/api/deleteepisode/"+that.drama_id + "/" + id,
                        async:true,
                        success:function(returndata){
                            console.log(returndata);
                        }
                    })
                }
            );
            del_loadding.start(function(){
                for(var i = 0; i <= that.episode_data.length; i++){
                    if(that.episode_data[i].id == id){
                        that.episode_data.splice(i, 1);
                        that.delete_show = false;
                        break;
                    }
                }
                delete that.episode_data_map[id];
            });


        },
        show_edit:function(id){
            if(id==-1){
                return;
            }
            this.need_to_edit_id=id;
            console.log(id,this.episode_data,this.episode_data_map);
            for(var key in this.episode_data[this.episode_data_map[id]]){
                this.edit_episode[key]=this.episode_data[this.episode_data_map[id]][key];
            }
            this.edit_show=true;
        },
        edit:function(){
            if(this.need_to_edit_id == -1){
                return false;
            }
            var id=this.need_to_edit_id;
            var that=this;
            var ud_loadding=new Loadding();
            ud_loadding.add_title("更新剧集");
            ud_loadding.__init__();
            ud_loadding.add_process(
                "更新",
                function(){
                    $.ajax({
                        type:"POST",
xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
url:ROOT_HOST + "/jeditor/api/updateepisode/"+that.drama_id + "/"+id,
                        data:JSON.stringify(that.edit_episode),
                        dataType:"json",
                        async:false,
                        success:function(returndata){
                            console.log(returndata);
                        }
                    })
                }
            );
            ud_loadding.start(function(){
                for(var key in that.edit_episode){
                    that.episode_data[that.episode_data_map[that.edit_episode.id]][key]=that.edit_episode[key];
                }
                that.edit_show=false;
                that.reset(that.edit_episode);
            });

        },
       reset:function(item){
           for(var i in item){item[i] = ""}
       },
       add_new:function(){
           var that = this;
           var new_form = $("#new_form");
            var items = new_form.find(".item input");
            for(var i = 0; i < items.length; i ++ ){
                if(items[i].value.length == 0){
                    items[i].style.border = "2px dashed #E57373";
                    setTimeout(function(){
                        items[i].style.border = "0px dashed transparent";
                    },1000);
                    return;
                }
            }
            if(!parseInt(items[2].value)){
                items[2].style.border = "2px dashed #E57373";
                setTimeout(function(){
                    items[2].style.border = "0px dashed transparent";
                },1000);
                return;
            }
            var add_loadding=new Loadding();
            add_loadding.add_title("新建剧目");
            add_loadding.__init__();
            add_loadding.add_process(
                "新建",
                function(){
                    $.ajax({
                        type:"POST",
xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
url: ROOT_HOST + "/jeditor/api/createepisode/" + that.drama_id,

                        contentType:'application/json;charset=UTF-8',
                        data:JSON.stringify(that.new_episode),
                        async:false,
                        dataType:"json",
                        success:function(returndata){
                            that.episode_data.push(returndata);
                            that.episode_data_map[returndata.id]=that.episode_data.length-1;
                            that.reset(that.new_episode);
                        }
                    })
                }
            );
            add_loadding.start(function(){that.add_new_show = false;});

       },
        encode:function(code){
            return window.btoa(code);
        }
    }
}
</script>
<style scoped>
.shuju{
    position:absolute;
    right:20px;
    bottom:20px;
}
</style>
