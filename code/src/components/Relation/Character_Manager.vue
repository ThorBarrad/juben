<template>
    <div id="rm_show_board" class="show_board">
        <div class="new_btn btn" v-on:click="rm_insert_tip">新建人物</div>
        <div class="save_msg_box btn" v-on:click="save">保存</div>
        <table >
            <thead>
            <tr >
                <th>人物名称</th>
                <th>人物身份</th>
                <th>出身日</th>
                <th>性别</th>
                <th>别称</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr  v-for="(character,index) in character_data" :key="index">
                <td>{{character.name}}</td>
                <td>{{character.character_identities}}</td>
                <td>{{character.birth}}</td>
                <td>{{character.gender}}</td>
                <td>{{character.other_name}}</td>
                <td class="operation">
                    <div class="alter" @click="rm_change_tip">修改</div><div style="height: 22px;width: 2px;background: #EEE;float: left;margin: 0px 9px;"></div><div class="delete" v-on:click="rm_delete_tip">删除</div>
                </td>
            </tr>
            </tbody>
        </table>
        <div id="rm_tip_board">
            <div id="rm_insert_character" class="msgBox"  v-show="rm_insert_tip_flag">
                <div class="msg_title">新建人物</div>
                <div class="close_btn btn" v-on:click="rm_insert_tip_flag=false"></div>
                <div class="form">
                    <div class="item">
                        <div class="item_title">人物名称</div>
                        <div class="item_content">
                            <input class="tip_input" type="text" v-model="new_character.name">
                        </div>
                    </div>
                    <div class="item">
                        <div class="item_title">人物身份</div>
                        <div class="item_content">
                            <input class="tip_input" type="text" v-model="new_character.character_identities">
                        </div>
                    </div>
                    <div class="item">
                        <div class="item_title">出生日</div>
                        <div class="item_content">
                            <input class="tip_input" type="text" v-model="new_character.birth">
                        </div>
                    </div>
                    <div class="item">
                        <div class="item_title">性别</div>
                        <div class="item_content">
                            <input class="tip_input" type="text" v-model="new_character.gender">
                        </div>
                    </div>
                    <div class="item">
                        <div class="item_title">别称</div>
                        <div class="item_content">
                            <input class="tip_input" type="text" v-model="new_character.other_name">
                        </div>
                    </div>
                </div>
                <div style="height:40px;margin:10px;margin-top:20px;">
                    <div class="left left_40"><div class="btn reset_btn" v-on:click="rm_insert_clear">reset</div></div>
                    <div class="right right_60"><div class="btn submit_btn" v-on:click="rm_insert_commit">confirm</div></div>
                </div>

            </div>
            <div id="rm_change_character" class="msgBox" v-show="rm_change_tip_flag">
                <div class="msg_title">修改人物</div>
                <div class="close_btn btn" v-on:click="rm_change_tip_flag=false"></div>
                <div class="form">
                    <div class="item">
                        <div class="item_title">人物名称</div>
                        <div class="item_content">
                            <input class="tip_input" type="text" v-model="change_character.name">
                        </div>
                    </div>
                    <div class="item">
                        <div class="item_title">人物身份</div>
                        <div class="item_content">
                            <input class="tip_input" type="text" v-model="change_character.character_identities">
                        </div>
                    </div>
                    <div class="item">
                        <div class="item_title">出生日</div>
                        <div class="item_content">
                            <input class="tip_input" type="text" v-model="change_character.birth">
                        </div>
                    </div>
                    <div class="item">
                        <div class="item_title">性别</div>
                        <div class="item_content">
                            <input class="tip_input" type="text" v-model="change_character.gender">
                        </div>
                    </div>
                    <div class="item">
                        <div class="item_title">别称</div>
                        <div class="item_content">
                            <input class="tip_input" type="text" v-model="change_character.other_name">
                        </div>
                    </div>
                </div>
                <div style="height:40px;margin:10px;margin-top:20px;">
                    <div class="left left_40"><div class="btn reset_btn" v-on:click="rm_change_clear">reset</div></div>
                    <div class="right right_60"><div class="btn submit_btn"  v-on:click="rm_change_commit">confirm</div></div>
                </div>
            </div>
            <div id="delete_character" class="msgBox" v-show="rm_delete_tip_flag">
                <div class="tip_delete">
                    您正在进行删除操作，即将删除人物和人物相关关系删除后，将无法恢复，是否继续？
                </div>
                <div style="height:40px;margin:10px;margin-top:20px;">
                    <div class="left left_40"><div class="btn reset_btn" v-on:click="rm_delete_commit">确认</div></div>
                    <div class="right right_60"><div class="btn submit_btn"  v-on:click="rm_delete_tip_flag=false">取消</div></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import "../../css/relation_manager.css";
    import "../../index.js"
    const $=require("jquery");
    const Loadding = require("../../js/loadding").default.Loadding;
    export default {
        name:"Character_Manager",
        data(){
            return{
                rm_insert_tip_flag:false,
                rm_change_tip_flag:false,
                rm_delete_tip_flag:false,
                temp_character_name:"",
                temp_character_index:0,
                new_character:{
                    "id":0,
                    "drama":0,
                    "character_identities":"",
                    "name":"",
                    "age":null,
                    "birth":null,
                    "gender":"",
                    "other_name":""
                },
                change_character:{
                    "id":0,
                    "drama":0,
                    "character_identities":"",
                    "name":"",
                    "age":null,
                    "birth":null,
                    "gender":"",
                    "other_name":""
                },
                character_row:null,
                operations:["insert_relation","change_relation","delete_relation","insert_character","change_character","delete_character"]
            }
        },
        props:{
            drama_index:{require:true},
            drama_data:{require:true},
            relation_type_data:{equire:true},
            character_data:{require:true},
            relation_data:{require:true},
            alter_list:{require:true},
        },
        mounted:function(){

        },
        methods:{
            rm_insert_tip:function(){
                this.rm_insert_clear();
                this.rm_insert_tip_flag=true;
            },
            rm_insert_clear:function(){
                this.new_character.name="";
                this.new_character.birth="";
                this.new_character.character_identities="";
                this.new_character.gender="";
                this.new_character.other_name="";
            },
            rm_insert_commit:function(){
                var timestamp=Math.round(new Date().getTime()/1000);
                this.character_data.push({
                    "id": timestamp,
                    "drama": this.drama_data[this.drama_index].id,
                    "character_identities":this.new_character.character_identities,
                    "name":this.new_character.name,
                    "age":this.new_character.age,
                    "birth":this.new_character.birth,
                    "gender":this.new_character.gender,
                    "other_name":this.new_character.other_name
                });
                this.alter_list.push({
                    "op": 3,
                    "id": timestamp,
                    "drama": this.drama_data[this.drama_index].id,
                    "character_identities":this.new_character.character_identities,
                    "name":this.new_character.name,
                    "age":this.new_character.age,
                    "birth":this.new_character.birth,
                    "gender":this.new_character.gender,
                    "other_name":this.new_character.other_name
                });
                this.rm_insert_tip_flag=false;
            },
            rm_change_tip:function(e){
                var row=e.toElement.parentNode.parentNode;
                this.character_row=row.rowIndex;
                this.rm_change_tip_flag=true;
                this.rm_change_clear();
            },
            rm_change_clear:function(){
                var row=this.character_row-1;
                this.change_character.name=this.character_data[row].name;
                this.change_character.birth=this.character_data[row].birth;
                this.change_character.age=this.character_data[row].age;
                this.change_character.character_identities=this.character_data[row].character_identities;
                this.change_character.gender=this.character_data[row].gender;
                this.change_character.other_name=this.character_data[row].other_name;
            },
            rm_change_commit:function(){
                var row=this.character_row-1;
                var name=this.character_data[row].name;
                this.character_data[row].name=this.change_character.name;
                this.character_data[row].birth=this.change_character.birth;
                this.character_data[row].age=this.change_character.age;
                this.character_data[row].character_identities=this.change_character.character_identities;
                this.character_data[row].gender=this.change_character.gender;
                this.character_data[row].other_name=this.change_character.other_name;
                var length=this.alter_list.length;
                for (var i=length-1;i>=0;i--) {
                    if (this.alter_list[i].id == this.character_data[row].id && this.alter_list[i].drama == this.character_data[row].drama && this.alter_list[i].op == 4) {
                        this.alter_list.splice(i, 1);
                        break;
                    }
                }
                var count=this.relation_data.length;
                for (var i=0;i<count;i++){
                    if (this.relation_data[i].main_character==name || this.character_data[row].other_name.search(this.relation_data[i].main_character)!=-1){
                        this.relation_data[i].main_character=this.change_character.name;
                    }
                    else if(this.relation_data[i].second_character==name || this.character_data[row].other_name.search(this.relation_data[i].second_character)!=-1){
                        this.relation_data[i].second_character=this.change_character.name;
                    }
                }
                this.alter_list.push({
                    "op": 4,
                    "id": this.character_data[row].id,
                    "drama": this.character_data[row].drama,
                    "character_identities":this.change_character.character_identities,
                    "name":this.change_character.name,
                    "age":this.change_character.age,
                    "birth":this.change_character.birth,
                    "gender":this.change_character.gender,
                    "other_name":this.change_character.other_name
                });
                this.rm_change_tip_flag=false;
            },
            rm_delete_tip:function(e){
                var row=e.toElement.parentNode.parentNode.rowIndex;
                this.character_row=row;
                this.rm_delete_tip_flag=true;
            },
            rm_delete_commit:function(){
                var row=this.character_row-1;
                var name=this.character_data[row].name;
                var count=this.relation_data.length;
                for (var i=0;i<count;){
                    if (this.relation_data[i].main_character==name || this.relation_data[i].second_character==name || this.character_data[row].other_name.search(this.relation_data[i].main_character) || this.character_data[row].other_name.search(this.relation_data[i].second_character)){
                        this.relation_data.splice(i,1)
                        count--;
                    }
                    else{
                        i++;
                    }
                }
                this.alter_list.push({"op":5,"id":this.character_data[row].id,"drama":this.character_data[row].drama});
                this.character_data.splice(row,1);
                this.rm_delete_tip_flag=false;
            },
            save:function(){
                var that=this;
                var loadding = new Loadding();
                loadding.add_title("保存中");
                loadding.__init__();
                loadding.add_process(
                    "上传修改内容",
                    function() {
                        $.ajax({
                            url: ROOT_HOST + "/relation/api/relation_commit",
                            type: 'POST',
                            async:false,
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify({"list": that.alter_list}),
                            success: function () {
                                that.alter_list.splice(0,that.alter_list.length);
                            },
                            error: function (xhr) {
                            }
                        });
                    }
                );
                loadding.start();
            },

        }
    }
</script>

<style scoped>

</style>
