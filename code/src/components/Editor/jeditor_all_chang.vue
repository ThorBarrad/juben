<template>
  <div class="main_board">
    <div class="center_main">
      <div class="searchbar">
        <el-select
          @keyup.enter.native="
            searchcontent == '' ? null : to_edit(searchcontent)
          "
          class="search_input"
          v-model="searchcontent"
          filterable
          placeholder="请输入场名称"
        >
          <el-option
            style="border-radius: 5px;margin: 5px;"
            v-for="item in chang_data"
            :key="item.id"
            :label="item.scene_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <div class="search_btn">
          <div class="btn" @click="to_edit(searchcontent)">Search</div>
        </div>
      </div>
      <el-row>
        <el-col :span="8">
          <el-tooltip effect="dark" content="新建场" placement="bottom">
            <el-button
              type="primary"
              :icon="'el-icon-document-add'"
              circle
              @click="add_chang_show = true"
            ></el-button>
          </el-tooltip>
          <el-button
            type="primary"
            :icon="is_edit ? 'el-icon-check' : 'el-icon-edit'"
            circle
            @click="is_edit = !is_edit"
          ></el-button>
          <el-button
            type="primary"
            :icon="'el-icon-back'"
            @click="$router.push('/board/e')"
            >剧本管理</el-button
          >
          <el-button
            type="primary"
            :icon="'el-icon-folder'"
            @click="$router.push('/board/e/' + encode(drama_id) + '/')"
            >剧集管理</el-button
          >
          <el-button
            type="primary"
            style="float:right;"
            icon="el-icon-folder-add"
            v-show="is_edit"
            @click="
              show_add_to = true;
              add_to_episode_id = null;
            "
            >添加至</el-button
          >
        </el-col>
        <el-col
          :span="1"
          style="padding-top:10px;padding-left:4px"
          class="type_tag"
        >
          <svg
            t="1643335461546"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4067"
            width="25"
            height="25"
          >
            <path
              d="M928 96H96c-35.296 0-64 28.704-64 64v704c0 35.296 28.704 64 64 64h832c35.296 0 64-28.704 64-64V160c0-35.296-28.704-64-64-64zM96 864V160h832l0.064 704H96z"
              p-id="4068"
              fill="#13227a"
            ></path>
            <path
              d="M832 192H192c-35.296 0-64 28.704-64 64v512c0 35.296 28.704 64 64 64h640c35.296 0 64-28.704 64-64V256c0-35.296-28.704-64-64-64zM192 768V256h640l0.064 512H192z"
              p-id="4069"
              fill="#13227a"
            ></path>
            <path
              d="M672 288H352a32 32 0 0 0 0 64h320a32 32 0 1 0 0-64z"
              p-id="4070"
              fill="#13227a"
            ></path></svg
          >开端
        </el-col>
        <el-col
          :span="1"
          style="padding-top:10px;padding-left:4px"
          class="type_tag"
        >
          <svg
            t="1643337166563"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="11448"
            width="25"
            height="25"
          >
            <path
              d="M244.1 832V711.4 694c0-9.4-8.3-18.4-18-18-9.8 0.4-18 7.9-18 18v138c0 9.4 8.3 18.4 18 18 9.7-0.4 18-7.9 18-18zM434.7 832V692v-20c0-9.4-8.3-18.4-18-18-9.8 0.4-18 7.9-18 18v160c0 9.4 8.3 18.4 18 18 9.7-0.4 18-7.9 18-18zM625.3 832v-76.1V634v-27.9c0-9.4-8.3-18.4-18-18-9.8 0.4-18 7.9-18 18V832c0 9.4 8.3 18.4 18 18 9.8-0.4 18-7.9 18-18zM815.9 832v-38.2V702 591.5v-96c0-15.6 0.5-31.2 0-46.8v-0.7c0-9.4-8.3-18.4-18-18-9.8 0.4-18 7.9-18 18v336.5c0 15.6-0.5 31.2 0 46.8v0.7c0 9.4 8.3 18.4 18 18 9.8-0.4 18-7.9 18-18zM238.8 521.1c17.8-17.8 35.5-35.6 53.3-53.4 28.3-28.4 56.7-56.8 85-85.2l19.6-19.6h-25.5c14.4 14.4 28.8 28.7 43.2 43.1 23 22.9 45.9 45.9 68.9 68.8l15.9 15.9c6.9 6.9 18.6 6.9 25.5 0l28.4-28.4 68.3-68.3 82.6-82.6 71.4-71.4c11.5-11.5 23.6-22.7 34.7-34.7l0.5-0.5c11-11 2.9-30.7-12.7-30.7H648.6c-9.4 0-18.4 8.3-18 18 0.4 9.8 7.9 18 18 18h149.3l-18-18v149.3c0 9.4 8.3 18.4 18 18 9.8-0.4 18-7.9 18-18V210.6v-18.5c0-9.7-8.2-18-18-18H648.6c-9.4 0-18.4 8.3-18 18 0.4 9.8 7.9 18 18 18h149.3c-4.2-10.2-8.5-20.5-12.7-30.7l-28.4 28.4-68.3 68.3-82.6 82.6-71.4 71.4c-11.5 11.5-23.7 22.6-34.7 34.7l-0.5 0.5h25.5c-14.4-14.4-28.8-28.7-43.2-43.1-23-22.9-45.9-45.9-68.9-68.8l-15.9-15.9c-6.9-6.9-18.6-6.9-25.5 0-17.8 17.8-35.5 35.6-53.3 53.4-28.3 28.4-56.7 56.8-85 85.2l-19.6 19.6c-6.7 6.7-7.2 18.9 0 25.5 7.1 6.5 18.3 7 25.4-0.1z"
              p-id="11449"
              fill="#08af3a"
            ></path></svg
          >发展
        </el-col>
        <el-col
          :span="1"
          style="padding-top:10px;padding-left:4px"
          class="type_tag"
        >
          <svg
            t="1643336391437"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="7538"
            width="25"
            height="25"
          >
            <path
              d="M728.153613 555.13498a30.11336 30.11336 0 0 0-51.79498 9.335141A224.344534 224.344534 0 0 1 637.813532 632.526316a312.275547 312.275547 0 0 0 1.806802-33.726964 381.235142 381.235142 0 0 0-2.710203-41.857571 308.963077 308.963077 0 0 0-23.187287-81.004939 34.329231 34.329231 0 0 0-3.914737-8.431741 301.133603 301.133603 0 0 0-110.516033-127.078381 30.11336 30.11336 0 0 0-30.11336 0 30.11336 30.11336 0 0 0-15.960081 26.198624 207.481053 207.481053 0 0 1-21.982753 90.340081 201.458381 201.458381 0 0 1-76.789069 82.811741A271.020243 271.020243 0 0 0 268.924868 619.577571a264.09417 264.09417 0 0 0-42.760972 144.242996 259.577166 259.577166 0 0 0 30.113361 124.669311 266.804373 266.804373 0 0 0 94.254817 99.675223 30.11336 30.11336 0 0 0 33.726964 0 30.11336 30.11336 0 0 0 11.443077-31.619028 267.105506 267.105506 0 0 1-6.926073-60.226721 251.145425 251.145425 0 0 1 17.465749-92.74915 236.088745 236.088745 0 0 1 18.068016-38.545101l1.806802 4.215871a470.972956 470.972956 0 0 0 199.350445 221.032064 207.179919 207.179919 0 0 0 19.874818 10.539677l3.31247 1.806801a30.11336 30.11336 0 0 0 32.221295-3.914737 316.792551 316.792551 0 0 0 107.504697-167.12915 341.78664 341.78664 0 0 0 9.937409-78.59587 315.286883 315.286883 0 0 0-70.16413-197.844777z"
              fill="#d81e06"
              p-id="7539"
            ></path>
            <path
              d="M281.572479 371.142348a30.11336 30.11336 0 0 1-25.295222-13.551012 30.11336 30.11336 0 0 1 8.732874-41.556437l12.647611-8.130608a30.11336 30.11336 0 0 1 30.113361 51.79498l-8.732875 6.624939a30.11336 30.11336 0 0 1-17.465749 4.818138z"
              fill="#d81e06"
              p-id="7540"
            ></path>
            <path
              d="M707.074261 1024a32.221296 32.221296 0 0 1-10.539676-1.806802 412.251903 412.251903 0 0 1-70.465264-32.823562 470.972956 470.972956 0 0 1-199.350445-221.032065l-1.806802-4.215871a236.088745 236.088745 0 0 0-18.068016 38.545102 256.264696 256.264696 0 0 0-3.914737 175.259757 30.11336 30.11336 0 0 1-6.926073 30.11336 30.11336 30.11336 0 0 1-30.11336 8.130607 391.473684 391.473684 0 0 1-231.571741-190.015303 391.473684 391.473684 0 0 1 17.164616-396.291822c5.721538-9.034008 12.045344-17.766883 18.369149-25.89749a30.11336 30.11336 0 0 1 47.57911 36.738299c-5.420405 7.227206-10.539676 14.454413-15.357814 21.982753a331.246964 331.246964 0 0 0-14.755547 335.462834 331.246964 331.246964 0 0 0 144.54413 140.32826A337.269636 337.269636 0 0 1 329.151589 895.415951a312.275547 312.275547 0 0 1 21.380485-114.129635 308.963077 308.963077 0 0 1 60.226721-100.879757 30.11336 30.11336 0 0 1 30.11336-9.034009 30.11336 30.11336 0 0 1 21.982753 21.380486 439.353927 439.353927 0 0 0 18.36915 51.493847 412.85417 412.85417 0 0 0 174.356357 193.026639 309.565344 309.565344 0 0 0 46.976842 22.886154 412.251903 412.251903 0 0 0 160.203077-233.378542 421.587045 421.587045 0 0 0 12.045344-100.27749 402.01336 402.01336 0 0 0-60.226721-214.105992 331.246964 331.246964 0 0 1-20.175951 34.931498 376.417004 376.417004 0 0 1-125.873846 122.260243c-9.937409 5.721538-19.573684 10.84081-30.113361 15.658947a30.11336 30.11336 0 0 1-33.726963-5.721539 30.11336 30.11336 0 0 1-4.517004-33.726963 389.365749 389.365749 0 0 0 30.11336-156.890607 481.813765 481.813765 0 0 0-3.31247-54.806316 402.01336 402.01336 0 0 0-30.11336-105.697895v-3.31247l-1.806802-3.312469a389.365749 389.365749 0 0 0-101.783158-135.208988 396.894089 396.894089 0 0 1-37.6417 114.731903 30.11336 30.11336 0 0 1-53.601781-27.102025A338.775304 338.775304 0 0 0 437.258552 30.259109a30.11336 30.11336 0 0 1 46.675709-25.295223 451.700405 451.700405 0 0 1 164.418947 189.71417 50.891579 50.891579 0 0 1 5.119271 10.84081 458.024211 458.024211 0 0 1 34.329231 120.453441 556.193765 556.193765 0 0 1 2.710203 62.936924 466.757085 466.757085 0 0 1-10.539677 98.169554 319.502753 319.502753 0 0 0 62.936924-72.272065A307.156275 307.156275 0 0 0 780.851994 341.330121a30.11336 30.11336 0 0 1 50.891579-9.937409 470.069555 470.069555 0 0 1 103.891093 294.508664 481.813765 481.813765 0 0 1-13.852146 114.731903 471.876356 471.876356 0 0 1-198.145911 277.946316 30.11336 30.11336 0 0 1-16.562348 5.420405zM597.762763 227.200486z m-2.107935-3.914737z"
              fill="#d81e06"
              p-id="7541"
            ></path></svg
          >高潮
        </el-col>
        <el-col
          :span="1"
          style="padding-top:10px;padding-left:4px"
          class="type_tag"
        >
          <svg
            t="1643336594779"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="10184"
            width="25"
            height="25"
          >
            <path
              d="M802.133333 213.333333v597.333334h-597.333333V213.333333h597.333333m0-85.333333h-597.333333a85.333333 85.333333 0 0 0-85.333333 85.333333v597.333334a85.333333 85.333333 0 0 0 85.333333 85.333333h597.333333a85.333333 85.333333 0 0 0 85.333334-85.333333V213.333333a85.333333 85.333333 0 0 0-85.333334-85.333333z"
              fill="#040404"
              p-id="10185"
            ></path>
            <path
              d="M332.8 341.333333m42.666667 0l256 0q42.666667 0 42.666666 42.666667l0 256q0 42.666667-42.666666 42.666667l-256 0q-42.666667 0-42.666667-42.666667l0-256q0-42.666667 42.666667-42.666667Z"
              fill="#040404"
              p-id="10186"
            ></path></svg
          >结尾
        </el-col>

        <el-col
          :span="1"
          style="padding-top:10px;padding-left:4px"
          class="type_tag"
        >
          <svg
            t="1643355614875"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2794"
            width="25"
            height="25"
          >
            <path
              d="M512 64c-247.4 0-448 200.6-448 448 0 247.4 200.6 448 448 448s448-200.6 448-448C960 264.6 759.4 64 512 64L512 64zM118.3 512c0-217.4 176.3-393.7 393.7-393.7 94.3 0 180.9 33.2 248.7 88.5 10.3 8.4 20.1 17.3 29.5 26.6L220.8 777c-1-1.1-2-2.2-2.9-3.3C155.9 704.2 118.3 612.5 118.3 512L118.3 512zM512 905.7c-94.8 0-181.8-33.5-249.7-89.3l565.4-539.7c49 65.6 78 147.1 78 235.3C905.7 729.4 729.4 905.7 512 905.7L512 905.7zM512 905.7"
              p-id="2795"
              fill="#040404"
            ></path></svg
          >暂无
        </el-col>
      </el-row>
      <div
        class="msgBox"
        id="add_new_chang_board"
        style="z-index:11;"
        v-show="add_chang_show"
      >
        <div
          class="btn close_btn"
          id="close_new"
          @click="add_chang_show = false"
        ></div>
        <div class="title">新建场</div>
        <div class="form" id="new_form">
          <div class="item">
            <div class="item_title">场名称</div>
            <div class="item_content">
              <input
                type="text"
                value=""
                name="scene_name"
                autocomplete="off"
              />
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
              <input
                type="text"
                value=""
                name="scene_type"
                autocomplete="off"
              />
            </div>
          </div>
          <div class="item">
            <div class="item_title">场时间</div>
            <div class="item_content">
              <input
                type="text"
                value=""
                name="scene_time"
                autocomplete="off"
              />
            </div>
          </div>
          <div class="item">
            <div class="item_title">场地点</div>
            <div class="item_content">
              <input
                type="text"
                value=""
                name="scene_location"
                autocomplete="off"
              />
            </div>
          </div>
        </div>
        <div style="height:40px;margin:10px;margin-top:20px;">
          <div class="left left_40">
            <div class="btn reset_btn" id="reset_btn" @click="reset_new_chang">
              reset
            </div>
          </div>
          <div class="right right_60">
            <div
              class="btn submit_btn"
              id="submit_btn"
              @click="submit_new_chang"
            >
              submit
            </div>
          </div>
        </div>
      </div>
      <div class="msgBox" id="add_new_episode_board" v-show="add_episode_show">
        <div class="cover"></div>
        <div class="btn close_btn" v-on:click="add_episode_show = false"></div>
        <div class="title">新建剧集</div>
        <div class="form" id="new_form">
          <div class="item">
            <div class="item_title">剧集名称</div>
            <div class="item_content">
              <input
                type="text"
                value=""
                autocomplete="off"
                name="episode_name"
              />
            </div>
          </div>
          <div class="item">
            <div class="item_title">主要角色</div>
            <div class="item_content">
              <input
                type="text"
                value=""
                autocomplete="off"
                name="main_roles"
              />
            </div>
          </div>
          <div class="item">
            <div class="item_title">剧集序号</div>
            <div class="item_content">
              <input
                type="text"
                value=""
                autocomplete="off"
                name="episode_rank"
              />
            </div>
          </div>
        </div>
        <div style="height:40px;margin:10px;margin-top:20px;">
          <div class="left left_40">
            <div class="btn reset_btn" v-on:click="reset_new_episode">
              reset
            </div>
          </div>
          <div class="right right_60">
            <div class="btn submit_btn" v-on:click="submit_new_episode">
              submit
            </div>
          </div>
        </div>
      </div>

      <!-- ////卡片内容 -->
      <div class="item_board" :class="is_edit ? 'active' : ''">
        <el-checkbox-group
          v-if="chang_data.length > 0"
          v-model="checkList"
          style="font-size:1em;width:100%;"
        >
          <el-row :gutter="10" style="width:100%;">
            <el-col
              :span="4"
              v-for="(chang, index) in chang_data.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )"
              :key="chang.id"
            >
              <el-card class="chang_card">
                <el-row class="chang_card_title  textEllipsis">
                  <el-col :span="12">
                    {{ chang.scene_name }}
                  </el-col>
                  <el-col :span="12">
                    <div
                      style="float:right"
                      v-show="svgArr[index].svg1"
                      @click="changetype(index)"
                    >
                      <svg
                        t="1643335461546"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="4067"
                        width="20"
                        height="20"
                      >
                        <path
                          d="M928 96H96c-35.296 0-64 28.704-64 64v704c0 35.296 28.704 64 64 64h832c35.296 0 64-28.704 64-64V160c0-35.296-28.704-64-64-64zM96 864V160h832l0.064 704H96z"
                          p-id="4068"
                          fill="#13227a"
                        ></path>
                        <path
                          d="M832 192H192c-35.296 0-64 28.704-64 64v512c0 35.296 28.704 64 64 64h640c35.296 0 64-28.704 64-64V256c0-35.296-28.704-64-64-64zM192 768V256h640l0.064 512H192z"
                          p-id="4069"
                          fill="#13227a"
                        ></path>
                        <path
                          d="M672 288H352a32 32 0 0 0 0 64h320a32 32 0 1 0 0-64z"
                          p-id="4070"
                          fill="#13227a"
                        ></path>
                      </svg>
                      <!-- {{chang.stage_type}} -->
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div
                      style="float:right"
                      v-show="svgArr[index].svg2"
                      @click="changetype(index)"
                    >
                      <svg
                        t="1643337166563"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="11448"
                        width="20"
                        height="20"
                      >
                        <path
                          d="M244.1 832V711.4 694c0-9.4-8.3-18.4-18-18-9.8 0.4-18 7.9-18 18v138c0 9.4 8.3 18.4 18 18 9.7-0.4 18-7.9 18-18zM434.7 832V692v-20c0-9.4-8.3-18.4-18-18-9.8 0.4-18 7.9-18 18v160c0 9.4 8.3 18.4 18 18 9.7-0.4 18-7.9 18-18zM625.3 832v-76.1V634v-27.9c0-9.4-8.3-18.4-18-18-9.8 0.4-18 7.9-18 18V832c0 9.4 8.3 18.4 18 18 9.8-0.4 18-7.9 18-18zM815.9 832v-38.2V702 591.5v-96c0-15.6 0.5-31.2 0-46.8v-0.7c0-9.4-8.3-18.4-18-18-9.8 0.4-18 7.9-18 18v336.5c0 15.6-0.5 31.2 0 46.8v0.7c0 9.4 8.3 18.4 18 18 9.8-0.4 18-7.9 18-18zM238.8 521.1c17.8-17.8 35.5-35.6 53.3-53.4 28.3-28.4 56.7-56.8 85-85.2l19.6-19.6h-25.5c14.4 14.4 28.8 28.7 43.2 43.1 23 22.9 45.9 45.9 68.9 68.8l15.9 15.9c6.9 6.9 18.6 6.9 25.5 0l28.4-28.4 68.3-68.3 82.6-82.6 71.4-71.4c11.5-11.5 23.6-22.7 34.7-34.7l0.5-0.5c11-11 2.9-30.7-12.7-30.7H648.6c-9.4 0-18.4 8.3-18 18 0.4 9.8 7.9 18 18 18h149.3l-18-18v149.3c0 9.4 8.3 18.4 18 18 9.8-0.4 18-7.9 18-18V210.6v-18.5c0-9.7-8.2-18-18-18H648.6c-9.4 0-18.4 8.3-18 18 0.4 9.8 7.9 18 18 18h149.3c-4.2-10.2-8.5-20.5-12.7-30.7l-28.4 28.4-68.3 68.3-82.6 82.6-71.4 71.4c-11.5 11.5-23.7 22.6-34.7 34.7l-0.5 0.5h25.5c-14.4-14.4-28.8-28.7-43.2-43.1-23-22.9-45.9-45.9-68.9-68.8l-15.9-15.9c-6.9-6.9-18.6-6.9-25.5 0-17.8 17.8-35.5 35.6-53.3 53.4-28.3 28.4-56.7 56.8-85 85.2l-19.6 19.6c-6.7 6.7-7.2 18.9 0 25.5 7.1 6.5 18.3 7 25.4-0.1z"
                          p-id="11449"
                          fill="#08af3a"
                        ></path>
                      </svg>
                      <!-- {{chang.stage_type}} -->
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div
                      style="float:right"
                      v-show="svgArr[index].svg3"
                      @click="changetype(index)"
                    >
                      <svg
                        t="1643336391437"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="7538"
                        width="20"
                        height="20"
                      >
                        <path
                          d="M728.153613 555.13498a30.11336 30.11336 0 0 0-51.79498 9.335141A224.344534 224.344534 0 0 1 637.813532 632.526316a312.275547 312.275547 0 0 0 1.806802-33.726964 381.235142 381.235142 0 0 0-2.710203-41.857571 308.963077 308.963077 0 0 0-23.187287-81.004939 34.329231 34.329231 0 0 0-3.914737-8.431741 301.133603 301.133603 0 0 0-110.516033-127.078381 30.11336 30.11336 0 0 0-30.11336 0 30.11336 30.11336 0 0 0-15.960081 26.198624 207.481053 207.481053 0 0 1-21.982753 90.340081 201.458381 201.458381 0 0 1-76.789069 82.811741A271.020243 271.020243 0 0 0 268.924868 619.577571a264.09417 264.09417 0 0 0-42.760972 144.242996 259.577166 259.577166 0 0 0 30.113361 124.669311 266.804373 266.804373 0 0 0 94.254817 99.675223 30.11336 30.11336 0 0 0 33.726964 0 30.11336 30.11336 0 0 0 11.443077-31.619028 267.105506 267.105506 0 0 1-6.926073-60.226721 251.145425 251.145425 0 0 1 17.465749-92.74915 236.088745 236.088745 0 0 1 18.068016-38.545101l1.806802 4.215871a470.972956 470.972956 0 0 0 199.350445 221.032064 207.179919 207.179919 0 0 0 19.874818 10.539677l3.31247 1.806801a30.11336 30.11336 0 0 0 32.221295-3.914737 316.792551 316.792551 0 0 0 107.504697-167.12915 341.78664 341.78664 0 0 0 9.937409-78.59587 315.286883 315.286883 0 0 0-70.16413-197.844777z"
                          fill="#d81e06"
                          p-id="7539"
                        ></path>
                        <path
                          d="M281.572479 371.142348a30.11336 30.11336 0 0 1-25.295222-13.551012 30.11336 30.11336 0 0 1 8.732874-41.556437l12.647611-8.130608a30.11336 30.11336 0 0 1 30.113361 51.79498l-8.732875 6.624939a30.11336 30.11336 0 0 1-17.465749 4.818138z"
                          fill="#d81e06"
                          p-id="7540"
                        ></path>
                        <path
                          d="M707.074261 1024a32.221296 32.221296 0 0 1-10.539676-1.806802 412.251903 412.251903 0 0 1-70.465264-32.823562 470.972956 470.972956 0 0 1-199.350445-221.032065l-1.806802-4.215871a236.088745 236.088745 0 0 0-18.068016 38.545102 256.264696 256.264696 0 0 0-3.914737 175.259757 30.11336 30.11336 0 0 1-6.926073 30.11336 30.11336 30.11336 0 0 1-30.11336 8.130607 391.473684 391.473684 0 0 1-231.571741-190.015303 391.473684 391.473684 0 0 1 17.164616-396.291822c5.721538-9.034008 12.045344-17.766883 18.369149-25.89749a30.11336 30.11336 0 0 1 47.57911 36.738299c-5.420405 7.227206-10.539676 14.454413-15.357814 21.982753a331.246964 331.246964 0 0 0-14.755547 335.462834 331.246964 331.246964 0 0 0 144.54413 140.32826A337.269636 337.269636 0 0 1 329.151589 895.415951a312.275547 312.275547 0 0 1 21.380485-114.129635 308.963077 308.963077 0 0 1 60.226721-100.879757 30.11336 30.11336 0 0 1 30.11336-9.034009 30.11336 30.11336 0 0 1 21.982753 21.380486 439.353927 439.353927 0 0 0 18.36915 51.493847 412.85417 412.85417 0 0 0 174.356357 193.026639 309.565344 309.565344 0 0 0 46.976842 22.886154 412.251903 412.251903 0 0 0 160.203077-233.378542 421.587045 421.587045 0 0 0 12.045344-100.27749 402.01336 402.01336 0 0 0-60.226721-214.105992 331.246964 331.246964 0 0 1-20.175951 34.931498 376.417004 376.417004 0 0 1-125.873846 122.260243c-9.937409 5.721538-19.573684 10.84081-30.113361 15.658947a30.11336 30.11336 0 0 1-33.726963-5.721539 30.11336 30.11336 0 0 1-4.517004-33.726963 389.365749 389.365749 0 0 0 30.11336-156.890607 481.813765 481.813765 0 0 0-3.31247-54.806316 402.01336 402.01336 0 0 0-30.11336-105.697895v-3.31247l-1.806802-3.312469a389.365749 389.365749 0 0 0-101.783158-135.208988 396.894089 396.894089 0 0 1-37.6417 114.731903 30.11336 30.11336 0 0 1-53.601781-27.102025A338.775304 338.775304 0 0 0 437.258552 30.259109a30.11336 30.11336 0 0 1 46.675709-25.295223 451.700405 451.700405 0 0 1 164.418947 189.71417 50.891579 50.891579 0 0 1 5.119271 10.84081 458.024211 458.024211 0 0 1 34.329231 120.453441 556.193765 556.193765 0 0 1 2.710203 62.936924 466.757085 466.757085 0 0 1-10.539677 98.169554 319.502753 319.502753 0 0 0 62.936924-72.272065A307.156275 307.156275 0 0 0 780.851994 341.330121a30.11336 30.11336 0 0 1 50.891579-9.937409 470.069555 470.069555 0 0 1 103.891093 294.508664 481.813765 481.813765 0 0 1-13.852146 114.731903 471.876356 471.876356 0 0 1-198.145911 277.946316 30.11336 30.11336 0 0 1-16.562348 5.420405zM597.762763 227.200486z m-2.107935-3.914737z"
                          fill="#d81e06"
                          p-id="7541"
                        ></path>
                      </svg>
                      <!-- {{chang.stage_type}} -->
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div
                      style="float:right"
                      v-show="svgArr[index].svg4"
                      @click="changetype(index)"
                    >
                      <svg
                        t="1643336594779"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="10184"
                        width="20"
                        height="20"
                      >
                        <path
                          d="M802.133333 213.333333v597.333334h-597.333333V213.333333h597.333333m0-85.333333h-597.333333a85.333333 85.333333 0 0 0-85.333333 85.333333v597.333334a85.333333 85.333333 0 0 0 85.333333 85.333333h597.333333a85.333333 85.333333 0 0 0 85.333334-85.333333V213.333333a85.333333 85.333333 0 0 0-85.333334-85.333333z"
                          fill="#040404"
                          p-id="10185"
                        ></path>
                        <path
                          d="M332.8 341.333333m42.666667 0l256 0q42.666667 0 42.666666 42.666667l0 256q0 42.666667-42.666666 42.666667l-256 0q-42.666667 0-42.666667-42.666667l0-256q0-42.666667 42.666667-42.666667Z"
                          fill="#040404"
                          p-id="10186"
                        ></path>
                      </svg>
                      <!-- {{chang.stage_type}} -->
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div
                      style="float:right"
                      v-show="svgArr[index].svg5"
                      @click="changetype(index)"
                    >
                      <svg
                        t="1643355614875"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="2794"
                        width="20"
                        height="20"
                      >
                        <path
                          d="M512 64c-247.4 0-448 200.6-448 448 0 247.4 200.6 448 448 448s448-200.6 448-448C960 264.6 759.4 64 512 64L512 64zM118.3 512c0-217.4 176.3-393.7 393.7-393.7 94.3 0 180.9 33.2 248.7 88.5 10.3 8.4 20.1 17.3 29.5 26.6L220.8 777c-1-1.1-2-2.2-2.9-3.3C155.9 704.2 118.3 612.5 118.3 512L118.3 512zM512 905.7c-94.8 0-181.8-33.5-249.7-89.3l565.4-539.7c49 65.6 78 147.1 78 235.3C905.7 729.4 729.4 905.7 512 905.7L512 905.7zM512 905.7"
                          p-id="2795"
                          fill="#040404"
                        ></path>
                      </svg>
                      <!-- {{chang.stage_type}} -->
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <div class="top_font">
                    <!-- 本场时长：150min -->
                    <div class="item_title iconfont">&#59090;</div>
                    {{ chang.duration || "No Time" }}
                  </div>
                </el-row>
                <div class="content" @dblclick="to_edit(chang.id)">
                  <div class="item">
                    <div class="item_title iconfont">&#xe79e;</div>
                    <div class="item_content textEllipsis">
                      {{ chang.scene_type }}
                    </div>
                  </div>
                  <div class="item">
                    <div class="item_title iconfont">&#xe601;</div>
                    <div class="item_content textEllipsis">
                      {{ chang.scene_time }}
                    </div>
                  </div>
                  <div class="item">
                    <div class="item_title iconfont">&#xe632;</div>
                    <div class="item_content textEllipsis">
                      {{ chang.scene_location }}
                    </div>
                  </div>
                  <div class="item">
                    <div class="item_title iconfont">&#59320;</div>
                    <div class="item_content textEllipsis">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="chang.abstract"
                        placement="top"
                      >
                        <el-button style="padding:0;broder: none;">
                          <!-- {{chang.abstract?chang.abstract.length:'不存在'}} -->
                          {{
                            chang.abstract && chang.abstract.length > 10
                              ? chang.abstract.slice(0, 10) + "..."
                              : chang.abstract
                          }}
                        </el-button>
                      </el-tooltip>
                    </div>
                  </div>
                </div>

                <!-- ////卡片内容 -->

                <div class="cover_operations">
                  <el-checkbox
                    class="card_checkbox"
                    :label="chang.id"
                    :disabled="chang.episode_id != -1"
                  ></el-checkbox>
                  <el-row v-if="chang.episode_id != -1" class="card_checked">
                    已放入剧集组：<el-link
                      :href="
                        '#/board/e/' +
                          encode(drama_id) +
                          '/' +
                          encode(chang.episode_id)
                      "
                      target="_blank"
                      >{{
                        episode_data[episode_data_map[chang.episode_id]]
                          .episode_name
                      }}</el-link
                    >
                  </el-row>
                  <el-row class="card_title">{{ chang.scene_name }}</el-row>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-checkbox-group>

        <el-row style="text-align:center;width:100%;" v-else
          ><i
            style="color: #FF9800;margin-right:10px;"
            class="el-icon-warning"
          />
          这个剧本还没有任何场</el-row
        >
      </div>

      <!-- 分页功能-->

      <div style="text-align:center;">
        <el-pagination
          class="pagination"
          @current-change="handleCurrentChange"
          background
          :current-page="page"
          :page-size="pageSize"
          layout="prev, pager, next,jumper"
          :total="totalNum"
        >
        </el-pagination>
      </div>

      <!-- 右侧抽屉 -->
      <el-drawer title="场次顺序" :visible.sync="drawer" :with-header="true">
        <div class="drawer">
          <el-timeline-item
            timestamp="2018/4/12"
            placement="top"
            v-for="chang in chang_data"
            :key="chang.id"
          >
            <div @dblclick="to_edit(chang.id)">
              <el-card>
                <el-row class="chang_card_title  textEllipsis">
                  {{ chang.scene_name }}
                  {{ chang.scene_location }}
                </el-row>
              </el-card>
            </div>
          </el-timeline-item>
        </div>
      </el-drawer>

      <el-card
        class="card_iframe"
        :class="show_faste ? 'show' : ''"
        v-loading="true"
      >
        <el-button
          type="danger"
          icon="el-icon-close"
          circle
          style="
                position:absolute;top:10px;right:10px;z-index: 3001;
                "
          @click="
            show_faste = false;
            faste_url = '';
          "
        ></el-button>
        <iframe :src="faste_url"></iframe>
      </el-card>
      <el-dialog
        title="添加至..."
        :visible.sync="show_add_to"
        width="30%"
        :before-close="handleClose"
      >
        <el-row v-if="checkList.length > 0">
          <el-tag
            style="margin-right:5px"
            v-for="changid in checkList"
            :key="changid"
            >{{ chang_data[chang_data_map[changid]].scene_name }}</el-tag
          >
        </el-row>
        <el-row v-else>
          未选中任何场
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-radio-group v-model="add_to_episode_id">
            <el-radio
              :label="episode.id"
              v-for="episode in episode_data"
              :key="episode.id"
              >{{ episode.episode_name }}</el-radio
            >
            <!-- <el-tag style="margin-right:5px" effect="dark" v-for="episode in episode_data" :key="episode.id">{{episode.episode_name}}</el-tag> -->
          </el-radio-group>
        </el-row>
        <el-row style="margin-top:20px;">
          <el-button
            type="primary"
            icon="el-icon-circle-plus"
            @click="add_episode_show = true"
            >新增剧集</el-button
          >
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="show_add_to = false">取 消</el-button>
          <el-button type="primary" @click="add_changs_to_episode"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
    <div v-show="changetype_show" class="changetype_card" style="z-index:999">
      <el-card shadow="hover">
        <div style="padding-top:10px;text-align:center;">
          <h3>修改type</h3>
        </div>
        <div style="padding-top:10px;text-align:center;">
          <el-select v-model="type_value" placeholder="请选择">
            <el-option v-for="item in type_options" :key="item" :value="item">
            </el-option>
          </el-select>
        </div>
        <div style="padding-top:20px;text-align:center;">
          <div class="bigevents_btn" @click="changetype_show = false">
            取消
          </div>
          <div class="bigevents_btn" @click="save_type()">
            保存
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import "../../css/jeditor.css";
import "../../index";
const $ = require("jquery");
const Loadding = require("../../js/loadding").default.Loadding;

const base = require("../../js/base").default;
export default {
  // router,
  props: ["encode_drama_id"],
  data() {
    return {
      svgArr: [],
      stage_type: "",
      changetype_show: false,
      type_value: "",
      type_options: ["开端", "发展", "高潮", "结尾"],
      drama_id: "",
      episode_id: "",
      scene_id: "",
      mainevent: "",

      reverse: true,
      drawer: false,
      ROOT_HOST: ROOT_HOST,
      show_faste: false,
      show_add_to: false,
      faste_url: "",
      searchcontent: "",
      is_edit: false,
      checkList: [],
      flag: 1,
      character_name: [],
      //人物角色

      //定义一个角色和此角色第一次出现对应的场的字典
      character_drama: {
        name: "",
        drama: "",
      },

      from_chang_get_characters: [], //从所有场里面获取到的角色（有重复）

      add_chang_show: false,
      chang_data_map: {},
      chang_data: [],
      add_episode_show: false,
      episode_data_map: {},
      episode_data: [],
      add_to_episode_id: null,

      // 分页

      pageSize: 18,
      currentPage: 1,
      totalNum: "",
      page: 1,
      current_data: [],
    };
  },
  mounted: function() {
    base.reset_rightboard_width();
    var that = this;
    this.drama_id = window.atob(this.encode_drama_id);
    console.log(that);
    var first_loadding = new Loadding();
    first_loadding.add_title("初始化");
    first_loadding.__init__();
    first_loadding.add_process("拉取场数据", function() {
      //that.__init_eidtor();
      $.ajax({
        type: "POST",
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        url: ROOT_HOST + "/jeditor/api/episode/" + that.drama_id,
        async: false,
        dataType: "json",
        success: function(returndata) {
          for (var i = 0; i < returndata.character.length; i++) {
            that.character_name.push(returndata.character[i].name);
          }
          // console.log("这是人物角色数据")
          // console.log(that.character_name)
          // for(var k=0;k<that.character_name.length;k++){
          //     console.log("这是人物角色数据")
          //     console.log(that.character_name[k])
          // }
        },
      });

      $.ajax({
        type: "POST",
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        url: ROOT_HOST + "/jeditor/api/all_scene/" + that.drama_id,
        async: false,
        success: function(returndata) {
          returndata = returndata[0];
          console.log("ajian：");
          console.log(returndata.length);
          that.totalNum = returndata.length;
          console.log(that.totalNum);
          console.log("666666");
          for (var i = 0; i < returndata.length; i++) {
            console.log(returndata[i].scene_name);
          }
          let roles = {};
          for (var i = 0; i < returndata.length; i++) {
            that.chang_data.push(returndata[i]);
            that.chang_data.push();
            // that.type_value.push(returndata[i].stage_type)

            if (that.chang_data[i].stage_type == "开端") {
              that.svgArr.push({
                svg1: true,
                svg2: false,
                svg3: false,
                svg4: false,
                svg5: false,
              });
            } else if (that.chang_data[i].stage_type == "发展") {
              that.svgArr.push({
                svg1: false,
                svg2: true,
                svg3: false,
                svg4: false,
                svg5: false,
              });
            } else if (that.chang_data[i].stage_type == "高潮") {
              that.svgArr.push({
                svg1: false,
                svg2: false,
                svg3: true,
                svg4: false,
                svg5: false,
              });
            } else if (that.chang_data[i].stage_type == "结尾") {
              that.svgArr.push({
                svg1: false,
                svg2: false,
                svg3: false,
                svg4: true,
                svg5: false,
              });
            } else {
              that.svgArr.push({
                svg1: false,
                svg2: false,
                svg3: false,
                svg4: false,
                svg5: true,
              });
            }
            let rdata = returndata[i];
            for (var j = 0; j < rdata.main_roles.length; j++) {
              let r = rdata.main_roles[j];
              console.log(r.name);
              console.log(rdata.scene_name);
              if (roles.hasOwnProperty(r.name)) {
                continue;
              } else {
                roles[r.name] = rdata.scene_name;
              }
            }

            for (var j = 0; j < returndata[i].main_roles.length; j++) {
              that.from_chang_get_characters.push(
                returndata[i].main_roles[j].name
              );
            }
            console.log("hahahahah");
            console.log(that.from_chang_get_characters);
            that.chang_data_map[returndata[i].id] = i;
          }
          console.log(roles);
          console.log("这个是that.svgArr");
          console.log(that.svgArr);
          //console.log("-----")

          //console.log(that.from_chang_get_characters)
        },
      });
    });

    first_loadding.add_process("拉取剧集数据", function() {
      //that.__init_eidtor();
      $.ajax({
        type: "POST",
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        url: ROOT_HOST + "/jeditor/api/episode/" + that.drama_id,
        async: false,
        dataType: "json",
        success: function(returndata) {
          that.episode_data = returndata.episode;
          that.characters = returndata.character;
          for (var i = 0; i < returndata.episode.length; i++) {
            that.episode_data_map[returndata.episode[i].id] = i;
          }
        },
      });
    });

    first_loadding.start();
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
    },

    // 得到type
    changetype: function(id) {
      if (this.changetype_show == false) {
        this.changetype_show = true;
      } else {
        this.changetype_show = false;
      }
      console.log("得到目前指定type");
      console.log(this.chang_data[id].stage_type);
      var that = this;
      that.type_value = that.chang_data[id].stage_type;
      that.drama_id = that.chang_data[id].drama_id;
      that.episode_id = that.chang_data[id].episode_id;
      that.scene_id = that.chang_data[id].id;
      that.mainevent = that.chang_data[id].main_event;
      console.log(that.drama_id);
      console.log(that.episode_id);
      console.log(that.scene_id);
      console.log(that.mainevent);
    },
    // 修改type函数
    save_type: function() {
      var that = this;

      $.ajax({
        type: "POST",
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        url:
          ROOT_HOST +
          "/jeditor/api/setsceneevent/" +
          that.drama_id +
          "/" +
          that.episode_id +
          "/" +
          that.scene_id,
        data: JSON.stringify({
          stage_type: that.type_value,
          main_event: that.main_event,
        }),
        async: false,
        success: function() {
          //   that.changetype_show = false;
          location.reload();

          console.log("done");
          that.$notify({
            title: "成功",
            message: "保存成功！",
            type: "success",
            position: "bottom-right",
            duration: 1200,
          });
        },
      });
    },

    getStage_type_function: function() {
      var that = this;
      that.check_type = [];
      $.ajax({
        type: "POST",
        xhrFields: {
          withCredentials: true,
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
        async: false,
        success: function(data) {
          console.log("这是type");
          console.log(data);
          //that.abstract = returndata[0][0].abstract
          // debugger
        },
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    to_edit: function(id) {
      let chang = this.chang_data[this.chang_data_map[id]];
      this.show_faste = true;
      setTimeout(() => {
        this.faste_url =
          "#/board/faste/" +
          this.encode(chang.drama_id) +
          "/" +
          this.encode(chang.episode_id) +
          "/" +
          this.encode(chang.id);
      }, 500);
    },
    reset_new_chang: function() {
      var new_form = $("#add_new_chang_board");
      var items = new_form.find(".item input");
      items.val("");
    },
    submit_new_chang: function() {
      var that = this;
      var new_form = $("#add_new_chang_board");
      var items = new_form.find(".item input");
      var form = {};
      for (var i = 0; i < items.length; i++) {
        if (items[i].value.length == 0) {
          items[i].style.border = "2px dashed #E57373";
          setTimeout(function() {
            items[i].style.border = "0px dashed transparent";
          }, 1000);
          return;
        }
        form[items[i].getAttribute("name")] = items[i].value;
      }

      var add_loadding = new Loadding();
      add_loadding.add_title("新建场");
      add_loadding.__init__();
      add_loadding.add_process("新建", function() {
        $.ajax({
          type: "POST",
          xhrFields: {
            withCredentials: true,
          },
          crossDomain: true,
          url:
            ROOT_HOST +
            "/jeditor/api/createepisodescene/" +
            that.drama_id +
            "/-1",

          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify(form),
          async: false,
          dataType: "json",
          success: function(returndata) {
            console.log(returndata);
            that.chang_data.push(returndata[0]);
            that.chang_data_map[returndata[0].id] = that.chang_data.length - 1;
          },
        });
      });

      add_loadding.start(function() {
        that.add_chang_show = false;
      });
    },
    reset_new_episode: function() {
      var new_form = $("#add_new_episode_board");
      var items = new_form.find(".item input");
      items.val("");
    },
    submit_new_episode: function() {
      var that = this;
      var new_form = $("#add_new_episode_board");
      var items = new_form.find(".item input");
      var form = {};
      for (var i = 0; i < items.length; i++) {
        if (items[i].value.length == 0) {
          items[i].style.border = "2px dashed #E57373";
          setTimeout(function() {
            items[i].style.border = "0px dashed transparent";
          }, 1000);
          return;
        }
        form[items[i].getAttribute("name")] = items[i].value;
      }

      var add_loadding = new Loadding();
      add_loadding.add_title("新建场");
      add_loadding.__init__();
      add_loadding.add_process("新建", function() {
        $.ajax({
          type: "POST",
          xhrFields: {
            withCredentials: true,
          },
          crossDomain: true,
          url: ROOT_HOST + "/jeditor/api/createepisode/" + that.drama_id,

          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify(form),
          async: false,
          dataType: "json",
          success: function(returndata) {
            console.log(returndata);
            that.episode_data.push(returndata);
            that.episode_data_map[returndata.id] = that.episode_data.length - 1;
          },
        });
      });

      add_loadding.start(function() {
        that.add_episode_show = false;
      });
    },

    add_changs_to_episode: function() {
      if (this.checkList.length == 0) {
        this.$alert("无选中场", "错误", {
          confirmButtonText: "确定",
          callback: (action) => {
            this.show_add_to = false;
          },
        });
        return;
      }
      if (this.add_to_episode_id == null) {
        this.$alert("无选中剧集", "错误", {
          confirmButtonText: "确定",
          callback: (action) => {
            this.show_add_to = false;
          },
        });
        return;
      }
      let form = {
        drama_id: this.drama_id,
        old_episode_id: -1,
        new_episode_id: this.add_to_episode_id,
        scene_list: this.checkList,
      };
      var that = this;
      var update_loadding = new Loadding();
      update_loadding.add_title("更新场");
      update_loadding.__init__();
      update_loadding.add_process("新建", function() {
        $.ajax({
          type: "POST",
          xhrFields: {
            withCredentials: true,
          },
          crossDomain: true,
          url: ROOT_HOST + "/jeditor/api/update_scene_episode",

          contentType: "application/json;charset=UTF-8",
          data: JSON.stringify(form),
          async: false,
          dataType: "json",
          success: function(returndata) {
            console.log(returndata);
          },
        });
      });

      update_loadding.start(function() {
        that.checkList.forEach((id) => {
          that.chang_data[that.chang_data_map[id]].episode_id =
            that.add_to_episode_id;
        });
        that.checkList.splice(0, that.checkList.length);
        that.show_add_to = false;
      });
    },
    encode: function(code) {
      return window.btoa(code);
    },
  },
};
</script>
<style>
/* global styles */
.card_checkbox .el-checkbox__label {
  display: none;
}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../css/theme.sass";
ul {
  display: block;
}
.chang_card {
  border-radius: 4px;
  position: relative;
  transition: ease 0.5s;
}
.chang_card:hover {
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.3);
}
.chang_card_title {
  transition: ease 0.6s;
  font-weight: bold;
  font-size: 1em;
  line-height: 1.2em;
}
.content {
  height: 120px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  transition: ease 0.6s;
  cursor: pointer;
}
.item_board .item {
  width: 100%;
  height: 20px;
  padding: 5px 0px;
  box-sizing: border-box;
  margin: 5px 0px;
  position: relative;
}
.item_board .item_title {
  float: left;
  height: 20px;
  line-height: 20px;
  width: 20px;
  position: relative;
}

.item_board .item_content {
  background: rgb(245, 245, 245);
  border-radius: 10px;
  padding: 0px 5px;
  float: left;
  height: 20px;
  text-align: justify;
  line-height: 20px;
  width: calc(100% - 30px);
  position: relative;
}
.little-item-card {
  height: 15px;
  width: auto;
  padding: 0px 5px;
  background: #263238;
  float: left;
  line-height: 15px;
  border-radius: 10px;
  color: white;
  font-size: 10px;
  margin: 2px;
  position: relative;
}
.cover_operations {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: -1;
  // background:rgba(0,0,0,.1);
  background: white;
  height: 100%;
  width: 100%;
  opacity: 0;
  // backdrop-filter: blur(10px);
  transition: ease 0.5s;
  transform: scale(0.9);
  border-radius: 30px;
}
.active .cover_operations {
  z-index: 10;
  opacity: 1;
  transform: scale(1);
  border-radius: 0px;
}
.active .content {
  transform: scale(0.9);
}

.active .chang_card_title {
  transform: scale(0.9);
}

.cover_operations .card_checkbox {
  position: absolute;
  right: 10px;
  top: 20px;
  transform: scale(1.3);
}

.cover_operations .card_checked {
  position: absolute;
  bottom: 0px;
  text-align: center;
  width: 100%;
  font-size: 12px;
}
.cover_operations .card_title {
  position: absolute;
  top: 52px;
  text-align: center;
  width: 100%;
  font-size: 1.2em;
  font-weight: bold;
}

.card_iframe {
  position: absolute;
  top: 10px;
  left: 10px;
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  padding: 0px;
  border-radius: 5px;
  transition: ease 0.5s;
  z-index: -1;
  transform: scale(0.8);
  opacity: 0;
}
.card_iframe.show {
  z-index: 1;
  transform: scale(1);
  opacity: 1;
}
.card_iframe iframe {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  border-radius: 0px;
  border: 1px;
  z-index: 3000;
}

#add_new_episode_board {
  z-index: 2100;
  position: fixed;
}
#add_new_episode_board .cover {
  z-index: -1;
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 100vw;
  background: transparent;
}
.top_font {
  font-size: 5px;
  // position: absolute;
  right: 5px;
}
.drawer {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  position: absolute;
}
// .el-drawer__body {
//    height: 100%;
//    overflow: auto;
//    overflow-y: scroll;

// }
// .el-drawer__container ::-webkit-scrollbar{
//     display: none;
// }
.item .el-button {
  border: none !important;
  text-align: left;
  margin: 0;
  background-color: whitesmoke;
}
.type_tag {
  font-size: 5px;
}
.changetype_card {
  position: absolute;
  top: 30%;
  left: 40%;
  margin-top: -100px;
  margin-left: -100px;
  margin-top: 20px;
  height: 400px;
  width: 400px;

  //   margin-left: 30px;
}
.bigevents_btn {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  background-color: #009688;
  border: none;
  color: white;
  padding: 9px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 15px;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  margin: 5px;
}
.bigevents_btn:hover {
  background-color: #e91e63; /* Green */
  color: white;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #e91e63;
  color: #fff;
}
</style>
