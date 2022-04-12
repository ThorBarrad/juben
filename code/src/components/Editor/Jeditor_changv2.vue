<template>
    <div class="main_board">
        <div class="center_main" id="juji_center">
            <div id='float_board' v-show="frame_show" :class="(frame_hidden?'hidden':'')"
                :style="{
                height:float_frames.height,
                minHeight:float_frames.minHeight,
                width:float_frames.width,
                minWidth:float_frames.minWidth,
                top:float_frames.top,
                left:float_frames.left,
                bottom:float_frames.bottom,
                right:float_frames.right,
                }"
                
                >
                <div class="hidden_circle" v-on:click="frame_hidden=false" :style="{backgroundImage:'url('+float_frames.icon+')'}"></div>
                <div class="top_line">
                    <div class="dragger_haddle"></div>
                    <!-- <el-dropdown trigger="click" style="float:left;" @command="handleFrameCommand">
                            <div class="choices_btn"><i class="el-icon-plus"></i></div>

                    <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-bind:command="{'type':'frame','params':frame.idx}" v-for="frame in float_frames" :key="frame.idx"><div class="little_icon" :style="{backgroundImage:'url('+frame.icon+')'}"></div>{{frame.name}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown> -->
                    <div class="hidden_btn" v-on:click="frame_hidden=true;fast_url=''"><i class="el-icon-minus"></i></div>
                    <!-- <div class="close_btn" v-on:click="frame_closed=true;"><i class="el-icon-close"></i></div> -->
                </div>
                <div class="main_board"  v-loading="true" >
                    <iframe :src="fast_url"></iframe>
                </div>
            </div>
            <div class="backto iconfont"  style="float:left;" v-on:click="$router.push('/board/e/'+encode(drama_id));">&#xe6a8;</div>
            <div class="save-btn iconfont" v-on:click="save_graph">&#xe6bd; 保存</div>
            <!-- <script>
                $(".backto").on("click",function(){
                    backto("/jeditor/drama/" + drama_id);
                })
            </script> -->
            <div id="chang_board" >
                <div id="chang_main_board" style="position:relative;">
                    <div class="tools_bar" style="height:30px;box-shadow: 0px 0px 0px;z-index:3;">
                        <div class="title">工具栏</div>
                        <div class="tool_item_board" >
                            <div 
                            :class="'tool_item tool ' + (item.enable?'enable':'disable')" 
                            v-for="item in tool_board_list" :key="item.name" 
                            :title="item.name"
                            v-on:click="item.click"
                            >
                                <i :class="item.icon"/>
                                <div class="hidden_title">{{item.name}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="tools_bar">
                        <div class="title">节点</div>
                        <div class="tool_item_board node" >
                            <div v-for="item in logit_node_list" 
                            :key="item.type" :data-type="item.type" 
                            :class="'tool_item tool_item_' + item.type" 
                            :style="'background-image:url('+ROOT_HOST+'/static/tools/'+item.type+'.svg)'"
                            v-on:mousedown="startToolDrag"
                            ></div>
                        </div>
                    </div>
                    
                    <!-- <div id="minimap">
                        <div id="minimapContainer">

                        </div>
                    </div> -->
                    <div id="chang_canvas"></div>
                    <div class="node_config_board" v-if="node_config.show">
                        <div class="board_title">{{node_config.title}}</div>
                        <el-card>
                            <div slot="header" class="clearfix">
                            <span>Label</span>
                            </div>
                            <el-input v-if="selected_node && selected_node.data.form.element_type=='scene' || selected_node.data.form.element_type=='condition'" v-model="node_config.label" @change="__change_node_label" placeholder="请输入内容"></el-input>
                            <div class="fake_input" v-else>{{node_config.label}}</div>
                        </el-card>
                        <el-card  v-if="selected_node && selected_node.data.form.element_type=='scene'">
                            
                            <div class="line iconfont">&#xe664; {{chang_list[chang_id2idx[selected_node.data.form.scene_id]].scene_name}}</div>
                            <div class="line iconfont">
                                <div class="config_role_tag" v-for="role in chang_list[chang_id2idx[selected_node.data.form.scene_id]].main_roles" :key="role.id">
                                    {{role.name}}<span class="status" v-for="status in role.status" :key="status">{{status}}</span>
                                </div>
                            </div>
                            <div class="line iconfont">&#xe79e; {{chang_list[chang_id2idx[selected_node.data.form.scene_id]].scene_type }}</div>
                            <div class="line iconfont">&#xe8ae; {{chang_list[chang_id2idx[selected_node.data.form.scene_id]].weather}}</div>
                            <div class="line iconfont">&#xe601; {{chang_list[chang_id2idx[selected_node.data.form.scene_id]].scene_time}}</div>

                            <div class='btn submit_btn' v-on:click="fast_edit">快速编辑</div>
                        </el-card   >
                        <div class="btn delete_btn" v-on:click="__del_node">Delete</div>

                    </div>
                    <div class="edge_config_board" v-if="edge_config.show">
                        <div class="board_title">{{edge_config.title}}</div>
                        <el-card>
                            <div slot="header" class="clearfix">
                            <span>Label</span>
                            </div>
                            <el-input v-model="edge_config.label" @change="__change_edge_label" placeholder="请输入内容"></el-input>
                        </el-card>
                            <div class="btn delete_btn" v-on:click="__del_edge">Delete</div>

                    </div>
                </div>
                <div id="chang_item_board">
                    <div class="item" id="new_add_chang_item">
                        <div class="title" id="new_chang" style="cursor:pointer;">新建场</div>
                        <div class="hidden_menu">
                            <div class="btn" style="width:100%;">上传</div>
                        </div>
                    </div>
                    <div style="height:2px;width:calc(100% - 20px);background:#ddd;margin:10px 10px;"></div>
                   <div class="item" v-for="item in chang_list" :key="item.id">
                        <div class='title' v-on:click="$router.push('/board/e/' + encode(drama_id) + '/' + encode(episode_id) + '/' + encode(item.id))">{{item.scene_name}}</div>
                        <div class='hidden_menu'>
                            <div class='btn'>
                                <a class='hidden_a' :href="ROOT_HOST+'/tool/downloadword/'+(new Date()).getTime()+'/'+drama_id+'/'+episode_id+'/'+item.id">
                                下载
                                </a>
                            </div>
                            <div class='btn'>删除</div>
                            <div class='btn' v-on:click="$router.push('/board/e/' + encode(drama_id) + '/' + encode(episode_id) + '/' + encode(item.id))">编辑</div>
                            <div class='btn' v-on:click="remove_scene(item.id)">移除</div>
                        </div>
                        <div class='drag_area' v-on:mousedown="startSceneDrag(item,$event)"></div>
                   </div>
                </div>
            </div>
        </div>
        <div class="msgBox" id="add_new_chang_board" style="display:none;z-index:11;">
            <div class="btn close_btn" id="close_new"></div>
            <div class="title">新建剧目</div>
            <div class="form" id="new_form">

                <div class="item">
                    <div class="item_title">场名称</div>
                    <div class="item_content">
                        <input type="text" value="" name="scene_name" autocomplete="off">
                    </div>
                </div>
                <!-- <div class="item">
                    <div class="item_title">主要角色</div>
                    <div class="item_content">
                        <input type="text" value="" name="main_roles" autocomplete="off">
                    </div>
                </div> -->
                <div class="item">
                    <div class="item_title">场类型</div>
                    <div class="item_content">
                        <input type="text" value="" name="scene_type" autocomplete="off">
                    </div>
                </div>
                <div class="item">
                    <div class="item_title">场时间</div>
                    <div class="item_content">
                        <input type="text" value="" name="scene_time" autocomplete="off">
                    </div>
                </div>
                <div class="item">
                    <div class="item_title">场地点</div>
                    <div class="item_content">
                        <input type="text" value="" name="scene_location" autocomplete="off">
                    </div>
                </div>
            </div>
            <div style="height:40px;margin:10px;margin-top:20px;">
                <div class="left left_40"><div class="btn reset_btn" id="reset_btn">reset</div></div>
                <div class="right right_60"><div class="btn submit_btn" id="submit_btn">submit</div></div>
            </div>
        </div>
    </div>
</template>

<script>
import "../../css/jeditor.css";
import "../../css/chang.css";
import "../../css/drag.css";
const node_option = require("../../js/node_type_option")
const $=require("jquery");
const Loadding = require("../../js/loadding").default.Loadding;
const base = require("../../js/base").default;
// const Tool_Thumb = require("../../js/changeditor").default.Tool_Thumb;
import "../../js/jsplumb.min.js"
import { Graph, Addon, DataUri } from '@antv/x6';
// import { Layout } from '@antv/layout';
// const dagreLayout = new Layout({
//   type: 'dagre',
//   ranksep: 20,
//   nodesep: 30,
//   controlPoints: true,
// //   nodesepFunc:(opt)=>{
// //     return parseInt(opt.width/2);
// //   },
// //   ranksepFunc:(opt)=>{
// //     return parseInt(opt.height/3);
// //   },
// })
const { Dnd } = Addon;

const Storage = window.sessionStorage;
// config figure
const path_color = "rgba(0, 0, 0,.5)";
const highlight_path_color = "rgba(30, 136, 229,1)";
const path_width = 2;
const highlight_path_width = 4;

export default {
    props:["encode_drama_id","encode_episode_id"],
    data(){
        return{
            ROOT_HOST:ROOT_HOST,
            is_edited:false,
            drama_id:0,
            episode_id:0,
            fast_url:"",
            changeditor:null,
            Scene_Thumb:null,
            frame_show:false,
            frame_hidden:false,
            chang_list:[],
            chang_id2idx:{},
            logit_node_list:[
                {
                    type:"start",
                    info:{
                        element_type: "start",
                        element_content: "",
                        element_condition: "",
                        is_start: 1,
                        is_end: 0,
                        scene_id: null
                    }
                },
                {
                    type:"end",
                    info:{
                        element_type: "end",
                        element_content: "",
                        element_condition: "",
                        is_start: 0,
                        is_end: 1,
                        scene_id: null
                    }
                },
                {
                    type:"condition",
                    info:{
                        element_type: "condition",
                        element_content: "",
                        element_condition: "",
                        is_start: 0,
                        is_end: 0,
                        scene_id: null
                    }
                }
            ],
            before:{
                graph_nodes_list:[],
                graph_edges_list:[],
                graph_nodes_set:new Set(),
                graph_edges_set:new Set(),
                node_id2idx:{},
                edge_id2idx:{},
            },
            graph:null,
            history:null,
            zoom:0,
            selected_node:null,
            selected_edge:null,
            tool_board_list:[
                {
                    name:"撤销",
                    enable:false,
                    show:true,
                    icon:"el-icon-back",
                    click:()=>{this.history.undo()}
                },
                {
                    name:"重做",
                    enable:false,
                    show:true,
                    icon:"el-icon-right",
                    click:()=>{this.history.redo()}
                },
                // {
                //     name:"一键排版",
                //     enable:true,
                //     show:true,
                //     icon:"el-icon-thumb",
                //     click:()=>{this.__dagre_graph();}
                // },
                {
                    name:"一键居中",
                    enable:true,
                    show:true,
                    icon:"el-icon-full-screen",
                    click:()=>{this.graph.centerContent();}
                },
                {
                    name:"缩小",
                    enable:true,
                    show:true,
                    icon:"el-icon-zoom-out",
                    click:()=>{this.zoom-=0.2;this.graph.zoom(-0.2);}
                },
                {
                    name:"原始大小",
                    enable:true,
                    show:true,
                    icon:"el-icon-refresh-left",
                    click:()=>{this.graph.zoom(-this.zoom);this.zoom=0;}
                },
                {
                    name:"放大",
                    enable:true,
                    show:true,
                    icon:"el-icon-circle-plus-outline",
                    click:()=>{this.zoom+=0.2;this.graph.zoom(0.2);}
                },
                {
                    name:"导出图片",
                    enable:true,
                    show:true,
                    icon:"el-icon-picture",
                    click:()=>{this.graph.toPNG((dataUri) => {
                        // 下载
                        DataUri.downloadDataUri(dataUri, 'chart.png')
                        }, {padding: {top: 40,right: 30,bottom: 40,left: 30,},}
                        )}
                }
            ],
            node_config:{
                show:false,
                title:'编辑节点',
                label:""
            },
            edge_config:{
                show:false,
                title:'编辑边',
                label:""
            },
            float_frames:{
                node_top:"",
                node_left:"",
                top:"10px",
                left:"10px",
                bottom:"auto",
                right:"auto",
                height:"calc(80% - 10px)",
                minHeight:"300px",
                width:"400px",
                minWidth:"200px",
                icon:"",
                scene_id:""
            }
        }
    },
    beforeRouteLeave(to, from, next){
        if(this.is_edited){
            const answer = window.confirm('请确定数据是否保存，确定要离开？')
            if (answer) {
                next()
            } else {
                next(false)
            }
        }else{
            next();
        }
    },
    mounted:function(){

        base.reset_rightboard_width();
        var that = this;
        this.drama_id=window.atob(this.encode_drama_id);
        this.episode_id=window.atob(this.encode_episode_id);
        var first_loadding = new Loadding();
        first_loadding.add_title("初始化");
        first_loadding.__init__();
        first_loadding.add_process(
            "加载组件",
            function(){
                that.__init__components();
            }
        );
        first_loadding.add_process(
                "拉取云端数据",
            function(){
                that.__load_data_from_server();
                that.__add_graph_events();
                that.__add_frame_drag_event();
            }
        );

        first_loadding.start();

    },
    methods:{
        __init__components:function(){            
            this.graph = new Graph({
                container: document.getElementById('chang_canvas'),
                history: true,
                keyboard: {
                    enabled: true,
                    format(key) { 
                    return key
                    .replace(/\s/g, '')
                    .replace('cmd', 'command')
                    },
                },
                selecting: {
                    enabled: true,
                    multiple: false,
                    rubberband: false,
                    movable: true,
                    showNodeSelectionBox: true,
                },
                snapline: {
                    enabled: true,
                    sharp:true
                },
                connecting:{
                    allowBlank: false,
                    allowMulti: false,
                    allowLoop: true,
                    allowNode: false,
                    allowEdge: false,
                    allowPort: true,
                },
                grid: {
                    size: 10,
                    visible: true,
                },
                panning: true,

                });

            this.history = this.graph.history;
            this.history.on('change', () => {
                this.tool_board_list[1].enable = this.history.canRedo();
                this.tool_board_list[0].enable = this.history.canUndo();
            })
            this.tool_dnd = new Dnd({   
                target: this.graph,
                scaled: false,
                animation: true,
                validateNode(droppingNode, options) {
                },
                })
            this.scene_dnd = new Dnd({   
                target: this.graph,
                scaled: false,
                animation: true,
                validateNode(droppingNode, options) {
                },
            })

        },
        __load_data_from_server:function(){

            var that=this;
            $.ajax({
                type:"POST",
xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
url:ROOT_HOST + "/jeditor/api/episodeemelemtscene/"+that.drama_id +"/" + that.episode_id,
                async:false,
                dataType:"json",
                success:function(returndata){
                    for(var i in returndata[0]){
                        that.chang_list.push(returndata[0][i])
                        that.chang_id2idx[returndata[0][i].id] = i;
                    }
                    // console.log(that.chang_id2idx)
                }
            })

            $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                url: ROOT_HOST + "/jeditor/api/episodeemelemt/" + that.drama_id + "/" + that.episode_id,
                async: false,
                dataType: "json",
                success: function (returndata) {
                    // if (returndata[0] == null) return;
                    for(var i in returndata[0]){
                        // console.log(returndata[0][i])
                        that.before.graph_nodes_list.push(returndata[0][i]);
                        that.before.graph_nodes_set.add(returndata[0][i].element_id);
                        that.before.node_id2idx[returndata[0][i].element_id]=i;
                    }
                    // Storage.setItem("chang_element", JSON.stringify(returndata[0]));

                }
            });
            $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                url: ROOT_HOST + "/jeditor/api/episoderelation/" + that.drama_id + "/" + that.episode_id,
                async: false,
                dataType: "json",
                success: function (returndata) {
                    // if (returndata[0] == null) return;
                    for(var i in returndata[0]){
                        // console.log(returndata[0][i])
                        that.before.graph_edges_list.push(returndata[0][i]);
                        that.before.graph_edges_set.add(returndata[0][i].id);
                        that.before.edge_id2idx[returndata[0][i].id]=i;
                    }
                    // Storage.setItem("chang_relation", JSON.stringify(returndata[0]));
                }
            });
            // console.log(this.graph_nodes_before)
            console.log("Load from Server");
            this.__init_graph_data();
            this.graph.centerContent();
        },
        __init_graph_data:function(){
                var data={nodes:[],edges:[]}
                this.before.graph_nodes_list.forEach(ele=>{
                    if(ele.element_type=="input"){
                        return
                    }
                    let d = JSON.parse(JSON.stringify(node_option[ele.element_type]));
                    
                    // d.shape="rect"
                    // d.info = ele;
                    for(let k in d.data.form)d.data.form[k] = ele[k] || d.data.form[k];
                    d.id=String(ele.element_id);
                    d.attrs.label.text=ele.element_content;
                    d.position=JSON.parse(ele.element_condition);
                    data.nodes.push(d);
                })
                
                this.before.graph_edges_list.forEach(rel=>{
                    let d = JSON.parse(JSON.stringify(node_option['edge']))
                    
                    // d.shape="edge"
                    // d.info = rel;
                    // console.log(rel)
                    for(let k in d.data.form)d.data.form[k] = rel[k] || d.data.form[k];
                    d.id=String(rel.id);
                    d.source = String(rel.parent_id)
                    d["data"] = {remark:rel.remark}
                    d.target = String(rel.children_id)
                    data.edges.push(d);
                })
                this.graph.fromJSON(data);

                // add remark for every edge
                this.graph.getEdges().forEach(edge=>{

                    if(edge.store.data.data.remark!=''){
                        edge.setLabels({attrs:{text:{text:edge.store.data.data.remark}}})
                    }
                })
        },
        __extract_graph_json:function(){
            var data={nodes:[],edges:[]};
            const jsondata = this.graph.toJSON();
            jsondata.cells.forEach(item=>{
                if(item.shape=="rect"||item.shape=="polygon"){
                    let d = {};
                    for(let k in item)d[k]=item[k];
                    d.width = d.size.width;
                    d.height = d.size.height;
                    delete d.size;
                    delete d.position;
                    data.nodes.push(d)
                }else{
                    let d = {};
                    for(let k in item)d[k]=item[k];
                    d.source = d.source.cell
                    d.target = d.target.cell
                    data.edges.push(d)
                }
            })
            return data;
        },
        // __dagre_graph:function(){
        //     let edge_remark={}
        //     var data= this.__extract_graph_json();

        //     let select_id = 0;
        //     if (this.selected_node!=null)select_id=this.selected_node.id;
        //     this.graph.cleanSelection();
        //     const newdata = dagreLayout.layout(data)
        //     // reconstruct edges
        //     newdata.edges.forEach(ele=>{
        //         ele.source={
        //             cell:ele.source,
        //             port:"output_port"
        //         }
        //         ele.target={
        //             cell:ele.target,
        //             port:"input_port"
        //         }
        //     })
        //     newdata.nodes.forEach(ele=>{
        //         if((!ele.data.updated) && ele.data.form.element_condition!=JSON.stringify(ele.position)){
        //             ele.data.updated=true;
        //         }
        //     })
        //     // console.log(newdata)
        //     this.graph.fromJSON(newdata);
        //     for(let ele in edge_remark){
        //         this.graph.getCell(ele).setLabels({attrs:{text:{text:edge_remark[ele]}}})
        //     }

        //     if (select_id!=0)this.graph.select(select_id)
        // },
        __add_events:function(){
            var that=this;
            $(".save-btn").on("click", function(){
                that.changeditor.save_all();
            });

            var new_form = $("#new_form");
            var items = new_form.find(".item input");
            $("#new_chang").on("click",function(){
                $("#add_new_chang_board").css("display","block");
            })
            $("#close_new").on("click",function(){
                $("#add_new_chang_board").css("display","none");
            });
            $("#reset_btn").on("click",function(){
                items.val("");
            });
            $("#submit_btn").on("click", function(){
                var form = {}
                for(var i = 0; i < items.length; i ++ ){
                    if(items[i].value.length == 0){
                        items[i].style.border = "2px dashed #E57373";
                        setTimeout(function(){
                            items[i].style.border = "0px dashed transparent";
                        },1000);
                        return;
                    }
                    form[items[i].getAttribute("name")] = items[i].value;
                }

                var add_loadding=new Loadding();
                add_loadding.add_title("新建场");
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
                            url:ROOT_HOST + "/jeditor/api/createepisodescene/" + that.drama_id + "/" + that.episode_id,

                            contentType:'application/json;charset=UTF-8',
                            data:JSON.stringify(form),
                            async:false,
                            dataType:"json",
                            success:function(returndata){
                                var scene_thumb = new that.Scene_Thumb(that.changeditor,that.$router);
                                scene_thumb.__init__(returndata[0]);
                                scene_thumb.create();
                            }
                        })
                        }
                );

                add_loadding.start(
                    function(){
                        $("#add_new_chang_board").css("display","none");
                    }
                );

            });
        },
        __change_node_label:function(){
            this.selected_node.updateAttrs({label:{text:this.node_config.label}})
        },
        __change_edge_label:function(){
            if(this.edge_config.label==''){
                this.selected_edge.setLabels({attrs:{text:{text:''}}})
            }else{
                this.selected_edge.setLabels({attrs:{text:{text:' '+this.edge_config.label+' '}}})
            }
        },
        __del_node:function(){
        this.graph.removeNode(this.selected_node.id);
        this.$message('删除成功');
        },
        __del_edge:function(){
            this.graph.removeEdge(this.selected_edge.id);
            this.$message('删除成功');
        },
        __add_graph_events:function(){
            this.graph.on('node:selected', ( args) => { 
                this.selected_node = args.node;
                this.node_config.show=true;
                this.edge_config.show=false;
                this.node_config.label = this.selected_node.store.data.attrs.label.text;

                // console.log(this.selected_node)
            })
            this.graph.on('node:unselected', ( ) => { 
                this.selected_node = null;
                this.node_config.show=false;
            })
            this.graph.on('edge:click', ( args) => { 
                this.selected_edge = args.edge;
                this.edge_config.show=true;
                this.node_config.show=false;
                try{
                    this.edge_config.label = this.selected_edge.getLabels()[0].attrs.text.text.trim();
                }catch{
                    this.edge_config.label = ''
                }
                // console.log(this.selected_node)
            })
            this.graph.on('cell:change:*', (args) => {
                args.cell.updateData({updated:true})
            })
            // back to default
            this.graph.on('blank:click', ( ) => { 
                this.edge_config.show=false;
                this.node_config.show=false;
            })
        },
        __add_frame_drag_event:function(){
            var that = this;
            $("#float_board").find(".dragger_haddle").on("mousedown",function(ev){
                console.log("mousedown")
                var startX = ev.pageX,startY = ev.pageY;
                var dom = this.parentElement.parentElement;
                var topline = this.parentElement;
                var dom_x = dom.offsetLeft, dom_y = dom.offsetTop;
                var frame_board_move_flag = true;
                dom.style.transform = "scale(.8) translate(0px,calc(-10%))";
                dom.style.marginTop = "-15px";
                topline.style.height = "100%"
                $(document).on("mousemove",function(d_ev){
                    if(!frame_board_move_flag){
                        return;
                    }
                    dom.style.transition = "none";
                    that.float_frames.right = 'auto';
                    that.float_frames.bottom = 'auto';
                    that.float_frames.left = (d_ev.pageX - startX + dom_x) + 'px';
                    that.float_frames.top = (d_ev.pageY - startY + dom_y) + 'px';
                })
                $(document).on("mouseup",function(d_ev2){
                        if(!frame_board_move_flag){
                            return;
                        }
                        frame_board_move_flag = false;
                        dom.style.transition = "ease .3s";
                        dom.style.transform = "scale(1)";
                        dom.style.marginTop = "0";
                        topline.style.height = "30px"
                        if(d_ev2.pageX > window.innerWidth/2){
                            that.float_frames.left = 'auto';
                            that.float_frames.right = '10px';
                        }else{
                            that.float_frames.left = '10px';
                            that.float_frames.right = 'auto';
                        }
                        if(d_ev2.pageY > window.innerHeight/2){
                            that.float_frames.top = 'auto';
                            that.float_frames.bottom = '10px';
                        }else{
                            that.float_frames.top = '10px';
                            that.float_frames.bottom = 'auto';
                        }
                    }
                    )
            })
        },
        startToolDrag : function(event){
                const target = event.target
                const type = target.getAttribute('data-type')
                let tool_node_option = JSON.parse(JSON.stringify(node_option[type]))
                let time = new Date();
                tool_node_option.data.form.element_id = parseInt(time.getTime())
                tool_node_option.id = String(tool_node_option.data.form.element_id)
                const node = this.graph.createNode(tool_node_option)

            this.tool_dnd.start(node, event)
        },
        startSceneDrag : function(info,event){
                const target = event.target;
                const type = "scene"
                let time = new Date();
                let scene_node_option = JSON.parse(JSON.stringify(node_option[type]))
                scene_node_option.data.form.scene_id=info.id;
                scene_node_option.data.form.element_id = parseInt(time.getTime())
                scene_node_option.data.form.element_content = info.scene_name;
                scene_node_option.attrs.label.text=info.scene_name;
                scene_node_option.id = String(scene_node_option.data.form.element_id)
                // tool_node_option.label = 
                const node = this.graph.createNode(scene_node_option)

            this.scene_dnd.start(node, event)
        },
        __is_diff:function(dict_a,dict_b){
            for(let k in dict_a){
                if( dict_a[k]!=dict_b[k]){
                    return true;
                }
            }
            return false;
        },
        __diff:function(setA, setB){
            let _difference = new Set(setA);
            for (let elem of setB) {
                _difference.delete(elem);
            }
            return _difference;
        },
        __queue_promise:async function(arr){
            let data = []
            for (let promise of arr) {
                let res = await promise()
                data.push(res)
            }
            return data
        },
        save_graph:function(){
            var graphjson = this.graph.toJSON();
            // console.log(graphjson)
            let now = {
                graph_nodes_list:[],
                graph_edges_list:[],
                graph_nodes_set:new Set(),
                graph_edges_set:new Set(),
                node_id2idx:{},
                edge_id2idx:{},
                node_nid2id:{},
                node_id2nid:{},
                edge_id2nid:{},
            }
            let add_node =[], del_node = [], update_node = [];
            let add_edge =[], del_edge = [], update_edge = [];
            let n_edge = 0, n_node = 0;
            graphjson.cells.forEach(ele=>{
                if(ele.shape!="edge") {
                    // update info to data.form
                    ele.data.form.element_content = ele.attrs.label.text;
                    ele.data.form.element_condition = JSON.stringify(ele.position)

                    now.graph_nodes_list.push(ele.data.form);
                    now.graph_nodes_set.add(ele.data.form.element_id);
                    now.node_id2idx[ele.data.form.element_id] = n_node;
                    now.node_nid2id[ele.id]=ele.data.form.element_id;
                    now.node_nid2id[ele.data.form.element_id]=ele.id;
                    n_node+=1;
                    // add or update:
                    if(this.before.graph_nodes_set.has(ele.data.form.element_id)){
                        if(ele.data.updated && this.__is_diff(ele.data.form, this.before.graph_nodes_list[this.before.node_id2idx[ele.data.form.element_id]]))
                            update_node.push(ele.data.form);
                    }else{
                        add_node.push(ele.data.form);
                    }
                }
            })
            
            graphjson.cells.forEach(ele=>{
                if(ele.shape=="edge"){
                    if(! ('form' in ele.data)){
                        let time =  new Date();
                        ele.data = {
                            form:{
                                id:parseInt(time.getTime()+n_edge),
                                parent_id:now.graph_nodes_list[now.node_id2idx[now.node_nid2id[ele.source.cell]]].element_id,
                                children_id:now.graph_nodes_list[now.node_id2idx[now.node_nid2id[ele.target.cell]]].element_id,
                                is_start:0,
                                remark:"",
                            },
                            updated:false,
                        }
                    }
                    // update info to data.form
                    if('labels' in ele) ele.data.form.remark = ele.labels[0].attrs.text.text;
                    now.graph_edges_list.push(ele.data.form);
                    now.graph_edges_set.add(ele.data.form.id);
                    now.edge_id2idx[ele.data.form.id] = n_edge;
                    now.edge_id2nid[ele.data.form.id] = ele.id;
                    n_edge+=1;
                    // add or update:
                    if(this.before.graph_edges_set.has(ele.data.form.id)){
                        if(ele.data.updated && this.__is_diff(ele.data.form, this.before.graph_edges_list[this.before.edge_id2idx[ele.data.form.id]]))
                            update_edge.push(ele.data.form);
                    }else{
                        add_edge.push(ele.data.form);
                    }
                }
            })
            // delete?
            this.__diff(this.before.graph_nodes_set,now.graph_nodes_set).forEach(ele=>{
                del_node.push(ele);
            })
            this.__diff(this.before.graph_edges_set,now.graph_edges_set).forEach(ele=>{
                del_edge.push(ele);
            })
            
            // start to upload
            let p_stack = [];
            // edge
            add_edge.forEach(ele=>{
                $.ajax({
                    type: "POST",
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    url: ROOT_HOST + "/jeditor/api/createepisoderel/" + this.drama_id + "/" + this.episode_id,
                    async: false,
                    dataType: "json",
                    data: JSON.stringify(ele),
                    success: function (returndata) {
                    },
                    error: function (err){
                    }
                });
            })
            update_edge.forEach(ele=>{
                    $.ajax({
                        type: "POST",
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        url: ROOT_HOST + "/jeditor/api/updaterel/" + this.drama_id + "/" + this.episode_id + "/" + ele.id,
                        async: false,
                        data:JSON.stringify(ele),
                        dataType: "json",
                        success: (returndata)=> {
                            this.graph.getCell(now.edge_id2nid[ele.id]).updateData({updated:false})
                        },
                        error: function (err){
                        }
                    });
            })
            del_edge.forEach(ele=>{
                    $.ajax({
                        type: "POST",
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        url: ROOT_HOST + "/jeditor/api/deleteepisoderel/" + this.drama_id + "/" + this.episode_id + "/" + ele,
                        async: false,
                        dataType: "json",
                        success: function (returndata) {
                        },
                        error: function (err){
                        }
                    });
            })
            // node
            add_node.forEach(ele=>{
                    $.ajax({
                        type: "POST",
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        url: ROOT_HOST + "/jeditor/api/createepisodeele/" + this.drama_id + "/" + this.episode_id,
                        async: false,
                        dataType: "json",
                        data: JSON.stringify(ele),
                        success: function (returndata) {
                        },
                        error: function (err){
                        }
                    });
            })
            update_node.forEach(ele=>{
                    $.ajax({
                        type: "POST",
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        url: ROOT_HOST + "/jeditor/api/updateele/" + this.drama_id + "/" + this.episode_id + "/" + ele.element_id,
                        async: false,
                        data:JSON.stringify(ele),
                        dataType: "json",
                        success: (returndata) => {
                            this.graph.getCell(now.node_id2nid[ele.id]).updateData({updated:false})
                        },
                        error: function (err){
                        }
                    });
            })
            del_node.forEach(ele=>{
                    $.ajax({
                        type: "POST",
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        url: ROOT_HOST + "/jeditor/api/deleteele/" + this.drama_id + "/" + this.episode_id + "/" + ele,
                        async: false,
                        dataType: "json",
                        success: function (returndata) {
                        },
                        error: function (err){
                        }
                    });
            })
            
            this.before=JSON.parse(JSON.stringify(now))
            this.before.graph_nodes_set = now.graph_nodes_set
            this.before.graph_edges_set = now.graph_edges_set
            this.$notify({
            title: '上传成功',
            message: '',
            type: 'success'
            });
        },
        fast_edit:function(){
            this.fast_url = "";
            this.frame_show=true;
            this.frame_hidden=false;
            // let offset = that.dom.offset();
            // offset.left = parseInt(that.dom.css('left').split("px")[0]) + 10-50;
            // this.float_frames.node_top=offset.top+"px";
            // this.float_frames.node_left=offset.left+"px";
            this.float_frames.scene_id = this.selected_node.data.form.scene_id;
            setTimeout(()=>{
                this.fast_url = '#/board/faste/'+this.encode(this.drama_id) + '/'+this.encode(this.episode_id)+'/'+this.encode(this.selected_node.data.form.scene_id)
            },500)

        },
        __is_scene_in_graph:function(scene_id){
            let in_ = false;
            this.graph.getNodes().forEach(node=>{
                if(node.store.data.data.form.scene_id==scene_id){
                    in_=true;
                }
            })
            return in_;
        },
        remove_scene:function(scene_id){
            if(this.__is_scene_in_graph(scene_id)){
                this.$message({
                    type: 'info',
                    message: '该场在剧集逻辑图上，请删除图中对应节点后操作'
                });  
                return;
            }
        
        this.$confirm('此操作将保存逻辑图并从剧集组中移除该场, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.save_graph();
            let form={
                "drama_id":this.drama_id,
                "old_episode_id":this.episode_id,
                "new_episode_id":-1,
                "scene_list":[this.id]
            }

            $.ajax({
                type:"POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                url:ROOT_HOST + "/jeditor/api/update_scene_episode",

                contentType:'application/json;charset=UTF-8',
                data:JSON.stringify(form),
                async:false,
                dataType:"json",
                success:()=>{
                    for(let i = 0;i<this.chang_list.length;i++){
                        if(this.chang_list[i].id == scene_id){
                            this.chang_list.splice(i,1);
                            break;
                        }
                    }
                    for(let i = 0;i<this.chang_list.length;i++){
                        this.chang_id2idx[this.chang_list[i].id] = i;
                    }
                    this.$message({
                        type: 'success',
                        message: '移除成功!'
                      });
                }
            })

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消移除'
            });          
          });
        },
        encode:function(code){
            return window.btoa(code);
        }
    }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.simpleInfo{
    display: block;
    position: absolute;
    background: white;
    padding: 0px 10px;
    font-size: 12px;
    top: 0;
    border: 1px solid #999;
    border-radius: 2px;
    box-shadow: 3px 2px 5px #999;
    right: 0;
}
.jtk-endpoint circle {
    fill: #000000 !important;
    display: none;
}
.jtk-endpoint rect {
    fill: #000000 !important;
    display: none;
}

#float_board {
  bottom: 10px;
  position: absolute;
  height: calc(50% - 20px);
  width: 40%;
  background: white;
  z-index: 2000;
  left: 10px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition:cubic-bezier(0.47, 0.79, 0, 1) 0.5s;
  opacity: 1;
  .hidden_circle{
        height: 100%;
    width: 100%;
        background-size: 50%;
        border-radius: 40px;
        background-repeat: no-repeat;
        background-position: center;
        display: none;
  }
  .top_line {
    position: absolute;
    background: #eee;
    height: 30px;
    width: 100%;
    z-index: 3001;
    opacity: 0;
    transition: ease .2s;
  }
  .top_line:hover{
    opacity: 1;
  }
  .dragger_haddle{
          height: 30px;
    width: calc(100% - 50px);
    position:relative;
    float: left;
        cursor: move;
  }
  .dragger_haddle:before{
          content: "";
    background: rgba(0,0,0,.2);
    height: 6px;
    width: 20%;
    position: absolute;
    left: 40%;
    border-radius: 10px;
    top: 50%;
    margin-top: -3px;
  }
  .hidden_btn{
    height: 14px;
    width: 14px;
    float: left;
    background: #80CBC4;
    margin: 7px;
    border-radius: 10px;
    font-size: 5px;
    color: transparent;
    line-height: 14px;
    text-align: center;
    font-weight: bold;
    cursor: pointer;
  }
  .hidden_btn:hover{
      background: red;
      color: black;
  }
  .close_btn{
          height: 14px;
    width: 14px;
    float: left;
    background: #E57373;
    margin: 7px;
    border-radius: 10px;
    font-size: 5px;
    color: transparent;
    line-height: 14px;
    text-align: center;
    font-weight: bold;
    cursor: pointer;
  }
  .close_btn:hover{
      background: #D32F2F;
      color: black;
  }
  .choices_btn{
          height: 14px;
    width: 14px;
    float: left;
    background: #FFE082;
    margin: 7px;
    border-radius: 10px;
    font-size: 5px;
    color: transparent;
    line-height: 14px;
    text-align: center;
    font-weight: bold;
    cursor: pointer;
  }
  .choices_btn:hover{
      background: #FFC107;
      color: black;
  }
  .main_board{
    height: 100%;
    width: 100%;
    // margin-top:30px;
    iframe{
        border: 0px;
    height: 100%;
    width: 100%;
        position: absolute;
    z-index: 3000;
    top: 0px;
    left: 0px;
    }
  }
}
#float_board.hidden {
    width: 100px !important;
    height: 40px !important;
    min-width: 40px !important;
    min-height: 40px !important;
    opacity: 0;
    z-index: -1;
    .hidden_circle{display: block;}
    .top_line {display: none;}
    .main_board {display: none;}
}

.el-dropdown-menu__item .little_icon{
    height: 20px;
    width: 20px;
    float: left;
    background-position: center;
    background-size: cover;
    border-radius: 20px;
    margin: 8px 0px;
    margin-right: 10px;
  }
  #minimap{
          position: relative;
            top: 0px;
            margin-bottom: -100px;
            z-index: 2;
            width: 100px;
            height: 100px;
            float:right;
      #minimapContainer{
              height: 100px;
    width: 100px;
    background: rgba(255, 255, 255, 0.9);
    overflow: hidden;
    border-radius: 10px;
    border-top-right-radius: 0px;
    box-shadow: -3px 3px 10px -2px rgb(0 0 0 / 20%);
      }
  }
  .tool_item.tool{
    height: 26px;
    width: 30px;
    text-align: center;
    line-height: 26px;
    border-radius: 5px;
    margin: 2px 2px;
    font-weight: bold;
    
    transition: ease 0.5s;
    .hidden_title{
        display: none;
            width: max-content;
        position: absolute;
        background: white;
        border-radius: 5px;
        border: 1px solid #ddd;
        padding: 0px 5px;
        box-shadow: 0px 0px 5px rgb(0 0 0 / 20%);
    }
  }
  .tool_item.tool:hover{
    background:#ccc;
    .hidden_title{
        display: block;
    }
  }
  .tool_item.tool.enable{
      cursor: pointer;
  }
  .tool_item.tool.disable{
      cursor:not-allowed;
        color: #aaa;
  }
  .node_config_board{
      height: calc(100% - 92px);
    width: 30%;
    min-width: 200px;
    position: absolute;
    right: 0px;
    top: 92px;
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(10px);
    padding: 10px;
    box-sizing: border-box;
    box-shadow: -2px 0px 5px -2px rgb(0 0 0 / 20%);
    border-left: 1px solid #ddd;
}
.edge_config_board{
      height: calc(100% - 92px);
    width: 30%;
    min-width: 200px;
    position: absolute;
    right: 0px;
    top: 92px;
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(10px);
    padding: 10px;
    box-sizing: border-box;
    box-shadow: -2px 0px 5px -2px rgb(0 0 0 / 20%);
    border-left: 1px solid #ddd;
}
.board_title{
    font-size: 1.2em;
    font-weight: bold;
    padding: 10px;
    // border-bottom: 1px solid #ddd;
    text-align: left;
}
.fake_input{
    height:40px;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    line-height: 40px;
    padding: 0 15px;
    box-sizing: border-box;
    color: #606266;
    font-size: inherit;
    cursor: not-allowed;
}
.config_role_tag{
    border-radius: 5px;
    background: #3f51b5;
    color:white;
    line-height: 20px;
    height: 20px;
    font-size: 14px;
    width: auto;
    float:left;
    padding: 5px 10px;
    margin-bottom: 5px;
    margin-right: 5px;
    .status{
        background: rgba(0,0,0,.2);
    color: #eee;
    font-weight: bold;
    padding: 2px 5px;
    border-radius: 10px;
    margin: 0px 5px;
    font-size: 8px;
    }
}
</style>
