<template>
  <div class="main_board" style="padding-top:30px;box-sizing:border-box;">
    <div id="tip_b" v-bind:style="{top:tip_show + 'px'}">{{tip_content}}</div>
    <div class="center_main" style="width:100% !important;margin-left:0px !important;min-width:0px;">
      <!-- <div
        class="backto iconfont"
        style="float:left;font-size: 14px;
    height: 30px;
    line-height: 30px;"
        v-on:click="$router.push('/board/e/'+encode(drama_id)+'/'+encode(episode_id))"
      >&#xe6a8;</div> -->
      <div class="save-btn iconfont" style="font-size: 14px;
    height: 30px;    width: 40px;
    line-height: 30px;" v-on:click="save()">&#xe6bd;</div>
      <!-- <script>
                    $(".backto").on("click",function(){
                        backto("/jeditor/drama/" + drama_id);
                    })
      </script>-->
      <div
        class="top_info-btn iconfont"
        style="font-size: 14px;
    height: 30px;
    line-height: 30px;"
        v-on:click="top_info_show = top_info_show==false?true:false;"
      >&#xe7b8; 场景信息</div>
      <div class="highlight-btn iconfont" style="font-size: 14px;height: 30px;width: 70px;line-height: 30px;background: #3F51B5;float: left;top: 10px;margin: 10px 0px;left: 0px;border-radius: 50px;box-shadow: 0px 2px 5px rgba(0,0,0,.2);text-align: center;color: white;cursor: pointer;"
       v-on:click="method_highlight()">&#xe693; 高亮</div>
      <div
        class="simple_info iconfont"
        v-bind:style="{
            marginTop:top_info_show?'15px':'0px',
            opacity:top_info_show?'0':'1',
            position: 'absolute',
            top: '0px',
            left: '10px',
            height: '30px',
            lineHeight: '30px',
            padding: '0px',
            margin: '0px',
            }"
      >
        <span>&#xe664;</span>
        {{scene_name}}
        <span style="margin-left: 20px;">&#xe632;</span>
        {{scene_location}}
        <span v-show="scene_time_statics_show">
          <span style="margin-left: 20px;">&#xe6d3;</span>
          {{scene_time_statics}}
        </span>
      </div>


      <div class="scene_main_board" style="width: calc(100% - 20px);    height: calc(100% - 50px);
    top: 50px;
    font-size: .9em;">
        <div class="top_info" v-show="top_info_show" style="left:0px;">
          <div class="form" id="info_form">
            <div class="item">
              <div class="item_title iconfont">&#xe664; 场名称</div>
              <div class="item_content">
                <input type="text" value name="scene_name" autocomplete="off" v-model="scene_name" />
              </div>
            </div>
            <div class="item">
              <div class="item_title iconfont">&#xe64e; 主要角色</div>
              <div
                class="item_content"
                style="background: #EEE;border-radius: 10px;padding: 10px 5px;"
              >
                <div class="little-item" v-for="item in main_roles">
                  {{item.name}}
                  <div class="deleteItself" v-on:click="del_main_role(item.name)">✘</div>
                  <div class="editItself iconfont" v-on:click="show_next($event)">&#xe671;</div>
                  <div class="status_board" style="display:none;">
                    <div class="status_info">
                      <div class="status" v-for="s in item.status">
                        {{s}}
                        <div class="deleteItself" v-on:click="del_main_role_status(s,item.name)">✘</div>
                      </div>
                    </div>
                    <input type="text" v-on:keyup.enter="push_main_role_status($event,item.name)" />
                  </div>
                </div>
                <input
                  type="text"
                  value
                  name="main_roles"
                  autocomplete="off"
                  style="background: #009688;border-radius: 10px;width: 200px;height: 25px;color: white;margin:5px;"
                  v-on:keyup.enter="push_main_role($event)"
                />
              </div>
            </div>
            <div class="item_line">
              <div class="item">
                <div class="item_title iconfont">&#xe79e; 场景</div>
                <div class="item_content">
                  <input type="text" value name="scene_type" autocomplete="off" v-model="scene_id" />
                </div>
              </div>
              <div class="item">
                <div class="item_title iconfont">&#xe8ae; 天气</div>
                <div class="item_content">
                  <input
                    type="text"
                    value
                    name="scene_weather"
                    autocomplete="off"
                    v-model="weather"
                  />
                </div>
              </div>
              <div class="item">
                <div class="item_title iconfont">&#xe601; 发生时间</div>
                <div class="item_content">
                  <input
                    type="text"
                    value
                    name="scene_time"
                    autocomplete="off"
                    v-model="scene_time"
                  />
                </div>
              </div>
            </div>
            <div class="item_line">
              <div class="item">
                <div class="item_title iconfont">&#xe632; 发生地点</div>
                <div class="item_content">
                  <input
                    type="text"
                    value
                    name="scene_location"
                    autocomplete="off"
                    v-model="scene_location"
                  />
                </div>
              </div>
              <div class="item" style="width:100px">
                <div class="item_title iconfont">&#xe693; 高潮</div>
                <div class="item_content switch" style="padding:4px">
                  <input type="checkbox" value name="scene_high" autocomplete="off" />
                  <label for="scene_high" />
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="row">
                            <div id="association"><input type="checkbox"/><span>剧本联想功能</span></div>
          </div>-->
        </div>

        <div class="bottom_textarea" id="editor">
          <div id="menu"></div>
          <div id="content_title" @click="top_info_show=true">
            <p>{{scene_name}}</p>
            <p>{{scene_location}} {{weather}}</p>
          </div>
          <div id="content"></div>
        </div>
        <div id="association_board" v-show="association_flag">
            <div class="association_item">大家好</div>
            <div class="association_item">童话</div>
      </div>
      </div>
      <div
        class="menu"
        v-show="tag_menu.__show"
        v-bind:style="{top:tag_menu.top + 'px', left:tag_menu.left+'px'}"
      >
        <div
          class="selected"
          style="width: calc(100% - 10px);overflow: hidden;margin-left:5px;padding:5px 0px;box-sizing: border-box;font-size: 12px;text-shadow: 1px 1px 2px rgba(0,0,0,.3);    border-bottom: 1px solid #eee;"
        >已选中：{{tag_text}}</div>
        <div class="item" v-on:click="tag_person">
          <div class="icon"></div>
          <div class="text">人物</div>
        </div>
        <div class="item" v-on:click="tag_event">
          <div class="icon"></div>
          <div class="text">事件</div>
        </div>
        <div class="item" v-on:click="tag_place">
          <div class="icon"></div>
          <div class="text">地点</div>
        </div>
      </div>

      <div class="scene_tips_board" style="display:none;">
        <div
          style="
                            height: 50px;
                            font-size: 20px;
                            font-weight: bold;
                            text-align: center;
                            line-height: 50px;
                        "
        >提示</div>
        <div class="item" v-for="tip in right_tips" v-show="tip.show">
          <div
            class="item_title"
            :style="{background:COLOR_MAP[tip.status]}"
            v-on:click="tip.todo()"
          >
            {{tip.title}}
            <div class="item_close" v-on:click="tip.show=false"></div>
          </div>
          <div class="item_content" v-html="tip.content"></div>
        </div>
      </div>
      <div
        class="menu"
        v-show="search_n_menu.__show"
        v-bind:style="{top:search_n_menu.top + 'px', left:search_n_menu.left+'px'}"
      >
        <div
          class="selected"
          style="width: calc(100% - 10px);overflow: hidden;margin-left:5px;padding:5px 0px;box-sizing: border-box;font-size: 12px;text-shadow: 1px 1px 2px rgba(0,0,0,.3);    border-bottom: 1px solid #eee;"
        >已选中：{{search_text}}</div>
        <div class="item" v-on:click="search_n">
          <div class="icon"></div>
          <div class="text">搜索</div>
        </div>
      </div>
      <div id="search_frame_board" v-show="search_frame.search_frame_show">
        <iframe id="search_frame" v-bind:src="search_frame.search_frame_url" scrolling="no"></iframe>
        <div id="search_frame_c_btn" v-on:click="search_frame.search_frame_show=false;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../index";
import "../../css/base.css";
import "../../css/jeditor.css";
import "../../css/scene.css";
import "../../css/line.css";
import dialog from "../../js/dialog/dialog";
const $ = require("jquery");
const Dialog = require("../../js/dialog/dialog").default.Dialog;
const Loadding = require("../../js/loadding").default.Loadding;
const Storage = sessionStorage;
// const base = require("../../js/base").default;

export default {
  components: {},
  props: ["encode_drama_id", "encode_episode_id", "encode_scene_id"],
  data() {
    return {
      drama_id: 0,
      episode_id: 0,
      scene_id: 0,
      nre_board_show:false,
      nre_loading:false,
      nre_list:[
      ],
      association_flag:false,
      highlight:false,
      COLOR_MAP: { normal: "#5e5e5e", success: "#26A69A", failed: "#E57373" },
      top_info_show: false,
      methods_show: false,
      search_frame: {
        search_frame_show: false,
        search_frame_url: ""
      },
      scene_time_statics: "0s",
      scene_time_statics_show: false,
      scene_time_statics_timeout: null,
      scene_name: "",
      tip_content: "",
      selected: null,
      people: {},
      event: {},
      place: {},
      tag_text: "",
      tag_menu: {
        left: 0,
        top: 0,
        __show: false
      },
      search_text: "",
      search_n_menu: {
        left: 0,
        top: 0,
        __show: false
      },
      menu_type: "default",
      right_tips: [],
      tip_show: false,
      main_roles: [],
      main_roles_map: [],
      scene_type: "",
      weather: "",
      scene_time: "",
      scene_location: "",
      dialogue: [],
      dialog_loadded: {},
      lines: [],
      character_list: [],
      session_store: [
        "main_roles",
        "main_roles_map",
        "drama_id",
        "episode_id",
        "scene_id",
        "scene_name",
        "scene_type",
        "weather",
        "scene_time",
        "scene_location",
        "dialogue",
        "dialog_loadded",
        "lines"
      ],
      session_is_json: [
        true,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        true,
        true
      ]
    };
  },
  mounted: function() {
    // base.reset_rightboard_width();
    $("#left_board").remove();
    $('#right_board').css("width","100%");
    $('.center_main').css("width","100%");
    var first_loadding = new Loadding();
    first_loadding.add_title("初始化");
    first_loadding.__init__();
    var that = this;
    this.drama_id = window.atob(this.encode_drama_id);
    this.episode_id = window.atob(this.encode_episode_id);
    this.scene_id = window.atob(this.encode_scene_id);
    first_loadding.add_process("加载编辑器", function() {
      that.__init_eidtor();
    });
    // first_loadding.add_process(
    //     "添加联想功能",
    //     function(){
    //         that.__add_associate();
    //     }
    // )

    // 判断sessionStorage是否为空
    if (
      Storage.getItem("editor_content") == null ||
      this.scene_id != Storage.getItem("editor_scene_id") ||
      this.episode_id != Storage.getItem("editor_episode_id") ||
      this.drama_id != Storage.getItem("editor_drama_id")
    ) {
      first_loadding.add_process("拉取云服务器资源", function() {
        that.__init_from_server();
      });
    } else {
      first_loadding.add_process("导入本地存储", function() {
        that.character_list = JSON.parse(Storage.getItem("character_list"));
        that.__init_sessionStorage();
      });
    }
    if (
      Storage.getItem("character_list") == null ||
      Storage.getItem("current_drama_id") != this.drama_id
    ) {
      first_loadding.add_process("拉取人物信息", function() {
        $.ajax({
          type:"POST",
xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
url: ROOT_HOST + "/jeditor/api/ch/" + that.drama_id,
          async: false,
          dataType: "json",
          success: function(returndata) {
            that.character_list = returndata;
            Storage.setItem("character_list", JSON.stringify(returndata));
            Storage.setItem("current_drama_id", that.drama_id);
          }
        });
      });
    } else {
      that.character_list = JSON.parse(Storage.getItem("character_list"));
    }

    first_loadding.add_process("增加快捷键", function() {
      that.init_keydown_dectection();
    });
    first_loadding.add_process("添加搜索操作事件", function() {
      that.add_search_event();
    });
    first_loadding.add_process("添加智能联想操作事件", function() {
      that.add_ass_event();
    });

    first_loadding.start(
      function() {
        that.add_right_tip("加载成功", "data loadded!", "success");
      },
      function() {
        that.add_right_tip(
          "加载失败",
          "请检查网络连接并重新刷新页面。",
          "failed"
        );
      }
    );
  },
  methods: {
    __init_eidtor: function() {
      var E = require("../../js/wangeditor/js/index").default;
      var that = this;
      this.editor = new E("#menu", "#content");

      (this.editor.customConfig.menus = [
        "bold",
        "italic",
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "undo", // 撤销
        "redo" // 重复
      ]),
        (this.editor.customConfig.onchange = function(html) {
          // 监控变化，同步更新到 textarea
          // console.log(nodejieba.cut(that.dialogs))
          that.associate();
          that.save_to_sessionStorage(html);
        });
      this.editor.create();
      this.editor.$textContainerElem[0].style.height = "calc(100% - 31px)";
      this.editor.$textContainerElem[0].style.border = "0px";
      this.editor.$toolbarElem[0].style.border = "0px";
      this.__init_menu__();
    },
    save_to_sessionStorage: function(html) {
      var s = window.sessionStorage;
      for (var i = 0; i < this.session_store.length; i++) {
        if (this.session_is_json[i]) {
          s.setItem(
            "editor_" + this.session_store[i],
            JSON.stringify(this[this.session_store[i]])
          );
        } else {
          s.setItem(
            "editor_" + this.session_store[i],
            this[this.session_store[i]]
          );
        }
      }
      s.setItem("editor_content", html);
    },
    // __add_associate: function() {
    //   // association function
    //   var that = this;
    //   var association_btn = $(
    //     "<div class='w-e-menu' style='z-index:10001;'><i class='w-e-icon-association iconfont' style='font-family:iconfont !important'></i></div>"
    //   );
    //   $(this.editor.$toolbarElem[0]).append(association_btn);
    //   var association_flag = false;
    //   association_btn.on("click", function() {
    //     if (association_flag) {
    //       that.to_tip("联想功能关闭");
    //       association_btn.find("i").css("color", "#999");
    //       association_flag = false;
    //     } else {
    //       association_btn.find("i").css("color", "#fbc02d");
    //       that.to_tip("联想功能打开");
    //       association_flag = true;
    //     }
    //   });
    // },
    __init_menu__: function() {
      var that = this;
      this.selection = window.getSelection();
      this.tag = $(
        "<div class='item'><div class='icon'></div><div class='text'>Tag</div></div>"
      );
      this.menu = $("<div class='menu' style='display:none;'></div>");

      this.menu.append(this.tag);
      $(document.body).append(this.menu);
      $(this.editor.$textContainerElem[0]).contextmenu(function(ev) {
        //阻止鼠标的默认事件
        ev.preventDefault();
        if (that.menu_type != "default") return;
        that.selected = document.getSelection();
        that.tag_text = that.selected.toString();
        that.tag_menu.left = ev.pageX;
        that.tag_menu.top = ev.pageY;
        that.tag_menu.__show = true;
      });

      this.editor.$textContainerElem[0].onclick = function(ev) {
        //阻止鼠标的默认事件
        ev.preventDefault();
        that.tag_menu.__show = false;
        that.search_n_menu.__show = false;
        that.menu_type = "default";
      };
    },
    __init_sessionStorage: function() {
      console.log("Load From SeesionStorage.");

      for (var i = 0; i < this.session_store.length; i++) {
        if (this.session_is_json[i]) {
          console.log(this.session_store[i]);
          this[this.session_store[i]] = JSON.parse(
            Storage.getItem("editor_" + this.session_store[i])
          );
        } else {
          this[this.session_store[i]] = Storage.getItem(
            "editor_" + this.session_store[i]
          );
        }
      }
      this.editor.txt.html(Storage.getItem("editor_content"));
    },
    __init_from_server: function() {
      var that = this;
      console.log("Load From Server", ROOT_HOST);
      $.ajax({
        type:"POST",
xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
url:
          ROOT_HOST +
          "/jeditor/api/scene/" +
          that.drama_id +
          "/" +
          that.episode_id +
          "/" +
          that.scene_id,
        contentType: "json",
        async: false,
        success: function(data) {
          for (var i in data[0][0]) {
            that[i] = data[0][0][i];
          }
          for (var i = 0; i < that.main_roles.length; i++) {
            that.main_roles_map.push(that.find_character(that.main_roles[i]));
          }
        },
        error: function(data) {
          console.log("error", data);
        }
      });
      $.ajax({
        type:"POST",
xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
url:
          ROOT_HOST +
          "/jeditor/api/dialog/" +
          that.drama_id +
          "/" +
          that.episode_id +
          "/" +
          that.scene_id,
        contentType: "json",
        async: false,
        success: function(data) {
          that.dialog_loadded = {};
          if (data[0] != null)
            for (var i = 0; i < data[0].length; i++) {
              that.dialog_loadded[data[0][i]["dialog_id"]] = data[0][i];
            }
        },
        error: function(data) {
          console.log("error", data);
        }
      });
      //append_first
      //that.editor.txt.append("<li><div class='lc'><br/></div></li>")
      if (that.dialogue != null)
        for (var i = 0; i < that.dialogue.length; i++) {
          that.clean_last_p();
          // if (!/[0-9]/.test(that.dialogue[i])) {
          if (!that.dialog_loadded[that.dialogue[i]]) {
            if (that.dialogue[i].substring(0, 2) == "//")
              that.editor.txt.append(
                "<li class='annotate_line'>" +
                  that.dialogue[i].substring(2, that.dialogue[i].length) +
                  "</li>"
              );
            else
              that.editor.txt.append(
                "<li><div class='lc'>" + that.dialogue[i] + "</div></li>"
              );
          } else {
            console.log(that.dialogue[i]);
            that.editor.txt.append(
              "<p>" + that.dialog_loadded[that.dialogue[i]].content + "</p>"
              
            );
            that.lines.push(that.dialogue[i]);
          }
        }
      this.save_to_sessionStorage(that.editor.txt.html());
    },
    tag_person: function() {
      if (this.tag_text == "") {
        return;
      }
      var that = this;
      var id = new Date().getTime();
      this.people[id] = { domid: id, text: that.tag_text };
      new Promise(resolve => {
        that.editor.cmd.do("delete");
        that.editor.cmd.do(
          "insertHTML",
          "<i class='tag tag_person' id='tag_person_" +
            id +
            "'>" +
            that.tag_text +
            "</i>"
        );
        that.tag_menu.__show = false;
        setTimeout(function() {
          resolve(id);
        }, 200);
      }).then(val => {
        that.people[val].dom = $("#tag_person_" + val);

        var delete_b = $("<div class='del_btn' pid=" + val + "></div>");
        that.people[val].dom.append(delete_b);
        that.editor.change();
        delete_b.on("click", function() {
          var id = this.getAttribute("pid");
          that.people[id].dom.before(that.people[id].text);
          that.people[id].dom.remove();
          that.people[id] = null;
        });
        that.tag_text = that.selected.toString();
      });
    },
    tag_event: function() {
      if (this.tag_text == "") {
        return;
      }
      var that = this;
      var id = new Date().getTime();
      this.event[id] = { domid: id, text: that.tag_text };
      new Promise(resolve => {
        that.editor.cmd.do("delete");
        that.editor.cmd.do(
          "insertHTML",
          "<i class='tag tag_event' id='tag_event_" +
            id +
            "'>" +
            that.tag_text +
            "</i>"
        );
        that.tag_menu.__show = false;
        setTimeout(function() {
          resolve(id);
        }, 200);
      }).then(val => {
        that.event[val].dom = $("#tag_event_" + val);

        var delete_b = $("<div class='del_btn' pid=" + val + "></div>");
        that.event[val].dom.append(delete_b);
        that.editor.change();
        delete_b.on("click", function() {
          var id = this.getAttribute("pid");
          that.event[id].dom.before(that.event[id].text);
          that.event[id].dom.remove();
          that.event[id] = null;
        });
        that.tag_text = that.selected.toString();
      });
    },
    tag_place: function() {
      if (this.tag_text == "") {
        return;
      }
      var that = this;
      var id = new Date().getTime();
      this.place[id] = { domid: id, text: that.tag_text };
      new Promise(resolve => {
        that.editor.cmd.do("delete");
        that.editor.cmd.do(
          "insertHTML",
          "<i class='tag tag_place' id='tag_place_" +
            id +
            "'>" +
            that.tag_text +
            "</i>"
        );
        that.tag_menu.__show = false;
        setTimeout(function() {
          resolve(id);
        }, 200);
      }).then(val => {
        that.place[val].dom = $("#tag_place_" + val);

        var delete_b = $("<div class='del_btn' pid=" + val + "></div>");
        that.place[val].dom.append(delete_b);
        that.editor.change();
        delete_b.on("click", function() {
          var id = this.getAttribute("pid");
          that.place[id].dom.before(that.place[id].text);
          that.place[id].dom.remove();
          that.place[id] = null;
        });
        that.tag_text = that.selected.toString();
      });
    },
    del_main_role: function(name) {
      var idx = this.is_character_in_scene(name);
      if (idx != -1) {
        this.main_roles.splice(idx, 1);
      }
      this.save_to_sessionStorage(this.editor.txt.html());
    },
    del_main_role_status: function(status, name) {
      for (var i = 0; i < this.main_roles.length; i++) {
        if (this.main_roles[i].name == name) {
          for (var j = 0; j < this.main_roles[i].status.length; j++) {
            if (this.main_roles[i].status[j] == status) {
              this.main_roles[i].status.splice(j, 1);
              this.save_to_sessionStorage(this.editor.txt.html());
              return;
            }
          }
          return;
        }
      }
    },
    find_character: function(name) {
      for (var i = 0; i < this.character_list.length; i++) {
        if (
          this.character_list[i].name == name ||
          this.character_list[i].other_name.search(name) != -1
        ) {
          return i;
        }
      }
      return -1;
    },
    is_character_in_scene: function(name) {
      for (var i = 0; i < this.main_roles.length; i++) {
        if (this.main_roles[i].name == name) {
          return i;
        }
      }
      return -1;
    },
    push_main_role: function(ev) {
      var name = ev.path[0].value;

      var rep = this.is_character_in_scene(name);
      if (rep != -1) {
        this.to_tip("角色重复");
        ev.path[0].style.background = "#E57373";
        setTimeout(function() {
          ev.path[0].style.background = "#009688";
        }, 500);
        return;
      }

      var index = this.find_character(name);
      if (index == -1) {
        this.to_tip("该剧本无此角色");
        ev.path[0].style.background = "#E57373";
        setTimeout(function() {
          ev.path[0].style.background = "#009688";
        }, 500);
        return;
      }

      this.main_roles.push({
        name: this.character_list[index].name,
        id: this.character_list[index].id
      });
      this.main_roles_map.push(index);
      ev.path[0].value = "";
      this.save_to_sessionStorage(this.editor.txt.html());
    },
    push_main_role_status: function(ev, name) {
      var status = ev.path[0].value;
      for (var i = 0; i < this.main_roles.length; i++) {
        if (this.main_roles[i].name == name) {
          if (String(this.main_roles[i].status) == "undefined")
            this.$set(this.main_roles[i], "status", []);
          for (var j = 0; j < this.main_roles[i].status.length; j++) {
            if (this.main_roles[i].status[j] == status) {
              this.to_tip("标签重复");
              ev.path[0].style.background = "#E57373";
              setTimeout(function() {
                ev.path[0].style.background = "#009688";
              }, 500);
              return;
            }
          }
          this.main_roles[i].status.push(status);
          ev.path[0].value = "";
          this.save_to_sessionStorage(this.editor.txt.html());
          return;
        }
      }
    },
    to_tip: function(msg) {
      var that = this;
      that.tip_show = 10;
      that.tip_content = msg;
      console.log(msg);
      setTimeout(function() {
        that.tip_show = -100;
      }, 1000);
    },
    tokenize: function(dom, todo = null) {
      var d = null;
      var sent = dom.text();
      var that = this;
      console.log(sent);
      $.ajax({
        type:"POST",
xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
url: ROOT_HOST + "/tool/tokenize",
        data: { words: sent },
        dataType: "json",
        success: function(data) {
          d = { dom: dom, w: data };
          if (todo != null) {
            todo(d);
          }
        }
      });
      return d;
    },
    clean_last_p: function() {
      let lastone = this.editor.$textElem[0].lastElementChild;
      if (lastone.tagName == "P" && lastone.innerText == "\n") {
        lastone.remove();
      }
    },
    init_keydown_dectection: function() {
      var that = this;
      var HotKey = require("../../js/HotKey").default.HotKey;
      HotKey.setRootDom(this.editor.$textContainerElem[0]);
      HotKey.__init__();
      //dialog
      function find_top_father(dom) {
        if (dom.parentElement.getAttribute("class") == "w-e-text") {
          return dom;
        } else {
          return find_top_father(dom.parentElement);
        }
      }
      function after(html) {
        var ele = window.getSelection().focusNode;
        var new_one = $(html);
        if (
          ele.nodeName != "#text" &&
          ele.getAttribute("class") == "w-e-text"
        ) {
          $(ele).append(new_one);
        } else {
          $(find_top_father(ele)).after(new_one);
        }
        new_one.find(".man").on("click", function() {
          var man = this;
          var m = $("<div class='select_man' contenteditable=false></div>");
          var c = $("<div class='select_item c_btn'></div>");
          c.on("click", function() {
            m.remove();
          });
          m.append(c);
          for (var i = 0; i < that.main_roles.length; i++) {
            let n = $(
              "<div class='select_item' cid=" +
                that.main_roles[i].id +
                ">" +
                that.main_roles[i].name +
                "</div>"
            );
            n.on("click", function() {
              man.innerHTML =
                this.innerHTML +
                "<span cid=" +
                this.getAttribute("cid") +
                " />";
              m.remove();
            });
            m.append(n);
          }
          $(man.parentElement).append(m);
        });
        new_one.find(".line_keywords").on("click", function() {
          var k = this;
          // <div class='keywords_board'><div class='keyword_item'>大家</div></div>
          var m = $("<div class='keywords_board' contenteditable=false></div>");
          var c = $("<div class='keyword_item c_btn'></div>");
          c.on("click", function() {
            m.remove();
          });
          var loadding = $(
            "<div class='keyword_item loadding'><span></span><span></span><span></span><span></span><span></span></div>"
          );
          m.append(c);
          m.append(loadding);
          $(k.parentElement).append(m);
          var sent = k.parentElement.getElementsByClassName("lc")[0].innerText;
          var res = [];
          $.ajax({
            type: "GET",
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            url: ROOT_HOST + "/tool/queryKeywords/" + sent,
            contentType: "json",
            async: true,
            success: function(data) {
              loadding.remove();
              if ($.parseJSON(data).data == "") {
                m.append(
                  "<div style='line-height: 30px;font-size: 14px;text-align: center;margin-left: 10px;'>无关键词</div>"
                );
              } else {
                res = $.parseJSON(data).data.split("； ");
                for (var i = 0; i < res.length; i++) {
                  if (res[i] == "") continue;
                  let n = $("<div class='keyword_item'>" + res[i] + "</div>");
                  m.append(n);
                }
              }

              console.log("success:", res);
            },
            error: function(data) {
              loadding.remove();
              console.log("error:", data);
              m.append(
                "<div style='line-height: 30px;font-size: 14px;text-align: center;margin-left: 10px;'>无关键词</div>"
              );
            }
          });
          // if(res.length==0){m.append("<div style='line-height: 30px;font-size: 14px;text-align: center;margin-left: 10px;'>无关键词</div>");}
        });

        select(new_one.find(".lc")[0]);
      }
      function select(element) {
        var range = document.createRange(); //创建一个选中区域
        range.selectNodeContents(element); //选中节点的内容
        range.setEnd(element.childNodes[0], element.innerHTML.length);
        range.setStart(element.childNodes[0], 0);
        //range.collapse(true);       //设置选中区域为一个点
        var selection = window.getSelection(); //获取当前选中区域
        selection.removeAllRanges(); //移出所有的选中范围
        selection.addRange(range); //添加新建的范围
      }
      HotKey.add_keys(
        [
          17, //ctrl
          76 //l L
        ],
        function() {
          event.preventDefault();
          that.clean_last_p();
          var id = parseInt(new Date().getTime() / 100);
          var cname, cid;
          that.lines[that.lines.length] = id;
          if (that.main_roles.length == 0) {
            cname = DEFAULT_CHARACHTOR_NAME;
            cid = -1;
          } else {
            cname = that.main_roles[0].name;
            cid = that.main_roles[0].id;
          }
          after(
            "<li class='line dialog_line' id='" +
              id +
              "_line'><div class='line_keywords iconfont' contenteditable='false'></div><div class='man' contenteditable=false>" +
              cname +
              "<span cid=" +
              cid +
              "></span></div> <div class='lc' contenteditable=true> 请输入内容 </div></li>"
          );
        }
      );
      //action
      HotKey.add_keys(
        [
          18, //alt
          65 //a A
        ],
        function() {
          event.preventDefault();
          that.clean_last_p();
          var id = new Date().getTime();
          that.lines[that.lines.length] = id;
          after(
            "<li class='line action_line' id='" +
              id +
              "_line'><div class='lc' contenteditable=true> 请输入内容 </div></li>"
          );
        }
      );
      //annotate
      HotKey.add_keys(
        [
          17, //alt
          65 // /
        ],
        function() {
          event.preventDefault();
          that.clean_last_p();
          after(
            "<li class='annotate_line'><div class='lc' contenteditable=true> 请输入内容 </div></li>"
          );
        }
      );
      HotKey.add_keys(
        [
          13 //enter
        ],
        function() {
          event.preventDefault();
          //that.clean_last_p();
          after("<li><div class='lc'>→</div></li>");
          //that.editor.cmd.do("insertHTML","<p><br/></p>");
        }
      );
      // HotKey.add_keys([
      //     17, // ctrl
      //     13,//enter
      // ],function(){
      //         // event.preventDefault();
      //         // console.log("sfasdf");
      //         // // that.editor.cmd.do("delete");
      //         // that.editor.cmd.do("insertHTML","<br/>");
      //         event.preventDefault();
      //         that.clean_last_p();
      //         that.editor.txt.append("<p><br/></p>");
      // });

      HotKey.add_keys([17, 18, 68], function() {
        for (var i = 0; i < that.lines.length; i++) {
          var id = that.lines[i];
          var dom = $("#" + id + "_line");
          if (dom.length == 0) continue;

          dom = dom.find(".lc");

          new Promise(function(resolve, reject) {
            // 一段耗时的异步操作
            var res = that.tokenize(dom, resolve);
            //resolve(res) // 数据处理完成
            // reject('失败') // 数据处理出错
          }).then(
            res => {
              var inner_t = "";
              var dom = res.dom;
              for (let i = 0; i < res.w.length; i++) {
                var temp =
                  "<span class='tokenized-word " +
                  res.w[i].pos +
                  "'>" +
                  res.w[i].word +
                  "</span>";
                inner_t = inner_t + temp;
              }
              // console.log(dom)
              dom.html(inner_t);
              that.to_tip("智能识别成功");
              that.add_search_event();
              // console.log(dom)
            }, // 成功
            err => {
              console.log(err);
            } // 失败
          );
        }
      });

      $(".select_man").remove();
      $(".man").on("click", function() {
        var man = this;
        var m = $("<div class='select_man' contenteditable=false></div>");
        var c = $("<div class='select_item c_btn'></div>");
        c.on("click", function() {
          m.remove();
        });
        m.append(c);
        if (that.main_roles.length == 0) {
          m.append(
            "<div style='line-height: 30px;font-size: 14px;text-align: center;margin-left: 10px;'>无角色添加</div>"
          );
        } else {
          for (var i = 0; i < that.main_roles.length; i++) {
            let n = $(
              "<div class='select_item' cid=" +
                that.main_roles[i].id +
                ">" +
                that.main_roles[i].name +
                "</div>"
            );
            n.on("click", function() {
              man.innerHTML =
                this.innerHTML +
                "<span cid=" +
                this.getAttribute("cid") +
                " />";
              m.remove();
            });
            m.append(n);
          }
        }
        $(man.parentElement).append(m);
      });

      $(".keywords_board").remove();
      $(".line_keywords").on("click", function() {
        var k = this;
        // <div class='keywords_board'><div class='keyword_item'>大家</div></div>
        var m = $("<div class='keywords_board' contenteditable=false></div>");
        var c = $("<div class='keyword_item c_btn'></div>");
        c.on("click", function() {
          m.remove();
        });
        var loadding = $(
          "<div class='keyword_item loadding'><span></span><span></span><span></span><span></span><span></span></div>"
        );
        m.append(c);
        m.append(loadding);
        $(k.parentElement).append(m);
        var sent = k.parentElement.getElementsByClassName("lc")[0].innerText;
        var res = [];
        $.ajax({
          type: "GET",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          url: ROOT_HOST + "/tool/queryKeywords/" + sent,
          contentType: "json",
          async: true,
          success: function(data) {
            loadding.remove();
            if ($.parseJSON(data).data == "") {
              m.append(
                "<div style='line-height: 30px;font-size: 14px;text-align: center;margin-left: 10px;'>无关键词</div>"
              );
            } else {
              res = $.parseJSON(data).data.split("； ");
              for (var i = 0; i < res.length; i++) {
                if (res[i] == "") continue;
                let n = $("<div class='keyword_item'>" + res[i] + "</div>");
                m.append(n);
              }
            }

            console.log("success:", res);
          },
          error: function(data) {
            loadding.remove();
            console.log("error:", data);
            m.append(
              "<div style='line-height: 30px;font-size: 14px;text-align: center;margin-left: 10px;'>无关键词</div>"
            );
          }
        });

        // if(res.length==0){m.append("<div style='line-height: 30px;font-size: 14px;text-align: center;margin-left: 10px;'>无关键词</div>");}
      });
    },
    add_right_tip: function(title, content, status, todo = null) {
      this.right_tips.push({
        title: title,
        content: content,
        status: status,
        show: true,
        todo: todo
      });
    },
    save: function() {
      var that = this;
      var dialog_set = new Dialog(
        that.drama_id,
        that.episode_id,
        that.scene_id
      );
      var now_set = {};

      var lineList = document.getElementsByClassName("line");
      for (var i = 0; i < lineList.length; i++) {
        var tmp = {};
        // dialog_id,scene_id,episode_id,drama_id,author_id,character_id,content,attachment,remark
        tmp["dialog_id"] = lineList[i].getAttribute("id").split("_line")[0];
        tmp["scene_id"] = that.scene_id;
        tmp["episode_id"] = that.episode_id;
        tmp["drama_id"] = that.drama_id;
        // no author_id
        try {
          if (lineList[i].firstElementChild.getAttribute("class") == "man") {
            tmp["character_id"] = lineList[
              i
            ].firstElementChild.firstElementChild.getAttribute("cid");
          } else {
            tmp["character_id"] = -1;
          }
        } catch {
          tmp["character_id"] = -1;
        }

        tmp["content"] = lineList[i].outerHTML;
        tmp["attachment"] = "None";
        let type = lineList[i].classList[1].split("_line")[0];
        tmp["remark"] = JSON.stringify({ type: type });
        now_set[tmp["dialog_id"]] = tmp;
      }
      // init dialogue
      var new_dialogue = [];
      var children = that.editor.$textElem[0].children;
      for (var i = 0; i < children.length; i++) {
        if (children[i].tagName == "P") {
          continue;
        }
        if (children[i].className == "annotate_line")
          new_dialogue[new_dialogue.length] = "//" + children[i].innerHTML;
        else if (children[i].className == "")
          new_dialogue[new_dialogue.length] =
            children[i].firstElementChild.innerHTML;
        else {
          new_dialogue[new_dialogue.length] = children[i]
            .getAttribute("id")
            .split("_line")[0];
        }
      }
      var scene_info = {
        scene_name: that.scene_name,
        main_roles: that.main_roles,
        scene_type: that.scene_type,
        scene_time: that.scene_time,
        scene_location: that.scene_location
      };
      dialog_set.__init__(
        that.dialog_loadded,
        now_set,
        that.dialogue,
        new_dialogue,
        scene_info
      );
      dialog_set.save(
        () => {
          that.dialog_loadded = now_set;
          that.dialogue = new_dialogue;
          that.add_right_tip(
            "对话内容保存成功",
            "save successfully!",
            "success"
          );
          that.save_to_sessionStorage(that.editor.txt.html());
        },
        () => {
          that.add_right_tip("对话内容保存失败", "save failed!", "failed");
        }
      );
    },
    method_association: function(ev) {
      var dom = ev.currentTarget;
      if (dom.checked) {
        this.to_tip("联想功能打开");
        this.association_flag = true;
      } else {
        this.to_tip("联想功能关闭");
        this.association_flag = false;
      }
    },
    method_highlight: function() {
      if (this.highlight==false) {
        this.to_tip("高亮功能打开");
        $(".w-e-text-container").addClass("active_highlight");
        this.highlight=true;
      } else {
        this.to_tip("高亮功能关闭");
        $(".w-e-text-container").removeClass("active_highlight");
        this.highlight=false;
      }
    },
    comput_time: function() {
      var main_dom = $(".scene_main_board");
      var dialogs_line = main_dom.find(".dialog_line").find(".lc");
      this.scene_time_statics = (dialogs_line.length - 1) * 1.5;
      for (var s = 0; s < dialogs_line.length; s++) {
        var t = dialogs_line[s].innerText;
        this.scene_time_statics += t.length * 0.3;
      }
      this.scene_time_statics = this.scene_time_statics.toFixed(1);
      this.scene_time_statics = this.scene_time_statics + "s";
    },
    method_time: function(ev) {
      var dom = ev.currentTarget;
      if (dom.checked) {
        this.to_tip("时间统计功能打开");
        this.scene_time_statics_show = true;
        this.scene_time_statics_timeout = window.setInterval(
          this.comput_time,
          1000
        );
      } else {
        this.to_tip("时间统计功能关闭");
        this.scene_time_statics_show = false;
        window.clearInterval(this.scene_time_statics_timeout);
      }
    },
    encode: function(code) {
      return window.btoa(code);
    },
    show_next: function(ev) {
      ev.currentTarget.nextElementSibling.style.display =
        ev.currentTarget.nextElementSibling.style.display == "none"
          ? "block"
          : "none";
    },
    add_search_event: function() {
      var that = this;
      var n_list = ["n", "nr", "ns", "nt", "nw"];
      for (var i = 0; i < n_list.length; i++) {
        $(".tokenized-word." + n_list[i]).contextmenu(function(ev) {
          //阻止鼠标的默认事件
          // alert("contextmenu show");
          that.menu_type = "search_n";
          that.tag_menu.__show = false;
          that.search_text = ev.target.innerText;
          that.search_n_menu.left = ev.pageX;
          that.search_n_menu.top = ev.pageY;
          that.search_n_menu.__show = true;
        });
      }
    },
    add_ass_event: function() {
      var that = this;
      console.log("add ass");
      that.editor.customConfig.onchange = function(html) {
        console.log(html);
      };
    },
    associate: function() {
      let sel = getSelection();
      if (!sel.isCollapsed) {
        return;
      }
      var length = 0;
      length += sel.anchorOffset;
      var text = sel.anchorNode.data.substring(0, sel.anchorOffset);
      var node = sel.anchorNode.parentElement;
      var sibling = node;
      while (sibling && length <= 5) {
        sibling = sibling.previousElementSibling;
        length += sibling.innerText.length;
        text = sibling.innerText + text;
      }
      console.log(text);
      console.log(node.offsetLeft);
    },
    search_n: function() {
      var loadding = new Loadding();
      var that = this;
      loadding.add_title("搜索：" + this.search_text);
      loadding.__init__();
      loadding.add_process("检索中", function() {
        $.ajax({
          url: ROOT_HOST + "/tool/zhwikiSimpleQuery/" + that.search_text,
          type: "GET",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          success: data => {
            that.add_right_tip(
              "搜索：" + that.search_text,
              "<strong>" + data.name + "</strong>:" + data.content,
              "success",
              function() {
                // alert("frame");
                that.search_frame.search_frame_show = true;
                that.search_frame.search_frame_url =
                  window.location.origin + "/?" + data.name + "#/board/board/edf";
              }
            );
          },
          error: (xhr, error) => {
            that.add_right_tip(
              "搜索：" + that.search_text,
              "数据查找失败!",
              "failed"
            );
          }

        });
      });
      loadding.start();
      this.tag_menu.__show = false;
      this.search_n_menu.__show = false;
      this.menu_type = "default";
    },
    dialog_nre:function(){
      var that = this;
      // empty array
      this.nre_list.splice(0);
      this.nre_loading = true;
      var index = 0;
      var nre_stack = [];
      console.log(that.lines)
      for (var i = 0; i < that.lines.length; i++) {
        var id = that.lines[i];
        var dom = $("#" + id + "_line");
        if (dom.length == 0) continue;

        var dom_content = dom.find(".lc");
        var dom_en1 = dom.find(".man").text();
        var dom_en2s = dom_content.find(".nr");
        if(dom_en2s.length == 0){
          continue;
        }
        else{
          for(var j = 0;j < dom_en2s.length;j++){
            nre_stack.push(that.get_one_relation(dom_en1,dom_en2s[j].innerText,dom_en1 +":"+dom_content.text(),index))
          }
        }
      };
      Promise.all(nre_stack).then(
        reslist=>{
          for(var i = 0;i <reslist.length;i++){
            that.nre_list.push(reslist[i]);
          }
          that.nre_loading=false;
          console.log(that.nre_list)
        }
      )
    },
    get_one_relation:async function(en1,en2,sent,index){
      var that=this,d={
        "index":index,
        "en1":en1,
        "en2":en2,
        "sent":sent,
      };
      await $.ajax({
              type: "GET",
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
              url: ROOT_HOST + "/tool/NRE?sent="+sent+"&en1="+en1+"&en2="+en2,
              dataType: "json",
              contentType:"json",
              success: function(data) {
                d.relations = data;
              }
            });
      return d;
    }
    // Load:function(){
    //     var that=this;
    //     $.ajax({
    //     type: "POST",
    //     url: ROOT_HOST+"/api/dialog/"+that.drama_id+"/"+that.episode_id,
    //     contentType: "json",
    //     success: function(data){
    //             html=""
    //             for(var i = 0; i < data.length;i++){
    //                 data[i]
    //             }
    //         }
    //     });
    // }
  }
};
</script>

<style scoped>
.center_main{
      width: 100% !important;
    margin-left: 0px !important;
}
</style>
