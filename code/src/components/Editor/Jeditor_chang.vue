<template>
    <div class="main_board">
        <div class="center_main" id="juji_center">
            <div id='float_board' v-show="frame_show" :class="(frame_hidden?'hidden':'')"
                :style="{
                height:float_frames.height,
                minHeight:float_frames.minHeight,
                width:float_frames.width,
                minWidth:float_frames.minWidth,
                top:frame_hidden?float_frames.node_top:float_frames.top,
                left:frame_hidden?float_frames.node_left:float_frames.left,
                bottom:frame_hidden?'auto':float_frames.bottom,
                right:frame_hidden?'auto':float_frames.right,
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
                    <div class="hidden_btn" v-on:click="frame_hidden=true;faste_url=''"><i class="el-icon-minus"></i></div>
                    <!-- <div class="close_btn" v-on:click="frame_closed=true;"><i class="el-icon-close"></i></div> -->
                </div>
                <div class="main_board"  v-loading="true" >
                    <iframe :src="faste_url"></iframe>
                </div>
                </div>
            <div class="backto iconfont"  style="float:left;" v-on:click="$router.push('/board/e/'+encode(drama_id));">&#xe6a8;</div>
            <div class="save-btn iconfont">&#xe6bd; 保存</div>
            <!-- <script>
                $(".backto").on("click",function(){
                    backto("/jeditor/drama/" + drama_id);
                })
            </script> -->
            <div id="chang_board">
                <div id="chang_main_board">
                    <div class="tools_bar">
                        <div class="title">工具栏</div>
                        <div class="tool_item_board">

                        </div>
                    </div>
                    <div id="chang_canvas"></div>
                    
                </div>
                <div id="chang_item_board">
                    <div class="item" id="new_add_chang_item">
                        <div class="title" id="new_chang" style="cursor:pointer;">新建场</div>
                        <div class="hidden_menu">
                            <div class="btn" style="width:100%;">上传</div>
                        </div>
                    </div>
                    <div style="height:2px;width:calc(100% - 20px);background:#ddd;margin:10px 10px;"></div>
                   <!-- <div class="item">
                        <div class='title'>title</div>
                        <div class='hidden_menu'>
                            <div class='btn'>下载</div>
                            <div class='btn'>下载</div>
                            <div class='btn'>下载</div>
                            <div class='btn'>下载</div>
                        </div>
                   </div> -->
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
import "../../index"
const $=require("jquery");
const Loadding = require("../../js/loadding").default.Loadding;
const base = require("../../js/base").default;
const Chang = require("../../js/changeditor").default.Chang;
import "../../js/jsplumb.min.js"
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
            is_edited:false,
            drama_id:0,
            episode_id:0,
            faste_url:"",
            changeditor:null,
            Scene_Thumb:null,
            frame_show:false,
            frame_hidden:false,
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
                }
            );
        first_loadding.add_process(
                "拉取人物信息",
                function(){
                    $.ajax({
                    type:"POST",
xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
url: ROOT_HOST+ "/jeditor/api/ch/"+that.drama_id,
                    async:false,
                    dataType:"json",
                    success:function(returndata){
                        Storage.setItem("character_list",JSON.stringify(returndata));
                        Storage.setItem("current_drama_id", that.drama_id);
                    }
                });
                }
            );

        first_loadding.add_process(
            "绘图",
            function(){
                that.changeditor.set_id(that.drama_id, that.episode_id);
                that.changeditor.prePaint();
                console.log(that.changeditor)
            }
        );
        first_loadding.add_process(
            "添加事件",
            function(){
                that.__add_events();
                that.add_frame_drag_event();
            }
        );
        first_loadding.start();
    },
    methods:{
        __init__components:function(){
            var that=this;
            // canvas_dom , tool_item_dom, center_board_dom: 定位逻辑节点的移动;, left_dom: 定位逻辑节点的移动，判断占位。
            that.changeditor = new Chang("#chang_canvas", document.getElementsByClassName("tool_item_board")[0],"#juji_center","#left_board",this);

            jsPlumb.bind("ready",function(){
                that.jsplumb = jsPlumb.getInstance();
                // that.jsplumb.Defaults.Overlays=[ ['Arrow', { width: 10, length: 10, location: 0.25 ,fill:path_color}],['Arrow', { width: 10, length: 10, location: 0.75 ,fill:path_color}] ]
                that.jsplumb.Defaults.Overlays=[ ['Arrow', { width: 10, length: 10, location: 1 ,fill:path_color}]]
                that.jsplumb.Defaults.PaintStyle = {stroke:path_color,strokeWidth:path_width};
                that.jsplumb.reset();
                that.jsplumb.unbind("connection");
                that.jsplumb.bind("connection", function(info, originalEvent){
                        var conn = info.connection
                        // console.log(conn);
                        // 已修改
                        that.is_edited=true;
                        that.changeditor.add_Connection(conn);
                    });
                // that.jsplumb.unbind("connectionDetached");
                // that.jsplumb.bind("connectionDetached",function(conn,originalEvent){
                //     that.changeditor.find_Connection(conn.connection.nid).deleteItself();
                // });
                // that.jsplumb.unbind("dblclick")
                // that.jsplumb.bind("dblclick",function(conn, originalEvent){
                //     that.changeditor.find_Connection(conn.connection.nid).deleteItself();
                // })
            });


            that.changeditor.add_jsplumb(that.jsplumb);

            this.Scene_Thumb = require("../../js/changeditor").default.Scene_Thumb;
        },
        __load_data_from_server:function(){
            // Storage.removeItem("chang_element");
            // Storage.removeItem("chang_drama_id");
            // Storage.removeItem("chang_episode_id");
            // Storage.removeItem("chang_relation");
            // Storage.removeItem("chang_elementscene");
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
                    // console.log(returndata[0]);
                    // Storage.setItem("chang_elementscene",JSON.stringify(returndata[0]));
                    // Storage.setItem("chang_drama_id",that.drama_id);
                    // Storage.setItem("chang_episode_id",that.episode_id);
                    for(var i in returndata[0]){
                            var scene_thumb = new that.Scene_Thumb(that.changeditor,that.$router);
                            scene_thumb.__init__(returndata[0][i]);
                            scene_thumb.create();
                    }
                }
            })
            console.log("Load from Server");
        },
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
        add_frame_drag_event:function(){
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
        encode:function(code){
            return window.btoa(code);
        }
    }
}
</script>
<style lang="scss" rel="stylesheet/scss">
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
</style>
