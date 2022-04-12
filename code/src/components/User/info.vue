<template>
  <div class="main_board">
    <div>
      <el-main>
        <div class="user_info_board">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-row>
                <el-col style="text-align:center;">
                  <div class="avatar" v-html="info.avaterurl"></div>
                </el-col>
              </el-row>
              <el-row class="user_info_edit">
                <el-col style="text-align:center;margin-top:10px;">
                  <div class="btn"><i class="el-icon-edit" /> 编辑</div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="16">
              <el-row class="user_info_item">
                <el-col :span="10">
                  <i class="el-icon-user-solid" /> username:
                </el-col>
                <el-col :span="14">
                  {{ info.username }}
                </el-col>
              </el-row>
              <el-row class="user_info_item">
                <el-col :span="10">
                  <i class="el-icon-phone" /> nickname:
                </el-col>
                <el-col :span="14">
                  {{ info.nickname }}
                </el-col>
              </el-row>
              <el-row class="user_info_item">
                <el-col :span="10">
                  <i class="el-icon-message" /> email:
                </el-col>
                <el-col :span="14">
                  {{ info.email }}
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <el-card class="tabs">
          <el-tabs class="tabsa">
            <el-tab-pane>
              <span slot="label"><i class="el-icon-tickets"></i> 我的作品</span>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label">
                <i
                  class="el-icon-message-solid
"
                ></i>
                动态
              </span>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label">
                <i
                  class="el-icon-chat-dot-round
"
                ></i>
                最新评论
              </span>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label">
                <i
                  class="el-icon-s-grid
"
                ></i>
                热门
              </span></el-tab-pane
            >
          </el-tabs>
        </el-card>
        <h1 style="padding:0 120px;" class="tabs">喜好分布</h1>
        <el-card class="tabs">
          <div id="main" style="width:100%;height:600px;"></div>
        </el-card>
        <h1 style="padding:0 120px;" class="tabs">动态分享</h1>
        <el-card class="tabs" style="padding:20px;">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="有什么新鲜事分享给大家"
            v-model="textarea"
          >
          </el-input>
          <div class="footer-icon">
            <div style="font-size:26px;">
              <i class="el-icon-picture-outline-round"></i>
              <i class="el-icon-picture"></i>
              <i class="el-icon-video-camera-solid"></i>
              <i class="el-icon-location"></i>
              <i class="el-icon-headset"></i>
              <i class="el-icon-more"></i>
            </div>
            <div>
              <i
                class="el-icon-time
"
                style="font-size: 20px;"
              ></i>
              <span
                >公开
                <i
                  class="el-icon-arrow-down
                  
"
                  style="font-size: 20px;"
                ></i
              ></span>
              <el-button type="primary" round>发送</el-button>
            </div>
          </div>
        </el-card>
        <h1 style="padding:0 120px;" class="tabs">每日推荐</h1>
        <el-card
          shadow="hover"
          class="tabs"
          v-for="(item, index) in carsList"
          :key="index"
        >
          <h1 style="font-size:18px;">百年孤独</h1>
          <div>
            <img
              src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
              alt=""
              align="left"
              style="width:200px;height:100px;"
              hspace="8"
            />
            <span>
              《百年孤独》（西班牙语：Cien años de soledad），是哥伦比亚作家加夫列尔·加西亚·马尔克斯的作品，“魔幻现实主义”的代表作，在世界上享有盛誉。作者也因此获得1982年诺贝尔文学奖，瑞典皇家学院的颁奖理由是：“像其他重要的拉丁美洲作家一样，马尔克斯永远为弱小贫穷者请命，而反抗内部的压迫与外来的剥削。”

《百年孤独》发表于1967年，小说以虚构市镇马孔多（Macondo）的荣衰作为拉丁美洲百年沧桑的缩影。以奇诡的手法反映了殖民、独裁、斗争和流血的历史，以及遗忘和孤独的主题。故事讲述一个...
              <el-link type="primary"
                >阅读全文 <i class="el-icon-arrow-down"></i
              ></el-link>
            </span>
          </div>
          <div class="footers">
            <div class="icona"><i class="el-icon-caret-top"></i> 赞同 55</div>
            <div class="iconb"><i class="el-icon-caret-bottom"></i></div>
            <div class="iconc">
              <i class="el-icon-chat-round"></i>
              3条评论
            </div>
            <div class="iconc">
              <i class="el-icon-star-on"></i>
              收藏
            </div>
            <div class="iconc">
              <i class="el-icon-s-promotion"></i>
              分享
            </div>
            <div class="iconc">
              <i class="el-icon-upload"></i>
              喜欢
            </div>
            <div class="iconc">
              <i
                class="el-icon-more-outline
"
              ></i>
            </div>
          </div>
        </el-card>
        <div>
          <h1
            style="text-align: center; font-size:16px;cursor: pointer;"
            @click="addCard"
          >
            查看更多...
          </h1>
        </div>
      </el-main>
    </div>
  </div>
</template>

<script>
const $ = require("jquery");
const multiavatar = require("@multiavatar/multiavatar").default;
// import multiavatar from '@multiavatar/multiavatar/esm'
import * as echarts from "echarts";

export default {
  data() {
    return {
      textarea: "",
      carsList: 5,
      info: {
        username: "liukai",
        avaterurl: "", //multiavatar("Liukai"),
        nickname: "123456789",
        email: "liukai@test.sz.com",
      },
    };
  },
  mounted: function() {
    var chartDom = document.getElementById("main");
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      legend: {
        top: "bottom",
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      series: [
        {
          name: "Nightingale Chart",
          type: "pie",
          radius: [50, 250],
          center: ["50%", "50%"],
          roseType: "area",
          itemStyle: {
            borderRadius: 8,
          },
          data: [
            { value: 40, name: "戏剧" },
            { value: 38, name: "爱情剧" },
            { value: 32, name: "悬疑" },
            { value: 30, name: "科幻" },
            { value: 28, name: "历史" },
            { value: 26, name: "人文" },
            { value: 22, name: "名著" },
            { value: 18, name: "科教" },
          ],
        },
      ],
    };

    option && myChart.setOption(option);
    var that = this;
    // console.log(multiavatar)
    $.ajax({
      url: ROOT_HOST + "/user/users",
      type: "POST",
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      success: (returndata) => {
        // that.info = returndata
        for (let i in returndata) {
          that.info[i] = returndata[i];
        }
        that.info.avaterurl = multiavatar(that.info.nickname);
      },
      error: () => {},
    });
  },
  methods: {
    addCard() {
      this.carsList += this.carsList;
      console.log(this.carsList);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.avatar {
  height: 100px;
  width: 100px;
  margin: auto;
  background: #eee;
  border-radius: 100%;
  box-shadow: 2px 3px 10px 0px rgb(0 0 0 / 20%);
  svg {
    height: 100px;
    width: 100px;
  }
}
.user_info_board {
  width: 80%;
  margin: auto;
  padding: 20px 20px;
  border-radius: 10px;
  box-shadow: 2px 1px 10px -3px rgb(0 0 0 / 20%);
  border: 1px solid #ddd;
  background: white;
  .user_info_item {
    padding: 5px;
    margin: 15px auto;
    border-bottom: 1px solid #eee;
  }
}
.tabs {
  border-radius: 10px;
  width: 80%;
  margin: 20px auto;
  padding: 0 20px;
}
.tabsa ::v-deep .el-tabs__nav-wrap::after {
  display: none;
}
.tabsa ::v-deep .el-tabs__item {
  font-size: 18px;
}
.footer-icon {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.footer-icon i {
  padding: 0 10px;
  cursor: pointer;
}
.footer-icon i:hover {
  font-size: 32px;
  transition: all 0.2s;
  color: red;
}
.footers {
  display: flex;
  margin-top: 60px;
  .icona {
    width: 100px;
    height: 30px;
    background-color: #e6eefd;
    color: #1b56c9;
    text-align: center;
    border-radius: 20px;
    line-height: 30px;
  }
  .iconb {
    width: 50px;
    height: 30px;
    background-color: #e6eefd;
    color: #1b56c9;
    text-align: center;
    border-radius: 20px;
    line-height: 30px;
    margin-left: 10px;
  }
  .iconc {
    color: #ccc;
    letter-spacing: 2px;
    margin-left: 50px;
    font-size: 18px;
  }
}
</style>
