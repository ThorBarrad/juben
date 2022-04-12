<template>
  <div class="main_board">
    <div class="center_main">
      <div class="searchbar">
        <el-select
          @keyup.enter.native="
            searchcontent == ''
              ? null
              : $router.push('/board/e/' + encode(searchcontent))
          "
          class="search_input"
          v-model="searchcontent"
          filterable
          placeholder="请输入剧本名称"
        >
          <el-option
            style="width: 100%;border-radius: 5px;margin: 5px;"
            v-for="item in jumu_data"
            :key="item.id"
            :label="item.drama_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <div class="search_btn">
          <div
            class="btn"
            @click="
              searchcontent == ''
                ? null
                : $router.push('/board/e/' + encode(searchcontent))
            "
          >
            Search
          </div>
        </div>
      </div>
      <div class="item_board">
        <div class="jumu_item" id="new_add_jumu_item">
          <div
            class="title"
            id="new_jumu"
            style="cursor:pointer;"
            v-on:click="add_new_show = true"
          >
            新建剧目
          </div>
          <div class="hidden_menu">
            <div class="btn" style="width:100%;" @click="upLoadClick">上传</div>
          </div>
        </div>
        <div
          style="height:180px;width:2px;background:#ddd;margin:20px 10px;"
        ></div>
        <div
          class="jumu_item"
          v-for="drama in jumu_data"
          :key="drama.id"
          @dblclick="$router.push('/board/e/' + encode(drama.id) + '/allCards')"
        >
          <div
            v-on:click="
              $router.push('/board/e/' + encode(drama.id) + '/allCards')
            "
            class="title"
          >
            {{ drama.drama_name }}
          </div>
          <div class="c_time">{{ drama.c_time }}</div>
          <div class="hidden_menu">
            <div class="btn">
              <a
                class="hidden_a"
                :href="
                  ROOT_HOST +
                    '/tool/downloadword/' +
                    new Date().getTime() +
                    '/' +
                    drama.id
                "
                >下载</a
              >
            </div>
            <div class="btn" v-on:click="show_edit(drama.id)">编辑</div>
            <div class="btn" v-on:click="show_delete(drama.id)">删除</div>
          </div>
        </div>

        <!-- <div class='shuju'>
                    <el-button plain @click="open2">
                        页面详情
                    </el-button>
                </div> -->
      </div>

      <div class="msgBox" id="edit_jumu_board" v-show="edit_show">
        <div class="btn close_btn" v-on:click="edit_show = false"></div>
        <div class="title">编辑剧目</div>
        <div class="form">
          <div class="item">
            <div class="item_title">剧目名称</div>
            <div class="item_content">
              <input
                type="text"
                v-model="edit_drama.drama_name"
                name="drama_name"
              />
            </div>
          </div>
          <div class="item">
            <div class="item_title">剧目题材</div>
            <div class="item_content">
              <input
                type="text"
                v-model="edit_drama.drama_theme"
                name="drama_theme"
              />
            </div>
          </div>
          <div class="item">
            <div class="item_title">剧目类型</div>
            <div class="item_content">
              <input
                type="text"
                v-model="edit_drama.drama_type"
                name="drama_type"
              />
            </div>
          </div>
          <div class="item">
            <div class="item_title">剧目年代</div>
            <div class="item_content">
              <input
                type="text"
                v-model="edit_drama.drama_time"
                name="drama_time"
              />
            </div>
          </div>

          <div class="item">
            <div class="item_title">主要情节</div>
            <div class="item_content">
              <input
                type="text"
                v-model="edit_drama.main_events"
                name="drama_time"
              />
            </div>
          </div>
          <div style="margin-top:20px">
            <div class="bigevents_btn" v-on:click="getdata_function">
              修改大事件
            </div>
          </div>
        </div>

        <div style="height:40px;margin:10px;margin-top:20px;">
          <div class="left left_40">
            <div
              class="btn reset_btn"
              v-on:click="
                reset_from(edit_drama, jumu_data[jumu_data_map[edit_drama.id]])
              "
            >
              reset
            </div>
          </div>
          <div class="right right_60">
            <div class="btn submit_btn" v-on:click="edit">submit</div>
          </div>
        </div>
        <!-- <script>

                </script> -->
      </div>
      <div class="msgBox" id="add_new_jumu_board" v-show="add_new_show">
        <div class="btn close_btn" v-on:click="add_new_show = false"></div>
        <div class="title">新建剧目</div>
        <div class="form" id="new_form">
          <div class="item">
            <div class="item_title">剧目名称</div>
            <div class="item_content">
              <input
                type="text"
                v-model="new_drame.drama_name"
                name="drama_name"
              />
            </div>
          </div>
          <div class="item">
            <div class="item_title">剧目题材</div>
            <div class="item_content">
              <input
                type="text"
                v-model="new_drame.drama_theme"
                name="drama_theme"
              />
            </div>
          </div>
          <div class="item">
            <div class="item_title">剧目类型</div>
            <div class="item_content">
              <input
                type="text"
                v-model="new_drame.drama_type"
                name="drama_type"
              />
            </div>
          </div>
          <div class="item">
            <div class="item_title">剧目年代</div>
            <div class="item_content">
              <input
                type="text"
                v-model="new_drame.drama_time"
                name="drama_time"
              />
            </div>
          </div>
          <div class="item">
            <div class="item_title">主要情节</div>
            <div class="item_content">
              <input
                type="text"
                v-model="new_drame.main_events"
                name="drama_time"
              />
            </div>
          </div>
          <div style="margin-top:20px">
            <div class="bigevents_btn" v-on:click="add_bigevents_show = true">
              添加大事件
            </div>
          </div>
        </div>

        <div style="height:40px;margin:10px;margin-top:20px;">
          <div class="left left_40">
            <div class="btn reset_btn" v-on:click="reset(new_drame)">reset</div>
          </div>
          <div class="right right_60">
            <div class="btn submit_btn" v-on:click="add_new">submit</div>
          </div>
        </div>
      </div>

      <!-- 添加大事件框 -->
      <div class="addBox" v-show="add_bigevents_show">
        <div class="title">添加大事件</div>
        <div
          class="btn close_btn"
          v-on:click="add_bigevents_show = false"
        ></div>
        <div class="littleform">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="大事件:">
              <div
                class="itemitem"
                v-for="(item, index) in eventsArr"
                :key="index"
              >
                <el-input
                  v-model.trim="item.value"
                  placeholder="请输入大事件详情"
                  style="width:250px"
                >
                </el-input>

                <i
                  class="el-icon-delete"
                  @click="deleteItem(index)"
                  v-show="show(index)"
                ></i>
              </div>
            </el-form-item>
          </el-form>
          <div class="button_btn">
            <div class="bigevents_btn" @click="addBook">
              新增
            </div>
            <div class="bigevents_btn" @click="save">
              保存
            </div>
          </div>
        </div>
      </div>

      <div class="addBox" v-show="update_bigevents_show">
        <div class="title">修改大事件</div>
        <div
          class="btn close_btn"
          v-on:click="update_bigevents_show = false"
        ></div>
        <div class="littleform">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="大事件:">
              <div
                class="itemitem"
                v-for="(item, index) in update_eventsArr"
                :key="index"
              >
                <el-input
                  v-model.trim="item.value"
                  placeholder="请输入大事件详情"
                  style="width:250px"
                >
                </el-input>

                <i
                  class="el-icon-delete"
                  @click="update_deleteItem(index)"
                  v-show="show(index)"
                ></i>
              </div>
            </el-form-item>
          </el-form>
          <div class="button_btn">
            <div class="bigevents_btn" @click="update_addBook">
              新增
            </div>
            <div class="bigevents_btn" @click="update_save">
              保存
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="msgBox"
      id="question_board"
      v-show="delete_show"
      style="border-top: 5px solid #F44336;"
    >
      <div
        style="text-align: justify;font-size: 18px;font-weight: 900;padding: 15px 50px;"
      >
        你正在进行删除操作，删除后文件无法恢复，是否继续？
      </div>
      <div id="confirm" style="height:40px;margin:10px;margin-top:20px;">
        <div class="left left_40">
          <div class="btn delete_btn" v-on:click="delete_drama">delete</div>
        </div>
        <div class="right right_60">
          <div
            class="btn cancel_btn"
            v-on:click="
              delete_show = false;
              need_to_delete_id = -1;
            "
          >
            cancel
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="上传剧本"
      :visible.sync="dialogVisible"
      width="40%"
      center
      class="ng-dialog"
    >
      <span>上传说明:上传需要格式,目前只支持txt格式,请自行下载txt示例查看</span>
      <!-- <img
        style="width: 100px; height: 100px;margin-top:10px;"
        src="../../img/samplepicture.png"
      /> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">下载示例txt</el-button>
        <el-button style="margin-left:50px;" @click="dialogVisibleIpt = true"
          >上传本地剧本</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="剧本名"
      :visible.sync="dialogVisibleIpt"
      width="40%"
      center
      class="ng-dialog"
    >
      <!-- <img
        style="width: 100px; height: 100px;margin-top:10px;"
        src="../../img/samplepicture.png"
      /> -->
      <el-input placeholder="请输入剧本名" v-model="drama_name" clearable>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-upload
          class="uploadFile"
          ref="uploads"
          :auto-upload="false"
          :limit="1"
          accept=".txt"
          :action="'http://39.104.83.137:8081/jeditor/api/import_task'"
          :before-upload="beforeUploadFile"
          :file-list="fileList"
          :on-change="fileChange"
          :on-remove="handleRemove"
          :http-request="uploadFiles"
          drag
          width="100%"
          height="100%"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传txt文件</div>
        </el-upload>

        <el-button @click.native="fileSubmit">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="上传成功！"
      :visible.sync="dialogVisibleLabel"
      width="40%"
      center
      class="ng-dialog"
    >
      <span>上传成功！</span>
      <div style="margin-top:30px;">剧本名:{{ drama_name_a }}</div>
      <div>集数:{{ episode_count }}</div>
      <div>场数:{{ scene_count }}</div>
      <div>人物数:{{ character_count }}</div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleLabel = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import "../../css/jeditor.css";
import "../../index";
const $ = require("jquery");
const Loadding = require("../../js/loadding").default.Loadding;
// import Vue from "vue";
// import VueRouter from 'vue-router';
// Vue.use(VueRouter);
// const routes=[
//     {path:"/e/:drama_id"}
// ];

// const router=new VueRouter({routes});
const base = require("../../js/base").default;
export default {
  // router,
  data() {
    return {
      iid: undefined,
      drama_name_a: "",
      episode_count: "",
      scene_count: "",
      character_count: "",
      dialogVisibleLabel: false,
      drama_name: "",
      dialogVisibleIpt: false,
      dialogVisible: false,
      eventsArr: [
        {
          value: "",
        },
      ],

      update_eventsArr: [],
      update_bigevents_show: false,
      main_events: "",
      ROOT_HOST: ROOT_HOST,
      message: "",
      searchcontent: "",
      jumu_data: [],
      jumu_data_map: {},
      add_new_show: false,
      add_bigevents_show: false,
      delete_show: false,
      edit_show: false,
      form_cover: false,
      need_to_delete_id: -1,
      new_drame: {
        drama_name: "",
        main_roles: "",
        drama_theme: "",
        drama_type: "",
        drama_time: "",
        main_events: "",
        all_events: [],
      },
      edit_drama: {
        id: "",
        drama_name: "",
        main_roles: "",
        drama_theme: "",
        drama_type: "",
        drama_time: "",
        main_events: "",
        all_events: [],
      },
      fileList: [],
    };
  },
  mounted: function() {
    base.reset_rightboard_width();
    var that = this;
    console.log(that);
    var first_loadding = new Loadding();
    first_loadding.add_title("初始化");
    first_loadding.__init__();
    first_loadding.add_process("拉取数据", function() {
      //that.__init_eidtor();
      $.ajax({
        type: "POST",
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        url: ROOT_HOST + "/jeditor/api/drama",
        async: false,
        success: function(returndata) {
          //console.log("这是returndata")
          //console.log(returndata)
          that.jumu_data = returndata;
          //console.log(that.jumu_data.length)含有多少剧本

          for (var i = 0; i < returndata.length; i++) {
            that.jumu_data_map[returndata[i].id] = i;
          }
        },
      });
    });
    first_loadding.start();
  },
  methods: {
    beforeUploadFile() {},
    fileChange(file, fileList) {
      this.fileList.push(file);
    },
    handleRemove() {},
    // loaddingClick() {
    //   var first_loadding = new Loadding();
    //   first_loadding.add_title("加载中");
    //   first_loadding.__init__();
    //   first_loadding.add_process("文件上传中", this.uploadFiles);
    //   first_loadding.start();
    // },
    uploadFiles(param) {
      //注意这里是uploadFiles(param),file文件的二进制流转换
      var data = new FormData(); //参数格式的转换，data为接口必选参数
      data.append("drama_txt", param.file); //文件流以参数形式传给后台
      data.append("drama_name", this.drama_name);
      // let data = {
      //   drama_txt: param.file,
      //   drama_name: this.drama_name,
      // };
      var that = this;
      const loading = this.$loading({
        lock: true,
        text: "文件上传中,请稍后！",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      $.ajax({
        type: "POST",
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
        dataType: "json",
        processData: false,
        contentType: false,
        cache: false,
        ifModified: true,
        timeout: 18000000,
        url: ROOT_HOST + "/jeditor/api/import_task",
        // Authorization: this.token,
        // data: JSON.stringify({drama_txt:param.file,drama_name:that.drama_name}),
        data: data,
        async: false,
        success: function(res) {
          this.iid = res.id;
          // that.drama_name_a = res.drama_name;
          // that.episode_count = res.episode_count; //集数
          // that.scene_count = res.scene_count; //场数
          // that.character_count = res.character_count; //人物数
          if (this.iid) {
            let dd = setInterval(() => {
              $.ajax({
                type: "GET",
                xhrFields: {
                  withCredentials: true,
                },
                crossDomain: true,
                // headers: {
                //   "Content-Type": "multipart/form-data",
                // },
                // dataType: "json",
                // processData: false,
                // contentType: false,
                // cache: false,
                // ifModified: true,

                url: ROOT_HOST + `/jeditor/api/import_task/${this.iid}`,
                // Authorization: this.token,
                // data: JSON.stringify({drama_txt:param.file,drama_name:that.drama_name}),
                // data: data,
                async: false,
                success: function(res) {
                  // debugger;
                  if (res !== "proceing...") {
                    loading.close();
                    console.log(res);
                    that.dialogVisibleIpt = false;
                    that.dialogVisible = false;
                    that.drama_name_a = res.drama_name;
                    that.episode_count = res.episode_count; //集数
                    that.scene_count = res.scene_count; //场数
                    that.character_count = res.character_count; //人物数
                    clearInterval(dd);
                    console.log(res);
                    that.drama_name = "";
                    that.fileList = [];
                    that.dialogVisibleLabel = true;
                  }
                },
              });
            }, 5000);
          }
        },
      });
    },

    fileSubmit() {
      // console.log(this.$refs.uploads.submit());
      // console.log(this.$refs.uploads);
      if (!this.drama_name) {
        return this.$message.error("请您先填写剧本名称！");
      }
      this.$refs.uploads.submit();
    },
    //上传
    upLoadClick() {
      this.dialogVisible = true;
    },

    // 获取大事件信息 by A_jian
    getdata_function: function() {
      this.update_bigevents_show = true;

      console.log("获得dramaid");
      console.log(this.need_to_edit_id);
      var that = this;
      that.edit_drama.all_events = [];
      $.ajax({
        type: "POST",
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        url: ROOT_HOST + "/jeditor/api/getallmainevents",
        data: JSON.stringify({ drama_id: that.need_to_edit_id }),
        async: false,
        success: function(returndata) {
          console.log("这是returndata");
          console.log(returndata);

          that.update_eventsArr = [];
          returndata.forEach((item) => {
            that.update_eventsArr.push({ value: item.title });
          });

          console.log("这是data");
          console.log(that.update_eventsArr);
        },
      });
    },

    //  新增表单方法  by A_jian
    addBook() {
      this.eventsArr.push({ value: "" });
    },
    update_addBook() {
      this.update_eventsArr.push({ value: "" });
    },

    show(i) {
      if (i == 0) {
        return true;
      } else {
        return true;
      }
    },

    deleteItem(i) {
      this.eventsArr.splice(i, 1);
    },
    update_deleteItem(i) {
      this.update_eventsArr.splice(i, 1);
    },

    save() {
      let num = 0;
      this.eventsArr.forEach((item) => {
        if (item.value == "") {
          num = num + 0;
        } else {
          num = num + 1;
        }
      });

      if (num != this.eventsArr.length) {
        this.$message.error("输入不能为空！");
      } else {
        this.eventsArr.forEach((item) => {
          this.new_drame.all_events.push({ eventid: "", title: item.value });
        });
        console.log(this.new_drame.all_events);
        this.add_bigevents_show = false;
      }
    },

    update_save() {
      let num = 0;
      this.update_eventsArr.forEach((item) => {
        if (item.value == "") {
          num = num + 0;
        } else {
          num = num + 1;
        }
      });

      if (num != this.update_eventsArr.length) {
        this.$message.error("输入不能为空！");
      } else {
        this.update_eventsArr.forEach((item) => {
          this.edit_drama.all_events.push({ eventid: "", title: item.value });
        });
        console.log(this.edit_drama.all_events);

        var that = this;
        console.log(that.edit_drama);
        $.ajax({
          type: "POST",
          xhrFields: {
            withCredentials: true,
          },
          crossDomain: true,
          url: ROOT_HOST + "/jeditor/api/updatedrama/" + that.need_to_edit_id,
          data: JSON.stringify(that.edit_drama),
          async: false,
          success: function() {
            that.update_eventsArr = [];

            console.log("done");
          },
        });

        this.update_bigevents_show = false;
      }
    },

    reset: function(item) {
      for (let i in item) {
        item[i] = "";
      }
    },
    reset_from: function(item1, item2) {
      console.log(item1, item2);
      for (let i in item2) {
        item1[i] = item2[i];
      }
    },
    show_edit: function(id) {
      if (id == -1) {
        return;
      }
      this.need_to_edit_id = id;
      for (var key in this.jumu_data[this.jumu_data_map[id]]) {
        this.edit_drama[key] = this.jumu_data[this.jumu_data_map[id]][key];
      }
      console.log(this.edit_drama);
      this.edit_show = true;
    },
    show_delete: function(id) {
      if (id == -1) {
        return;
      }
      this.need_to_delete_id = id;
      this.delete_show = true;
    },
    open2() {
      this.$notify.info({
        title: "剧本总数为",
        message: this.jumu_data.length,
        offset: 300,
      });
    },
    edit: function() {
      if (this.need_to_edit_id == -1) {
        return false;
      }
      var id = this.need_to_edit_id;
      var that = this;
      var ud_loadding = new Loadding();
      ud_loadding.add_title("更新剧目");
      ud_loadding.__init__();
      ud_loadding.add_process("更新", function() {
        $.ajax({
          type: "POST",
          xhrFields: {
            withCredentials: true,
          },
          crossDomain: true,
          url: ROOT_HOST + "/jeditor/api/updatedrama/" + id,
          data: JSON.stringify(that.edit_drama),
          dataType: "json",
          async: false,
          success: function(returndata) {
            console.log(returndata);
          },
        });
      });
      ud_loadding.start(function() {
        for (var key in that.edit_drama) {
          that.jumu_data[that.jumu_data_map[that.edit_drama.id]][key] =
            that.edit_drama[key];
        }
        that.edit_show = false;
        that.reset(that.edit_drama);
      });
    },
    delete_drama: function() {
      if (this.need_to_delete_id == -1) {
        return false;
      }
      var id = this.need_to_delete_id;
      var that = this;
      var del_loadding = new Loadding();
      del_loadding.add_title("删除剧目");
      del_loadding.__init__();
      del_loadding.add_process("删除", function() {
        $.ajax({
          type: "POST",
          xhrFields: {
            withCredentials: true,
          },
          crossDomain: true,
          url: ROOT_HOST + "/jeditor/api/deletedrama/" + id,
          async: false,
          success: function(returndata) {
            console.log(returndata);
          },
        });
      });
      del_loadding.start(function() {
        for (var i = 0; i <= that.jumu_data.length; i++) {
          if (that.jumu_data[i].id == id) {
            that.jumu_data.splice(i, 1);
            that.delete_show = false;
            break;
          }
        }
        delete that.jumu_data_map[id];
      });
    },
    add_new: function() {
      var that = this;
      var new_form = $("#new_form");
      var items = new_form.find(".item input");

      for (var i = 0; i < items.length; i++) {
        if (items[i].value.length == 0) {
          items[i].style.border = "2px dashed #E57373";
          setTimeout(function() {
            items[i].style.border = "0px dashed transparent";
          }, 1000);
          return;
        }
      }
      var add_loadding = new Loadding();
      add_loadding.add_title("新建剧目");
      add_loadding.__init__();
      add_loadding.add_process("新建", function() {
        $.ajax({
          type: "POST",
          xhrFields: {
            withCredentials: true,
          },
          crossDomain: true,
          url: ROOT_HOST + "/jeditor/api/createdrama",

          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify(that.new_drame),
          async: false,
          dataType: "json",
          success: function(returndata) {
            that.jumu_data.push(returndata);
            that.jumu_data_map[returndata.id] = that.jumu_data.length - 1;
            that.reset(that.new_drame);
          },
          error: function() {
            throw "wrong create drama";
          },
        });
      });
      add_loadding.start(function() {
        that.add_new_show = false;
      });
    },
    encode: function(code) {
      return window.btoa(code);
    },
  },
};
</script>
<style scoped>
.shuju {
  position: absolute;
  right: 20px;
  bottom: 20px;
}
.bigevents_btn {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  background-color: #009688;
  border: none;
  color: white;
  padding: 8px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  margin: 5px;
}
.bigevents_btn:hover {
  background-color: #e91e63; /* Green */
  color: white;
}
.inputarea {
  width: 200px;
  position: absolute;
  margin-top: 50px;
  margin-left: 40px;
}
.littleform {
  position: relative;
  margin-top: 75px;
  width: auto;
}
.button_btn {
  position: relative;
  margin-top: 10px;
  margin-left: 150px;
}
.el-icon-delete {
  position: relative;
  margin-left: 10px;
}
.ng-dialog >>> .el-dialog__body {
  text-align: center !important;
  font-size: 24px !important;
}
</style>
