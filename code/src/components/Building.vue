<template>
  <div id="all_board">
    <div id="pdfDom">
      <div id="top_title" :style="PDF ? 'height:80px;' : ''">
        <div class="title" id="rm">写作统计</div>
        <!-- <el-button icon="el-icon-upload el-icon--right" v-on:click="getDuration">测试</el-button> -->
        <div style="font-size: 18px; padding-top: 15px" v-if="PDF">
          剧本名：{{ now_ju_name }}
        </div>
      </div>
      <div id="ju_select" v-if="!PDF">
        <span>
          剧本数：
          <el-tag type="info">{{ jumu_data.length }}</el-tag>
        </span>
      </div>
      <div class="show_board_1">
        <h2>
          <!-- <center>{{ now_ju_name }}高潮分布</center> -->
          <center>所有剧本高潮分布</center>
        </h2>
        <div id="chart_example2"></div>
      </div>

      <div id="ju_select" v-if="!PDF">
        <div class="select_title">请选择剧目</div>
        <select
          type="text"
          id="select_input"
          class="drama_select"
          v-model="drama_index"
          v-on:change="getCharacterOrder()"
        >
          <option v-for="drama in jumu_data" :value="drama.id" :key="drama.id">
            {{ drama.drama_name }}
          </option>
        </select>
      </div>

      <div id="rm_show_board" class="show_board">
        <span>
          剧集数：
          <el-tag type="info">{{ episode_data.length }}</el-tag>
        </span>
        <span style="padding-left: 20px">
          场数：
          <el-tag type="info">{{ chang_data.length }}</el-tag>
        </span>
        <span style="padding-left: 20px">
          上次编辑时间：
          <el-tag type="info">{{ the_lastest_time }}</el-tag>
        </span>
        <span style="float: right;" v-if="!PDF">
          <el-button plain @click="jiekouceshi">导出pdf</el-button>
        </span>

        <div>
          <el-row>
            <el-col :span="12">
              <div>
                <h2 class="title_css">所有场的时间分布图</h2>
              </div>
              <div id="chart_example"></div>
            </el-col>
            <el-col :span="12">
              <h2 class="title_css">人物出场分布图</h2>
              <div id="chart_example1"></div>
            </el-col>
          </el-row>
        </div>

        <div>
          <div>
            <h2 style="text-align: center">xx人物的出场分布图</h2>
          </div>
          <div id="chart_example3"></div>
        </div>

        <div style="padding-top: 5px">
          <h2 style="text-align: center">剧本人物</h2>
        </div>

        <div v-if="PDF">
          <ul>
            <li v-for="(chang, index) in character_order" :key="index">
              <h3 class="medium" style="text-align: center">
                人物：{{ chang.name }} —————— 该人物首次出现的场——{{
                  chang.disposition
                }}
              </h3>
            </li>
          </ul>
        </div>

        <div class="card" v-if="!PDF">
          <el-carousel
            :interval="6000"
            type="card"
            height="200px"
            shadow="hover"
          >
            <el-carousel-item
              v-for="(chang, index) in character_order"
              :key="index"
              :color="chang.color"
            >
              <h3 class="medium" style="text-align: center">
                人物：{{ chang.name }}
              </h3>
              <p class="medium" style="text-align: center">
                该人物首次出现的场——{{ chang.disposition }}
              </p>
              <el-popover width="200" trigger="click" content="11">
                <h3 style="text-align: center">人物角色</h3>
                <p style="text-align: center">
                  {{ chang.character_identities }}
                </p>
                <button
                  slot="reference"
                  style="display: block; margin: 0 auto"
                  class="button"
                >
                  详细信息
                </button>
              </el-popover>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// const $ = require("jquery");
// const Loadding = require("../js/loadding").default.Loadding;
// const base = require("../../js/base").default;
import echarts from "echarts";

import "../css/jeditor.css";
import "../index";
const $ = require("jquery");
const Loadding = require("../js/loadding").default.Loadding;
const base = require("../js/base").default;
import html2Canvas from "html2canvas";
import JsPDF from "jspdf";
export default {
  data() {
    return {
      mydata: [],
      i: 0,
      PDF: false,
      htmlTitle: "剧本统计",
      drama_index: 1607964090,
      jumu_data: [],
      jumu_num: "",
      the_lastest_time: "",
      episode_data: [],
      character_order: [],
      chang_data: [],
      all_chang_time: [],

      character_xAxisData: [],
      character_yAxisData: [],
      time_xAxisData: ["15>", "15-30", "30-40", "45-60", "60-75", "75<"],
      count: [0, 0, 0, 0, 0, 0], ///纵坐标-出现场的次数

      chang_Num: [],
      always_chang_Num: [],
      now_ju_names: [],
      now_ju_name: "", //根据drama_index找到剧目名
      x_hours: [], //场次横坐标
      xx_hours: [],
      now_data: [], //圆圈大小
      all_data: [],
      all_ju_names: [],
    };
  },

  mounted() {
    base.reset_rightboard_width();
    var that = this;
    console.log(that);
    var first_loadding = new Loadding();
    first_loadding.add_title("初始化");
    first_loadding.__init__();
    first_loadding.add_process("开始拉取数据", function() {
      //that.__init_eidtor();
      that.getDramaData();
      that.getCharacterOrder();
    });
    first_loadding.add_process("正在拉取数据", function() {
      that.getAlldramaData();
    });
    first_loadding.add_process("正在拉取数据", function() {
      that.setHighTideChart();
      that.setSingle_Characterchart();
    });

    first_loadding.start();

    // this.getDramaData();
    // this.getCharacterOrder();
    // this.getAlldramaData();
  },
  methods: {
    setPDF() {
      const loading = this.$loading({
        lock: true,
        text: "下载PDF中，请稍后！",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.PDF = !this.PDF;
      var that = this;
      let title = this.htmlTitle;
      setTimeout(() => {
        html2Canvas(document.querySelector("#pdfDom"), {
          allowTaint: true,
        }).then(function(canvas) {
          let contentWidth = canvas.width;
          let contentHeight = canvas.height;
          let pageHeight = (contentWidth / 592.28) * 841.89;
          let leftHeight = contentHeight;
          let position = 0;
          const imgWidth = 595.28;
          let imgHeight = (592.28 / contentWidth) * contentHeight;
          let pageData = canvas.toDataURL("image/jpeg", 1.0);
          let PDF = new JsPDF("", "pt", "a4");
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, "JPEG", 0, 10, imgWidth, imgHeight);
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                PDF.addPage();
              }
            }
          }
          PDF.save(title + ".pdf");
          that.PDF = !that.PDF;
          loading.close();
        });
      }, 3000);
      loading.close();
    },
    getDramaData: function() {
      var that = this;
      $.ajax({
        type: "POST",
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        url: ROOT_HOST + "/jeditor/api/drama",
        async: false,
        success: function(returndata) {
          console.log("这是剧目的returndata");
          that.jumu_data = returndata;
          console.log(that.jumu_data);
          that.jumu_num = returndata.length;
          // that.autoHeight= that.jumu_data.length * 155 + "px";
          for (var i = 0; i < returndata.length; i++) {
            if (that.drama_index == returndata[i].id) {
              that.the_lastest_time = returndata[i].u_time;
            }
          }
          //  console.log(that.jumu_num);
          //  console.log(that.drama_index);
          //  console.log("编辑时间");
          //  console.log(that.the_lastest_time);
        },
      });
    },
    getAlldramaData: function() {
      // this.getDramaData();
      this.all_ju_names = [];
      var that = this;
      for (var i = 0; i < that.jumu_data.length; i++) {
        $.ajax({
          type: "POST",
          xhrFields: {
            withCredentials: true,
          },
          crossDomain: true,
          url: ROOT_HOST + "/jeditor/api/all_scene/" + that.jumu_data[i].id,
          async: false,
          dataType: "json",
          success: function(returndata) {
            that.all_data[i] = returndata[0];
            that.all_ju_names[i] = "《" + that.jumu_data[i].drama_name + "》";
            that.chang_Num[i] = that.all_data[i].length;
            that.always_chang_Num[i] = that.all_data[i].length;
            // console.log("这是全部所有的场数据..");
            // console.log(that.all_data[i]);
          },
        });
      }
      console.log("这是全部所有的场数据..");
      console.log(that.all_ju_names);
    },


    jiekouceshi(){
      $.ajax({
        type: "POST",
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        url: ROOT_HOST + "/jeditor/api/dialog/" + "1646316605",
        async: false,
        dataType: "json",
        success: function(returndata) {
          console.log("接口测试")
          console.log(returndata)
        },
      });
    },
    ///初始化界面显示+选择其他剧本之后对应的显示
    getCharacterOrder() {
      var that = this;
      // that.getAlldramaData();
      that.getDramaData();
      $.ajax({
        type: "POST",
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        url: ROOT_HOST + "/jeditor/api/all_scene/" + that.drama_index,
        async: false,
        dataType: "json",
        success: function(returndata) {
          that.chang_data = returndata[0];
          console.log("这是所有场数据..");
          console.log(that.chang_data);
          that.all_chang_time = [];
          that.character_xAxisData = [];
          for (var i = 0; i < returndata[0].length; i++) {
            that.character_xAxisData.push(i + 1);

            if (returndata[0][i].duration != null) {
              that.all_chang_time.push(returndata[0][i].duration);
            }
          }
          //  console.log("横坐标常数");
          //  console.log(that.character_xAxisData);
          console.log("所有场时间");
          console.log(that.all_chang_time);
        },
      });
      $.ajax({
        type: "POST",
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        url: ROOT_HOST + "/jeditor/api/episode/" + that.drama_index,
        async: false,
        dataType: "json",
        success: function(returndata) {
          that.character_order = returndata.character;
          console.log("这是人物数据");
          console.log(that.character_order);
          that.character_yAxisData = [];
          for (var i = 0; i < returndata.character.length; i++) {
            that.character_yAxisData.push(returndata.character[i].name);
            if (i % 2 == 0) {
              that.$set(that.character_order[i], "color", "#B2DFDB");
            } else {
              that.$set(that.character_order[i], "color", "#009688");
            }
          }
          that.episode_data = returndata.episode;
          console.log("这是全部剧集数据");
          console.log(that.episode_data);
          // console.log("纵坐标人物");
          // console.log(that.character_yAxisData);
        },
      });
      that.setCharacterchart();
      that.setTimeChart();
    },
    style: function() {},
    ///高潮分布图
    setHighTideChart: function() {
      var myChart = echarts.init(document.getElementById("chart_example2"));

      // this.all_ju_names = [];
      this.x_hours = [];
      var ju_names = this.all_ju_names;
      var that = this;
      console.log("that.chang_Num");
      console.log(ju_names);
      console.log(that.chang_Num);
      // that.x_hours.push("场" + that.chang_Num);
      this.autoHeight = this.all_ju_names.length * 120; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
      myChart.resize({ height: this.autoHeight });

      for (var i = 0; i < that.jumu_data.length; i++) {
        that.chang_Num[i] = that.always_chang_Num[i];
        if (that.chang_Num[i] <= 100) {
          for (var j = 1; j < that.chang_Num[i]; j++) {
            that.xx_hours.unshift("场" + (that.chang_Num[i] - 1));
            that.chang_Num[i] = that.chang_Num[i] - 6;
          }
          that.x_hours[i] = that.xx_hours;
        } else {
          for (var j = 1; j < that.chang_Num[i]; j++) {
            if (that.chang_Num[i] % 2 != 0) {
              that.chang_Num[i]--;
            } else {
              that.xx_hours.unshift("场" + that.chang_Num[i]);
              that.chang_Num[i] = that.chang_Num[i] / 2;
            }
          }
          that.x_hours[i] = that.xx_hours;
        }
        that.xx_hours = [];
      }
      console.log("that.x_hours");
      console.log(that.x_hours);
      var hours = that.x_hours;
      console.log("that.all_chang_time");
      console.log(that.all_data[0][1]);
      that.now_data = [];
      for (var j = 0; j < that.jumu_data.length; j++) {
        for (var i = 0; i < that.all_data[j].length; i++) {
          if (that.all_data[j][i].duration != null) {
            var time = that.all_data[j][i].duration;
            ///去掉单位，转成数字
            time = Number(time.slice(0, time.length - 1));
            // 取绝对值
            if (time < 0) {
              time = -time;
            }

            if (!isNaN(time)) {
              console.log("that.time");
              console.log(time);
              // 添加数据
              if (time <= 10 && i / that.all_data[j].length <= 0.2) {
                that.now_data.push([j, 1, 3]);
              } else if (time <= 10 && i / that.all_data[j].length <= 0.3) {
                that.now_data.push([j, 2, 3]);
              } else if (time <= 10 && i / that.all_data[j].length <= 0.4) {
                that.now_data.push([j, 3, 3]);
              } else if (time <= 10 && i / that.all_data[j].length <= 0.5) {
                that.now_data.push([j, 4, 3]);
              } else if (time <= 10 && i / that.all_data[j].length <= 0.6) {
                that.now_data.push([j, 5, 3]);
              } else if (time <= 10 && i / that.all_data[j].length <= 0.7) {
                that.now_data.push([j, 6, 3]);
              } else if (time <= 10 && i / that.all_data[j].length <= 0.8) {
                that.now_data.push([j, 7, 3]);
              } else if (time <= 10 && i / that.all_data[j].length <= 0.9) {
                that.now_data.push([j, 8, 3]);
              } else if (time <= 10 && i / that.all_data[j].length <= 1) {
                that.now_data.push([j, 9, 3]);
              } else if (time <= 25 && i / that.all_data[j].length <= 0.2) {
                that.now_data.push([j, 1, 5]);
              } else if (time <= 25 && i / that.all_data[j].length <= 0.3) {
                that.now_data.push([j, 2, 5]);
              } else if (time <= 25 && i / that.all_data[j].length <= 0.4) {
                that.now_data.push([j, 3, 5]);
              } else if (time <= 25 && i / that.all_data[j].length <= 0.5) {
                that.now_data.push([j, 4, 5]);
              } else if (time <= 25 && i / that.all_data[j].length <= 0.6) {
                that.now_data.push([j, 5, 5]);
              } else if (time <= 25 && i / that.all_data[j].length <= 0.7) {
                that.now_data.push([j, 6, 5]);
              } else if (time <= 25 && i / that.all_data[j].length <= 0.8) {
                that.now_data.push([j, 7, 5]);
              } else if (time <= 25 && i / that.all_data[j].length <= 0.9) {
                that.now_data.push([j, 8, 5]);
              } else if (time <= 25 && i / that.all_data[j].length <= 1) {
                that.now_data.push([j, 9, 5]);
              } else if (time <= 40 && i / that.all_data[j].length <= 0.2) {
                that.now_data.push([j, 1, 7]);
              } else if (time <= 40 && i / that.all_data[j].length <= 0.3) {
                that.now_data.push([j, 2, 7]);
              } else if (time <= 40 && i / that.all_data[j].length <= 0.4) {
                that.now_data.push([j, 3, 7]);
              } else if (time <= 40 && i / that.all_data[j].length <= 0.5) {
                that.now_data.push([j, 4, 7]);
              } else if (time <= 40 && i / that.all_data[j].length <= 0.6) {
                that.now_data.push([j, 5, 7]);
              } else if (time <= 40 && i / that.all_data[j].length <= 0.7) {
                that.now_data.push([j, 6, 7]);
              } else if (time <= 40 && i / that.all_data[j].length <= 0.8) {
                that.now_data.push([j, 7, 7]);
              } else if (time <= 40 && i / that.all_data[j].length <= 0.9) {
                that.now_data.push([j, 8, 7]);
              } else if (time <= 40 && i / that.all_data[j].length <= 1) {
                that.now_data.push([j, 9, 7]);
              } else if (time <= 60 && i / that.all_data[j].length <= 0.2) {
                that.now_data.push([j, 1, 9]);
              } else if (time <= 60 && i / that.all_data[j].length <= 0.3) {
                that.now_data.push([j, 2, 9]);
              } else if (time <= 60 && i / that.all_data[j].length <= 0.4) {
                that.now_data.push([j, 3, 9]);
              } else if (time <= 60 && i / that.all_data[j].length <= 0.5) {
                that.now_data.push([j, 4, 9]);
              } else if (time <= 60 && i / that.all_data[j].length <= 0.6) {
                that.now_data.push([j, 5, 9]);
              } else if (time <= 60 && i / that.all_data[j].length <= 0.7) {
                that.now_data.push([j, 6, 9]);
              } else if (time <= 60 && i / that.all_data[j].length <= 0.8) {
                that.now_data.push([j, 7, 9]);
              } else if (time <= 60 && i / that.all_data[j].length <= 0.9) {
                that.now_data.push([j, 8, 9]);
              } else if (time <= 60 && i / that.all_data[j].length <= 1) {
                that.now_data.push([j, 9, 9]);
              } else if (time > 60 && i / that.all_data[j].length <= 0.2) {
                that.now_data.push([j, 1, 11]);
              } else if (time > 60 && i / that.all_data[j].length <= 0.3) {
                that.now_data.push([j, 2, 11]);
              } else if (time > 60 && i / that.all_data[j].length <= 0.4) {
                that.now_data.push([j, 3, 11]);
              } else if (time > 60 && i / that.all_data[j].length <= 0.5) {
                that.now_data.push([j, 4, 11]);
              } else if (time > 60 && i / that.all_data[j].length <= 0.6) {
                that.now_data.push([j, 5, 11]);
              } else if (time > 60 && i / that.all_data[j].length <= 0.7) {
                that.now_data.push([j, 6, 11]);
              } else if (time > 60 && i / that.all_data[j].length <= 0.8) {
                that.now_data.push([j, 7, 11]);
              } else if (time > 60 && i / that.all_data[j].length <= 0.9) {
                that.now_data.push([j, 8, 11]);
              } else if (time > 60 && i / that.all_data[j].length <= 1) {
                that.now_data.push([j, 9, 11]);
              }
            }
          }
        }
      }

      console.log("that.now_data");
      console.log(that.now_data);
      // data1中第一个为剧目index,后两位为横纵坐标
      var data1 = that.now_data;

      const title1 = [];
      const singleAxis1 = [];
      const series = [];
      console.log("success1");
      console.log(hours[0]);
      ju_names.forEach(function(day, idx) {
        title1.push({
          textBaseline: "middle",
          top: ((idx + 0.5) * 800) / 7 + "px",
          text: day,
          textStyle: {
            fontSize: "16",
            fontFamily: "Arial",
          },
        });
        console.log("success1");
        console.log(hours[idx]);
        singleAxis1.push({
          left: 150,
          type: "category",
          boundaryGap: false,
          data: hours[idx],
          top: (idx * 800) / 7 + 80 + "px",
          height: 40 / 7 - 10 + "%",
          axisLabel: {
            interval: 0,
            fontSize: 10,
          },
          // lineHeight: 86,
        });
        series.push({
          singleAxisIndex: idx,
          coordinateSystem: "singleAxis",
          type: "scatter",
          data: [],
          symbolSize: function(dataItem) {
            // *号后面为圆点大小
            return dataItem[1] * 4;
          },
        });
      });
      data1.forEach(function(dataItem) {
        series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
      });

      var option = {
        tooltip: {
          position: "top",
        },
        title: title1,
        singleAxis: singleAxis1,
        series: series,
        // dataZoom: [
        //   {
        //     type: "slider", //slider表示有滑动块的，inside表示内置的
        //     show: true,
        //     // yAxisIndex: 0,

        //     start: 30,
        //     end: 80,
        //   },
        // ],
      };

      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    ////场次时间分布图
    setTimeChart: function() {
      var that = this;
      var myChart2 = echarts.init(document.getElementById("chart_example"));
      var yMax = 50;
      var dataShadow = [];
      for (var i = 0; i < that.count.length; i++) {
        dataShadow.push(yMax);
      }
      that.count = [0, 0, 0, 0, 0, 0];
      for (var k = 0; k < that.all_chang_time.length; k++) {
        var time = that.all_chang_time[k];
        ///去掉单位，转成数字
        time = Number(time.slice(0, time.length - 1));

        if (time <= 15) {
          that.count[0]++;
        }
        if (time > 15 && time <= 30) {
          that.count[1]++;
        }
        if (time > 30 && time <= 45) {
          that.count[2]++;
        }
        if (time > 45 && time <= 60) {
          that.count[3]++;
        }
        if (time > 60 && time <= 75) {
          that.count[4]++;
        }
        if (time > 75) that.count[5]++;
      }
      // console.log("计数器");
      // console.log(that.count);

      var option = {
        xAxis: {
          name: "s",
          data: that.time_xAxisData,
          axisLabel: {
            inside: true,
            color: "#fff",
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          z: 10,
        },
        yAxis: {
          name: "场次",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#83bff6",
          },
        },
        dataZoom: [
          {
            type: "inside",
          },
        ],
        series: [
          {
            type: "bar",
            showBackground: true,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#009D8E" },
                { offset: 0.5, color: "#5AC6BC" },
                { offset: 1, color: "#40E5D6" },
              ]),
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#009D8E" },
                  { offset: 0.7, color: "#43E5D6" },
                  { offset: 1, color: "#83bff6" },
                ]),
              },
            },
            data: that.count,
          },
        ],
      };
      myChart2.setOption(option);
      const zoomSize = 6;
      myChart2.on("click", function(params) {
        console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
        myChart2.dispatchAction({
          type: "dataZoom",
          startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
          endValue:
            dataAxis[
              Math.min(params.dataIndex + zoomSize / 2, that.count.length - 1)
            ],
        });
      });
      //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
      window.addEventListener("resize", function() {
        myChart2.resize();
      });
    },

    ////人物出场分布图
    setCharacterchart: function() {
      var that = this;
      that.myChart1 = echarts.init(document.getElementById("chart_example1"));
      // get character from character, get scene from scene, get event from event
      $.ajax({
        type: "POST",
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        url: ROOT_HOST + "/jeditor/api/getallepisodesceneevent",
        async: false,
        data: JSON.stringify({ drama_id: that.drama_index }),
        dataType: "json",
        success: function(returndata) {
          that.mydata = [];
          for (var i = 0; i < returndata.length; i++) {
            // search for scene
            var yaxis;
            for (var k = 0; k < that.chang_data.length; k++) {
              if (that.chang_data[k].id == returndata[i].scene_id) {
                yaxis = k;
                break;
              }
            }
            // search for character
            for (var j = 0; j < that.character_yAxisData.length; j++) {
              if (
                that.character_yAxisData[j] == returndata[i].people_name_1 ||
                that.character_yAxisData[j] == returndata[i].people_name_2
              ) {
                that.mydata.push([yaxis, j]);
              }
            }
          }
          // console.log("this is mydata")
          // console.log(that.mydata)
        },
      });

      let option = {
        color: ["#009D8E"],
        xAxis: {
          type: "category",
          data: that.character_xAxisData,
          name: "场次",
        },
        yAxis: {
          type: "category",
          data: that.character_yAxisData,
          name: "人物",
        },

        series: {
          type: "scatter",
          data: that.mydata,
        },
      };
      that.myChart1.setOption(option);
      //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
      window.addEventListener("resize", function() {
        myChart1.resize();
      });
      // that.setSingle_Characterchart();
    },

    // 单个人物出场折线图
    setSingle_Characterchart: function() {
      var that = this;
      that.myChart3 = echarts.init(document.getElementById("chart_example3"));
      const data = [
        ["场1", 116],
        ["场2", 129],
        ["场3", 135],
        ["场4", 86],
        ["场5", 73],
        ["场6", 85],
        ["场7", 73],
        ["场8", 68],
        ["场9", 92],
        ["场10", 130],
        ["场11", 245],
        ["场12", 139],
        ["场13", 115],
        ["场14", 111],
        ["场15", 309],
        ["场16", 206],
        ["场17", 137],
        ["场18", 237],
        ["场19", 37],
        ["场20", 117],
        ["场21", 67],
        ["场22", 45],
        ["场23", 74],
        ["场24", 25],
        ["场25", 10],
        ["场26", 18],
        ["场27", 78],
        ["场28", 89],
        ["场29", 99],
        ["场30", 123],
        ["场31", 137],
      ];
      const dateList = data.map(function(item) {
        return item[0];
      });
      const valueList = data.map(function(item) {
        return item[1];
      });
      var option = {
        // Make gradient line here
        visualMap: [
          {
            show: false,
            type: "continuous",
            seriesIndex: 0,
            min: 0,
            max: 400,
          },
        ],
        title: [],
        tooltip: {
          trigger: "axis",
        },
        xAxis: [
          {
            name: "场次",
            data: dateList,
          },
        ],
        yAxis: [
          {
            name: "出场时长",
          },
        ],
        grid: [
          {
            bottom: "10%",
          },
        ],
        series: [
          {
            type: "line",
            showSymbol: true,
            data: valueList,
          },
        ],
      };
      that.myChart3.setOption(option);
      //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
      window.addEventListener("resize", function() {
        myChart3.resize();
      });
    },
  },

  // watch: {},
  // created() {},
};
</script>
<style scoped>
h2 {
  padding: 10px;
  font-size: 18px;
}
#chart_example {
  width: 400px;
  height: 500px;
  margin: 0 auto;
}
#top_title .title {
  width: 100%;
}
ul {
  display: block;
}
#chart_example1 {
  width: 440px;
  height: 500px;
  /* border: 1px solid red; */
  margin: 0 auto;
}

#chart_example3 {
  min-height: 700px;
  overflow-y: auto;
  max-height: 3000px;
  width: auto;
}

.el-carousel__item h3 {
  color: #050607;
  font-size: 20px;
  opacity: 20;
  line-height: 75px;
  margin-left: 0 auto;
}

.el-carousel__item:nth-child(2n) {
  background-color: #8acfca;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #b2dfdb;
}
.button {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  background-color: #009688;
  border: none;
  color: white;
  padding: 12px 25px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  margin: 5px;
}
.button:hover {
  background-color: #e91e63; /* Green */
  color: white;
}
.card {
  height: 400px;
  width: auto;
}
.el-carousel >>> .el-carousel__indicators {
  width: 400px;
  margin: 0 auto;
}
.show_board_1 {
  width: calc(100% - 250px);
  margin: 15px auto;
  background: white;
  padding: 20px;
  border-radius: 10px;
}
</style>
