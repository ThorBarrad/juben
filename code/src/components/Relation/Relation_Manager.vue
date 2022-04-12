<template>
    <div>
        <div id="rmg_show_board" class="show_board list">
            <div class="new_btn btn" v-on:click="rmg_insert_tip">新建关系</div>
            <div class="save_msg_box btn" v-on:click="save">保存</div>
            <table>
                <thead>
                    <tr >
                        <th>所属剧目</th>
                        <th>主要人物</th>
                        <th>次要人物</th>
                        <th>人物关系</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr  v-for="(relation,index) in relation_data" :key="index">
                        <td>{{drama_data[relation.ju_name].drama_name}}</td>
                        <td>{{relation.main_character}}</td>
                        <td>{{relation.second_character}}</td>
                        <td>{{relation_type_data[relation.relationship-1].name}}</td>
                        <td class="operation">
                            <div class="alter" @click="rmg_change_tip">修改</div><div style="height: 22px;width: 2px;background: #EEE;float: left;margin: 0px 9px;"></div><div class="delete" v-on:click="rmg_delete_tip">删除</div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div id="rmp_show_board" class="show_board" style="width:calc(100% - 40px);height:50vh;">
            </div>
            <div id="rmg_tip_board" >
                <div id="insert_relation" class="msgBox" v-show="rmg_insert_tip_flag">
                    <div class="msg_title">新建关系</div>
                    <div class="btn close_btn" v-on:click="rmg_insert_tip_flag=false"></div>
                    <div class="form" id="new_form">
                        <div class="item">
                            <div class="item_title">所属剧目</div>
                            <div class="item_content">
                                <select type="text" class="drama_select" v-model="new_relation.ju_name">
                                    <option v-for="(drama,index) in drama_data" :value="index">{{drama.drama_name}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="item">
                            <div class="item_title">主要人物</div>
                            <div class="item_content">
                                <input class="tip_input" type="text" v-model="new_relation.main_character" @blur="rmg_check_character($event)">
                            </div>
                        </div>
                        <div class="item">
                            <div class="item_title">次要人物</div>
                            <div class="item_content">
                                <input class="tip_input" type="text" v-model="new_relation.second_character" @blur="rmg_check_character($event)">
                            </div>
                        </div>
                        <div class="item">
                            <div class="item_title">人物关系</div>
                            <div class="item_content">

                                <select type="text" class="relation_select" v-model="new_relation.relationship">
                                    <option v-for="(relation_type,index) in relation_type_data" :value="index+1">{{relation_type.name}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="item">
                            <div class="item_title">是否有向</div>
                            <div class="item_content" style="font-size: 12px;">
                                <input type="radio" name="insert_directed" value=1>是
                                <input type="radio" name="insert_directed" value=0 checked="true">否<br>
                            </div>
                        </div>
                    </div>
                    <div style="height:40px;margin:10px;margin-top:20px;">
                        <div class="left left_40"><div class="btn reset_btn" v-on:click="rmg_insert_clear">reset</div></div>
                        <div class="right right_60"><div class="btn submit_btn" v-on:click="rmg_insert_commit">submit</div></div>
                    </div>
                </div>
                <div id="change_relation"  class="msgBox" v-show="rmg_change_tip_flag">
                    <div class="msg_title">修改关系</div>
                    <div class="close_btn btn" v-on:click="rmg_change_tip_flag=false"></div>
                    <div class="form">
                    <div class="item">
                        <div class="item_title">所属剧目</div>
                        <div class="item_content">
                            <select type="text" class="drama_select" v-model="change_relation.ju_name">
                                <option v-for="(drama,index) in drama_data" :value="index">{{drama.drama_name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="item">
                        <div class="item_title">主要人物</div>
                        <div class="item_content">
                             <input class="tip_input" type="text" v-model="change_relation.main_character" @blur="rmg_check_character($event)">
                        </div>
                    </div>
                    <div class="item">
                        <div class="item_title">次要人物</div>
                        <div class="item_content">
                            <input class="tip_input" type="text" v-model="change_relation.second_character" @blur="rmg_check_character($event)">
                        </div>
                    </div>
                    <div class="item">
                        <div class="item_title">人物关系</div>
                        <div class="item_content">
                            <select type="text" class="relation_select" v-model="change_relation.relationship">
                                <option v-for="(relation_type,index) in relation_type_data" :value="index+1">{{relation_type.name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="item">
                        <div class="item_title">是否有向</div>
                        <div class="item_content">
                            <input type="radio" name="change_directed" value=1>是
                            <input type="radio" name="change_directed" value=0 checked="true">否<br>
                        </div>
                    </div>
                    </div>
                    <div style="height:40px;margin:10px;margin-top:20px;">
                        <div class="left left_40"><div class="btn reset_btn" v-on:click="rmg_change_clear">reset</div></div>
                        <div class="right right_60"><div class="btn submit_btn"  v-on:click="rmg_change_commit">submit</div></div>
                    </div>
                </div>
                <div id="delete_relation" class="msgBox" v-show="rmg_delete_tip_flag">
                    <div class="tip_delete">
                        您正在进行删除操作，删除后<br>
                        将无法恢复，是否继续？
                    </div>
                    <div style="height:40px;margin:10px;margin-top:20px;">
                        <div class="left left_40"><div class="btn reset_btn" v-on:click="rmg_delete_commit">确认</div></div>
                        <div class="right right_60"><div class="btn submit_btn" v-on:click="rmg_delete_tip_flag=false">取消</div></div>
                    </div>

                </div>
                <div id="character_insert" class="msgBox" v-show="rmg_character_insert_flag">
                    <div class="close_btn btn" v-on:click="rmg_character_insert_flag=false"></div>
                    <div class="form">
                        <div class="item">
                            <div class="tip_character">
                                您添加的关系中<span id="character_name" style="font-size: 15px;font-weight: bold;margin: 0px 5px;">{{temp_character_name}}</span>不存在<br>
                                自动创建新的人物？<br>
                                添加已有人物的别称？
                            </div>
                            <div class="item_content">
                            <select type="text" class="character_select" v-model="temp_character_index">
                                <option v-for="(character,index) in character_data" :value="index">{{character.name}}</option>
                            </select>
                            </div>
                        </div>
                    </div>
                    <div style="height:40px;margin:10px;margin-top:20px;">
                        <div class="left left_40"><div class="btn reset_btn" v-on:click="rmg_insert_character">创建</div></div>
                        <div class="right right_60"><div class="btn submit_btn" v-on:click="rmg_insert_other_name">添加</div></div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import "../../css/relation_manager.css";
    import "../../index.js"
    import echarts from 'echarts'
    const $=require("jquery");
    const Loadding = require("../../js/loadding").default.Loadding;
    export default {
        name:"Relation_Manager",
        data(){
            return{
                rmg_insert_tip_flag:false,
                rmg_change_tip_flag:false,
                rmg_delete_tip_flag:false,
                rmg_character_insert_flag:false,
                temp_character_name:"",
                temp_character_index:0,
                graph:null,
                new_relation:{
                    "id":0,
                    "ju_name":this.drama_index,
                    "main_character":"",
                    "second_character":"",
                    "relationship":0
                },
                change_relation:{
                    "id":0,
                    "ju_name":0,
                    "main_character":"",
                    "second_character":"",
                    "relationship":0
                },
                relation_row:null,
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
            this.draw_graph();
        },
        updated:function() {
            this.$nextTick(function(){
                this.draw_graph();
            })
        },
        methods: {
            rmg_insert_tip: function () {
                this.rmg_insert_clear();
                this.rmg_insert_tip_flag = true;
            },
            rmg_insert_clear: function () {
                this.new_relation.ju_name = this.drama_index;
                this.new_relation.main_character = "";
                this.new_relation.second_character = "";
            },
            rmg_insert_commit: function () {
                var nr = this.new_relation;
                var timestamp = Math.round(new Date().getTime() / 1000);
                var _main_cha = this.find_character(nr.main_character);
                var _second_cha = this.find_character(nr.second_character);
                if (_main_cha != -1 && _second_cha != -1) {
                    this.relation_data.push({
                        "id": timestamp,
                        "ju_name": nr.ju_name,
                        "main_character": nr.main_character,
                        "second_character": nr.second_character,
                        "relationship": nr.relationship
                    });
                    this.alter_list.push({
                        "op": 0,
                        "id": timestamp,
                        "drama": this.drama_data[nr.ju_name].id,
                        "main_character": _main_cha,
                        "second_character": _second_cha,
                        "relationship": this.relation_type_data[nr.relationship - 1].id
                    });
                } else {
                    alert("插入关系失败");
                }
                this.rmg_insert_tip_flag = false;
                console.log(this.relation_data);
            },
            rmg_change_tip: function (e) {
                var row = e.toElement.parentNode.parentNode;
                this.relation_row = row.rowIndex;
                this.rmg_change_tip_flag = true;
                this.rmg_change_clear();
            },
            rmg_change_clear: function () {
                var row = this.relation_row - 1;
                this.change_relation.ju_name = this.relation_data[row].ju_name;
                this.change_relation.main_character = this.relation_data[row].main_character;
                this.change_relation.second_character = this.relation_data[row].second_character;
                this.change_relation.relationship = this.relation_data[row].relationship;
            },
            rmg_change_commit: function () {
                var row = this.relation_row - 1;
                var _main_cha = this.find_character(this.change_relation.main_character);
                var _second_cha = this.find_character(this.change_relation.second_character);
                if (_main_cha != -1 && _second_cha != -1) {
                    this.relation_data[row].ju_name = this.change_relation.ju_name;
                    this.relation_data[row].main_character = this.change_relation.main_character;
                    this.relation_data[row].second_character = this.change_relation.second_character;
                    this.relation_data[row].relationship = this.change_relation.relationship;
                    var length = this.alter_list.length;
                    for (var i = length - 1; i >= 0; i--) {
                        if (this.alter_list[i].id == this.relation_data[row].id && this.alter_list[i].drama == this.drama_data[this.relation_data[row].ju_name].id && this.alter_list[i].op == 1) {
                            this.alter_list.splice(i, 1);
                            break;
                        }
                    }
                    this.alter_list.push({
                        "op": 1,
                        "id": this.relation_data[row].id,
                        "drama": this.drama_data[this.change_relation.ju_name].id,
                        "main_character": _main_cha,
                        "second_character": _second_cha,
                        "relationship": this.relation_type_data[this.change_relation.relationship - 1].id
                    });
                } else {
                    alert("修改关系失败");
                }
                this.rmg_change_tip_flag = false;
            },
            rmg_delete_tip: function (e) {
                var row = e.toElement.parentNode.parentNode.rowIndex;
                this.relation_row = row;
                this.rmg_delete_tip_flag = true;
            },
            rmg_delete_commit: function () {
                var row = this.relation_row - 1;
                var flag = false;
                var length = this.alter_list.length;
                for (var i = length - 1; i >= 0; i--) {
                    if (this.alter_list[i].id == this.relation_data[row].id && this.alter_list[i].drama == this.drama_data[this.relation_data[row].ju_name].id) {
                        if (this.alter_list[i].op == 0) {
                            flag = true;
                            this.alter_list.splice(i, 1);
                            break;
                        } else if (this.alter_list[i].op == 1) {
                            this.alter_list.splice(i, 1);
                        }
                    }
                }
                if (!flag)
                    this.alter_list.push({
                        "op": 2,
                        "id": this.relation_data[row].id,
                        "drama": this.drama_data[this.relation_data[row].ju_name].id
                    });
                this.relation_data.splice(row, 1);
                this.rmg_delete_tip_flag = false;
            },
            rmg_check_character: function (e) {
                name = e.target.value;
                if (name == "")
                    return;
                for (var i = 0; i < this.character_data.length; i++) {
                    if (this.character_data[i].name == name || this.character_data[i].other_name.search(name) != -1) {
                        return;
                    }
                }
                this.temp_character_name = name;
                this.rmg_character_insert_flag = true;
                return;
            },
            find_character_name: function (id) {
                for (var i = 0; i < this.character_data.length; i++) {
                    if (this.character_data[i].id == id)
                        return this.character_data[i].name;
                }
            },
            rmg_insert_character: function () {
                var timestamp = Math.round(new Date().getTime() / 1000);
                this.character_data.push({
                    "id": timestamp,
                    "drama": this.drama_data[this.drama_index].id,
                    "character_identities": "",
                    "name": this.temp_character_name,
                    "age": null,
                    "birth": null,
                    "gender": "",
                    "other_name": ""
                });
                this.alter_list.push({
                    "op": 3, "id": timestamp,
                    "drama": this.drama_data[this.drama_index].id,
                    "character_identities": "",
                    "name": this.temp_character_name,
                    "age": null,
                    "birth": null,
                    "gender": "",
                    "other_name": ""
                });
                this.rmg_character_insert_flag = false;
            },
            rmg_insert_other_name: function (e) {
                var character_index = this.temp_character_index;
                this.character_data[character_index].other_name += this.temp_character_name + ";"
                for (var i = length - 1; i >= 0; i--) {
                    if (this.alter_list[i].id == this.character_data[character_index].id && this.alter_list[i].drama == this.drama_data[this.drama_index].id && this.alter_list[i].op == 4) {
                        this.alter_list.splice(i, 1);
                        break;
                    }
                }
                this.alter_list.push({
                    "op": 4, "id": this.character_data[character_index].id,
                    "drama": this.drama_data[this.drama_index].id,
                    "character_identities": tthis.character_data[character_index].character_identities,
                    "name": this.character_data[character_index].name,
                    "age": this.character_data[character_index].age,
                    "birth": this.character_data[character_index].birth,
                    "gender": this.character_data[character_index].gender,
                    "other_name": this.character_data[character_index].other_name
                });
                this.rmg_character_insert_flag = false;
            },
            save: function () {
                var that = this;
                var loadding = new Loadding();
                loadding.add_title("保存中");
                loadding.__init__();
                loadding.add_process(
                    "上传修改内容",
                    function () {
                        $.ajax({
                            url: ROOT_HOST + "/relation/api/relation_commit",
                            type: 'POST',
                            async: false,
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
            find_character: function (name) {
                for (var i = 0; i < this.character_data.length; i++) {
                    if (this.character_data[i].name == name || this.character_data[i].other_name.search(name) != -1) {
                        return this.character_data[i].id;
                    }
                }
                return -1;
            },
            draw_graph: function () {
                this.graph = echarts.init(document.getElementById("rmp_show_board"));
                var option;
                var that = this;
                this.graph.setOption(option = {
                    animationDurationUpdate: 500,
                    animationEasingUpdate: 'quinticInOut',
                    series: [
                        {
                            type: 'graph',
                            layout: 'force',
                            force: {
                                gravity: 0.01,
                                edgeLength: 100,
                                repulsion: 300
                            },
                            data: this.character_data.map(function (node) {
                                return {
                                    x: null,
                                    y: null,
                                    draggable: false,
                                    name: node.name,
                                    id: node.name,
                                    symbolSize: 25,
                                    label: {
                                        position: 'right',
                                        show: true
                                    },
                                    itemStyle: {
                                        normal: {
                                            color: '#19ab24',
                                            opacity: 0.8,
                                            borderColor: '#fff',
                                            borderWidth: 1,
                                            shadowBlur: 5,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                }
                            }),
                            links: this.relation_data.map(function (edge) {
                                return {
                                    source: edge.main_character,
                                    target: edge.second_character,
                                    label: {
                                        show: true,
                                        formatter: function (value) {
                                            return that.relation_type_data[edge.relationship - 1].name;
                                        }
                                    },
                                    lineStyle: {
                                        normal: {
                                            color: '#19ab24',
                                            opacity: 0.5,
                                            width: 2,
                                            curveness: 0.1
                                        }
                                    }
                                }
                            }),
                            roam: true,
                            focusNodeAdjacency: true,
                        }
                    ]
                }, true);
            },
        },
    }
</script>
<style scoped>

</style>
