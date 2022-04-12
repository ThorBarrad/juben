<template>
    <div style="width: 100%">
        <div id="search">
            <el-input type="text" style="width: calc(100% - 100px);float:left;text-indent:10px;" id="search_input" v-model="searchContent" @keyup.enter.native="search"/>
            <!-- <input type="button" id="search_btn" class="btn" value="搜索" @click="search" /> -->
            <input type="button" id="search_btn" class="btn" value="搜索" @click="search_by_baidu" />
        </div>
        <el-main style="margin: 5px 10px;max-height: calc(100vh - 100px);padding: 5px;overflow: hidden;">
            <el-row :gutter="10">
                <el-col :span="16">
                    <ul id="result_board" class="infinite-list" :infinite-scroll-distance="30" :infinite-scroll-disabled="(wiki_loading || es_page>20)" v-infinite-scroll="append_wiki_search" style="overflow:auto">
                        <li class="result_item infinite-list-item" v-for="(item,index) in searchResults" :key="index" @click="extend($event,index)">
                            <div class="title">
                                {{ item.name }}
                            </div>
                            <div class="content" >
                                {{ item.content }}
                            </div>
                            <div class="child_item" v-for="(c,j) in item.children" v-if="['content','参考文献'].indexOf(j)==-1">
                                <div class="child_title" >{{ j }}</div>
                                <div class="child_content" >{{ c.content==""?"无":c.content }}</div>
                            </div>
                            <!-- <HR style="border:1px solid #00000066" color="#00000066" SIZE=1 /> -->
                        </li>
                        <p style="text-align: center;" v-if="wiki_loading">加载中...</p>
                        <p style="text-align: center;"  v-if="es_page>20">到底了</p>
                    </ul>
                </el-col>
                <el-col :span="8" style="max-height: calc(100vh - 110px);overflow: auto;">
                    <el-card  v-if="search_cards_weibo.show">
                        <el-row class="card_head_board">
                            <el-col :span="18">
                                <img :src="search_cards_weibo.icon" class="card_head_icon"/>
                                <span class="">{{search_cards_weibo.title}}</span>
                            </el-col>
                            <el-col :span="6">
                                <el-button circle :icon="(search_cards_weibo.expanded?'el-icon-minus':'el-icon-plus')" @click="search_cards_weibo.expanded = !search_cards_weibo.expanded"></el-button>
                            </el-col>
                        </el-row>
                        <el-main class="card_main_board" v-loading="search_cards_weibo.loading">
                            <el-row v-if="(item.idx<1||search_cards_weibo.expanded)" v-for="item in search_cards_weibo.contents" class="card_main_item">
<!--                                <el-col :span="6">-->
<!--                                    <div class="card_main_pic" :style="{backgroundImage:'url('+item.pic+')'}"></div>-->
<!--                                </el-col>-->
                                <el-col :span="24" v-if="item.card_type==4" style="line-height:30px;" >
                                    <div class="weibo4_icon" :style="{backgroundImage:'url('+item.pic+')'}"></div><a target="__blank" :href="item.scheme" style="text-decoration:none;color:black;">{{item.desc}}</a>
                                </el-col>
                                <el-col :span="24" v-if="item.card_type==10">
                                    <el-row>
                                        <el-col :span="4">
                                            <div class="weibo10_icon" :style="{backgroundImage:'url('+item.user.profile_image_url+')'}"></div>
                                        </el-col>
                                        <el-col :span="20">
                                            <div class="weibo10_desc1"><a target="__blank" :href="item.scheme" style="text-decoration:none;color:black;">{{item.desc1}}</a></div>
                                            <div class="weibo10_desc2">{{item.desc2}}</div>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="24" v-if="item.card_type==19" style="line-height:30px;">
                                    <el-row>
                                        <div class="weibo4_icon" :style="{backgroundImage:'url('+item.group[0].pic+')'}"></div><a target="__blank" :href="item.group[0].scheme" style="text-decoration:none;color:black;">{{item.group[0].item_title}} <span  style="font-size: .8em;color: #666;float: right;">{{item.group[0].item_desc}}</span></a>
                                    </el-row>
                                </el-col>
                                <el-col :span="24" v-if="item.card_type==9">
                                    <el-row>
                                        <div class="weibo9_text" v-html="item.mblog.text"></div>
                                    </el-row>
                                    <el-row v-if="item.mblog.pic_num!=0" style="border-radius:1em;overflow:hidden;">
                                        <div class="weibo9_pic" :style="{backgroundImage:'url('+pic.url+')'}" v-for="pic in item.mblog.pics"></div>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-main>
                    </el-card>

                    <el-card  v-if="search_cards_douban.show">
                        <el-row class="card_head_board">
                            <el-col :span="18">
                                <img :src="search_cards_douban.icon" class="card_head_icon"/>
                                <span class="">{{search_cards_douban.title}}</span>
                            </el-col>
                            <el-col :span="6">
                                <el-button circle :icon="(search_cards_douban.expanded?'el-icon-minus':'el-icon-plus')" @click="search_cards_douban.expanded = !search_cards_douban.expanded"></el-button>
                            </el-col>
                        </el-row>
                        <el-main class="card_main_board" v-loading="search_cards_douban.loading">
                            <el-row v-if="(item.idx<1||search_cards_douban.expanded)" v-for="item in search_cards_douban.contents" class="card_main_item">
<!--                                <el-col :span="6">-->
<!--                                    <div class="card_main_pic" :style="{backgroundImage:'url('+item.pic+')'}"></div>-->
<!--                                </el-col>-->
                                <el-col :span="24">
                                    <el-row class="card_main_line" style="border-bottom: 1px solid rgba(0,0,0,.1);padding-bottom: 5px;margin-bottom: 5px;"><a :href="item.url" target="__blank" class="card_main_title_link">{{item.title}}</a> <img :src="search_cards_douban.type2icon[item.type]" class="card_main_icon"/>{{item.rate}} <span style="font-size: .8em;color: #666;">{{item.rate_num}}</span></el-row>
                                    <el-row class="card_main_line" v-if="item.rate!=0"></el-row>
                                    <el-row class="card_main_content" >{{item.content}}</el-row>
                                </el-col>
                            </el-row>
                        </el-main>
                    </el-card>

                    <el-card  v-if="search_cards_maoyan.show">
                        <el-row class="card_head_board">
                            <el-col :span="18">
                                <img :src="search_cards_maoyan.icon" class="card_head_icon"/>
                                <span class="">{{search_cards_maoyan.title}}</span>
                            </el-col>
                            <el-col :span="6">
                                <el-button circle :icon="(search_cards_maoyan.expanded?'el-icon-minus':'el-icon-plus')" @click="search_cards_maoyan.expanded = !search_cards_maoyan.expanded"></el-button>
                            </el-col>
                        </el-row>
                        <el-main class="card_main_board" v-loading="search_cards_maoyan.loading">
                            <el-row v-if="(item.idx<1||search_cards_maoyan.expanded)" v-for="item in search_cards_maoyan.contents" class="card_main_item">
<!--                                <el-col :span="6">-->
<!--                                    <div class="card_main_pic" :style="{backgroundImage:'url('+item.pic+')'}"></div>-->
<!--                                </el-col>-->
                                <el-col :span="24">
                                    <el-row class="card_main_line" style="border-bottom: 1px solid rgba(0,0,0,.1);padding-bottom: 5px;margin-bottom: 5px;"><a href="javascript:void(0);" target="__blank" class="card_main_title_link">{{item.nm}}</a> <span class="card_category" v-if="item.cat!=0">{{item.cat}}</span><span v-if="item.sc!=0">{{item.sc}}</span></el-row>
                                    <el-row class="card_main_line" v-if="item.sc!=0"></el-row>
                                    <el-row class="card_main_content" ><span style="padding: 0px 5px;background: white;margin-right: 5px;border-radius: 5px;font-weight: bold;">Director:</span>{{item.dir}}</el-row>
                                    <el-row class="card_main_content" ><span style="padding: 0px 5px;background: white;margin-right: 5px;border-radius: 5px;font-weight: bold;">Actors:</span>{{item.act}}</el-row>
                                    <el-row class="card_main_content" ><span style="padding: 0px 5px;background: white;margin-right: 5px;border-radius: 5px;font-weight: bold;">Published at:</span>{{item.pubDesc}}</el-row>
                                </el-col>
                            </el-row>
                        </el-main>
                    </el-card>

                    <el-card v-if="search_cards_IMDB.show">
                        <el-row class="card_head_board">
                            <el-col :span="18">
                                <img :src="search_cards_IMDB.icon" class="card_head_icon"/>
                                <span class="">{{search_cards_IMDB.title}}</span>
                            </el-col>
                            <el-col :span="6">
                                <el-button circle :icon="(search_cards_IMDB.expanded?'el-icon-minus':'el-icon-plus')" @click="search_cards_IMDB.expanded = !search_cards_IMDB.expanded"></el-button>
                            </el-col>
                        </el-row>
                        <el-main class="card_main_board" v-loading="search_cards_IMDB.loading">
                            <el-row v-if="(item.idx<1||search_cards_IMDB.expanded)" v-for="item in search_cards_IMDB.contents" class="card_main_item">
                               <el-col :span="(!item.i? 0:6)">
                                    <div class="card_main_pic" :style="{backgroundImage:'url('+item.i.imageUrl+')'}"></div>
                                </el-col>
                                <el-col :span="(!item.i? 24:18)">
                                    <el-row class="card_main_line" style="border-bottom: 1px solid rgba(0,0,0,.1);padding-bottom: 5px;margin-bottom: 5px;"><a :href="'https://www.imdb.com/title/'+item.id+'/'" target="__blank" class="card_main_title_link">{{item.l}}</a> <span class="card_category" style="background:rgba(193,158,34,.5)" v-if="item.q">{{item.q}}</span><div v-if="item.rank!=0">{{item.y}}<span style="font-size: .8em;color: #666;float: right;">score:{{item.rank}}</span></div></el-row>
                                    <el-row class="card_main_line" v-if="item.rank"></el-row>
                                    <el-row class="card_main_content" ><span style="padding: 0px 5px;background: white;margin-right: 5px;border-radius: 5px;font-weight: bold;">Stars:</span>{{item.s}}</el-row>
                                </el-col>
                            </el-row>
                        </el-main>
                    </el-card>

                    <el-card  v-if="search_cards_rottenTomato.show">
                        <el-row class="card_head_board">
                            <el-col :span="18">
                                <img :src="search_cards_rottenTomato.icon" class="card_head_icon"/>
                                <span class="">{{search_cards_rottenTomato.title}}</span>
                            </el-col>
                            <el-col :span="6">
                                <el-button circle :icon="(search_cards_rottenTomato.expanded?'el-icon-minus':'el-icon-plus')" @click="search_cards_rottenTomato.expanded = !search_cards_rottenTomato.expanded"></el-button>
                            </el-col>
                        </el-row>
                        <el-main class="card_main_board" v-loading="search_cards_rottenTomato.loading">
                            <el-row v-if="(item.idx<1||search_cards_rottenTomato.expanded)" v-for="item in search_cards_rottenTomato.contents" class="card_main_item">
                               <el-col :span="(item.imageUrl.indexOf('poster_default_redesign')!=-1 ? 0:6)">
                                    <div class="card_main_pic" :style="{backgroundImage:'url('+item.imageUrl+')'}"></div>
                                </el-col>
                                <el-col :span="(item.imageUrl.indexOf('poster_default_redesign')!=-1 ? 24:18)">
                                    <el-row class="card_main_line" style="border-bottom: 1px solid rgba(0,0,0,.1);padding-bottom: 5px;margin-bottom: 5px;"><a :href="item.url" target="__blank" class="card_main_title_link">{{item.name}}</a> <span class="card_category" v-if="item.type">{{item.type}}</span><div v-if="item.tomatometerScore">{{item.releaseYear}}<span style="font-size: .8em;color: #666;float: right;">rank:{{item.tomatometerScore.score}}</span></div></el-row>
                                    <el-row class="card_main_line" v-if="item.cast"></el-row>
                                    <el-row class="card_main_content" v-if="item.cast"><span style="padding: 0px 5px;background: white;margin-right: 5px;border-radius: 5px;font-weight: bold;">Stars:</span>{{item.cast.join(", ")}}</el-row>
                                </el-col>
                            </el-row>
                        </el-main>
                    </el-card>

                    <el-card  v-if="search_cards_baidu.show">
                        <el-row class="card_head_board">
                            <el-col :span="18">
                                <img :src="search_cards_baidu.icon" class="card_head_icon"/>
                                <span class="">{{search_cards_baidu.title}}</span>
                            </el-col>
                            <el-col :span="6">
                                <el-button circle :icon="(search_cards_baidu.expanded?'el-icon-minus':'el-icon-plus')" @click="search_cards_baidu.expanded = !search_cards_baidu.expanded"></el-button>
                            </el-col>
                        </el-row>
                        <el-main class="card_main_board" v-loading="search_cards_baidu.loading">
                            <el-row v-if="(item.idx<1||search_cards_baidu.expanded)" v-for="(item,index) in search_cards_baidu.contents" class="card_main_item" :key="index">
                                <el-col :span="24">
                                    <el-row class="card_main_line" style="border-bottom: 1px solid rgba(0,0,0,.1);padding-bottom: 5px;margin-bottom: 5px;">
                                        <a :href="item.ref" target="__blank" class="card_main_title_link">{{item.title}}</a>
                                    </el-row>
                                    <el-row class="card_main_content" >{{item.content}}</el-row>
                                </el-col>
                            </el-row>
                        </el-main>
                    </el-card>

                    <el-card  v-if="search_cards_bing.show">
                        <el-row class="card_head_board">
                            <el-col :span="18">
                                <img :src="search_cards_bing.icon" class="card_head_icon"/>
                                <span class="">{{search_cards_bing.title}}</span>
                            </el-col>
                            <el-col :span="6">
                                <el-button circle :icon="(search_cards_bing.expanded?'el-icon-minus':'el-icon-plus')" @click="search_cards_bing.expanded = !search_cards_bing.expanded"></el-button>
                            </el-col>
                        </el-row>
                        <el-main class="card_main_board" v-loading="search_cards_bing.loading">
                            <el-row v-if="(item.idx<1||search_cards_bing.expanded)" v-for="(item,index) in search_cards_bing.contents" class="card_main_item" :key="index">
                                <el-col :span="24">
                                    <el-row class="card_main_line" style="border-bottom: 1px solid rgba(0,0,0,.1);padding-bottom: 5px;margin-bottom: 5px;">
                                        <a :href="item.ref" target="__blank" class="card_main_title_link">{{item.title}}</a>
                                    </el-row>
                                    <el-row class="card_main_content" >{{item.content}}</el-row>
                                </el-col>
                            </el-row>
                        </el-main>
                    </el-card>

                </el-col>
            </el-row>
        </el-main>

    </div>
</template>

<script>
    import Vue from 'vue'
    import '../css/externalDB.css'
    var $ = require("jquery")
    const Loadding = require("../js/loadding").default.Loadding;
    export default {
        name: "ExternalDB",
        data(){
            return{
                es_page:0,
                wiki_loading:false,
                searchContent: "Jane Eyre",
                searchResults: [],
                search_cards_weibo:
                    {
                        id:0,
                        show:false,
                        title:"微博",
                        icon:"https://weibo.com/favicon.ico",
                        contents:[],
                        loading:true,
                        expanded:false,
                    },
                search_cards_douban:{
                        id:1,
                        title:"豆瓣",
                        show:true,
                        icon:"https://www.douban.com/favicon.ico",
                        contents:[],
                        type2icon:{
                            "[书籍]" :"https://static.easyicon.net/preview/129/1291991.gif",
                            "[电影]":"https://static.easyicon.net/preview/127/1279934.gif"
                        },
                        loading:true,
                        expanded:false,
                    },
                search_cards_maoyan:{
                        id:2,
                        title:"猫眼",
                        show:true,
                        icon:"https://maoyan.com/favicon.ico",
                        contents:[],
                        loading:true,
                        expanded:false,
                    },
                search_cards_IMDB:{
                        id:3,
                        title:"IMDB",
                        show:true,
                        icon:"https://ia.media-imdb.com/images/G/01/imdb/images/favicon-2165806970",
                        contents:[],
                        loading:true,
                        expanded:false,
                    },
                search_cards_rottenTomato:{
                        id:4,
                        title:"rottenTomato",
                        show:true,
                        icon:"https://www.rottentomatoes.com/favicon.ico",
                        contents:[
                        ],
                        loading:true,
                        expanded:false,
                    },
                search_cards_baidu:{
                        id:5,
                        title:"baidu",
                        show:true,
                        icon:"https://www.baidu.com/favicon.ico",
                        contents:[
                        ],
                        loading:true,
                        expanded:false,
                    },
                search_cards_bing:{
                        id:6,
                        title:"bing",
                        show:true,
                        icon:"https://cn.bing.com/favicon.ico",
                        contents:[
                        ],
                        loading:true,
                        expanded:false,
                    },
            }
        },
        mounted:function() {
            this.search();
        },
        methods:{
            search:function () {
                var loadding = new Loadding();
                var that = this;
                loadding.add_title("初始化");
                loadding.__init__();
                loadding.add_process("检索中",function(){
                    $.ajax({
                        url: ROOT_HOST + '/tool/zhwikiQuery/' + that.searchContent + '/'+ that.es_page,
                        type: 'GET',
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        async:false,
                        success:  (data) => {
                            that.searchResults.splice(0,that.searchResults.length);

                            data.data.forEach(ele =>{
                                ele.show = false;
                                that.searchResults.push(ele);
                            })
                            $(".result_item").siblings(".result_item").removeClass("active")
                            that.es_page +=1;
                        },
                        error: (xhr, error) => {
                            alert(error)
                        }
                    });
                    
                    
                });
                loadding.start()
                that.search_by_bing(that.searchContent);
                that.search_by_douban(that.searchContent);
                that.search_by_maoyan(that.searchContent);
                that.search_by_IMDB(that.searchContent);
                that.search_by_rottenTomato(that.searchContent);
                that.search_by_baidu(that.searchContent);
            },
            extend:function (e,index) {
                if ($(".result_item:nth-child("+(index+1)+")").hasClass("active"))
                {
                    $(".result_item:nth-child("+(index+1)+")").removeClass("active")
                }else {
                    $(".result_item:nth-child("+(index+1)+")").siblings(".result_item").removeClass("active")
                    $(".result_item:nth-child("+(index+1)+")").addClass("active")
                }
            },
            search_by_weibo: function(keywords){
                var that = this;
                that.search_cards_weibo.contents.splice(0,that.search_cards_weibo.contents.length);
                that.search_cards_weibo.loading=true;
                that.search_cards_weibo.show=true;
                $.ajax({
                    url: ROOT_HOST + '/tool/spider/weibo/' + keywords,
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success:  (data) => {
                        console.log(data)
                        data = data["data"]['cards'];
                        var num = 0;
                        for(let i=0;i<data.length;i++){
                            if(data[i].card_type in {4:0,9:0}){
                                data[i].idx = num;
                                num+=1;
                                if(num>=10)break;
                                that.search_cards_weibo.contents.push(data[i])
                            }else if(data[i].card_type == 11){
                                for(let j=0;j<data[i].card_group.length;j++){
                                    if(data[i].card_group[j].card_type in {10:0,19:0}){
                                        data[i].card_group[j].idx = num;
                                        num+=1;
                                        if(num>=10)break;
                                        that.search_cards_weibo.contents.push(data[i].card_group[j])
                                    }
                                }
                            }

                        }
                        console.log(that.search_cards_weibo.contents)
                        that.search_cards_weibo.loading=false;
                    },
                    error: (xhr, error) => {
                        // alert(error)
                        that.search_cards_weibo.show=false;
                    }
                })
            },
            search_by_douban: function(keywords){
                var that = this;
                that.search_cards_douban.contents.splice(0,that.search_cards_douban.contents.length);
                that.search_cards_douban.loading=true;
                that.search_cards_douban.show=true;
                keywords = keywords.split(" ").join("+")
                $.ajax({
                    url: ROOT_HOST + '/tool/spider/douban/' + keywords,
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success:  (data) => {
                        for(let i=0;i<data.length;i++){
                            data[i].idx = i;
                            if(i>=10)break;
                            that.search_cards_douban.contents.push(data[i])
                        }
                        that.search_cards_douban.loading=false;
                    },
                    error: (xhr, error) => {
                        // alert(error)
                        that.search_cards_douban.show=false;
                    }
                })
            },
            search_by_maoyan: function(keywords){
                var that = this;
                that.search_cards_maoyan.contents.splice(0,that.search_cards_maoyan.contents.length);
                that.search_cards_maoyan.loading=true;
                that.search_cards_maoyan.show=true;
                keywords = keywords.split(" ").join("+")
                $.ajax({
                    url: ROOT_HOST + '/tool/spider/maoyan/' + keywords,
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success:  (data) => {
                        data = data.movies.list;
                        for(let i=0;i<data.length;i++){
                            data[i].idx = i;
                            if(i>=10)break;
                            that.search_cards_maoyan.contents.push(data[i])
                        }
                        that.search_cards_maoyan.loading=false;
                    },
                    error: (xhr, error) => {
                        // alert(error)
                        that.search_cards_maoyan.show=false;
                    }
                })
            },
            search_by_baidu: function(keywords){
                var that = this;
                that.search_cards_baidu.contents.splice(0,that.search_cards_baidu.contents.length);
                that.search_cards_baidu.loading=true;
                that.search_cards_baidu.show=true;
                keywords = keywords.split(" ").join("+")
                $.ajax({
                    url: ROOT_HOST + '/tool/spider/baidu/' + keywords,
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success:  (data) => {
                        console.log(data)
                        for(let i=0;i<data.length;i++){
                            data[i].idx = i;
                            if(i>=10)break;
                            that.search_cards_baidu.contents.push(data[i])
                        }
                        that.search_cards_baidu.loading=false;
                    },
                    error: (xhr, error) => {
                        that.search_cards_baidu.show=false;
                    }
                })
            },
            search_by_bing: function(keywords){
                var that = this;
                that.search_cards_bing.contents.splice(0,that.search_cards_bing.contents.length);
                that.search_cards_bing.loading=true;
                that.search_cards_bing.show=true;
                keywords = keywords.split(" ").join("+")
                $.ajax({
                    url: ROOT_HOST + '/tool/spider/bing/' + keywords,
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success:  (data) => {
                        console.log(data)
                        for(let i=0;i<data.length;i++){
                            data[i].idx = i;
                            if(i>=10)break;
                            that.search_cards_bing.contents.push(data[i])
                        }
                        that.search_cards_bing.loading=false;
                    },
                    error: (xhr, error) => {
                        that.search_cards_bing.show=false;
                    }
                })
            },
            search_by_IMDB: function(keywords){
                var that = this;
                that.search_cards_IMDB.contents.splice(0,that.search_cards_IMDB.contents.length);
                that.search_cards_IMDB.loading=true;
                that.search_cards_IMDB.show=true;
                $.ajax({
                    url: ROOT_HOST + '/tool/spider/IMDB/' + keywords,
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success:  (data) => {
                        try{
                            if(!'d' in data){that.search_cards_IMDB.show=false;return;}
                            data = data["d"]
                            for(let i=0;i<data.length;i++){
                                data[i].idx = i;
                                if(i>=10)break;
                                that.search_cards_IMDB.contents.push(data[i])
                            }
                            that.search_cards_IMDB.loading=false;
                        }
                        catch{
                            that.search_cards_IMDB.show=false;
                        }
                    },
                    error: (xhr, error) => {
                        that.search_cards_IMDB.show=false;
                    }
                })
            },
            search_by_rottenTomato: function(keywords){
                var that = this;
                that.search_cards_rottenTomato.contents.splice(0,that.search_cards_rottenTomato.contents.length);
                that.search_cards_rottenTomato.loading=true;
                that.search_cards_rottenTomato.show=true;
                $.ajax({
                    url: ROOT_HOST + '/tool/spider/rottenTomato/' + keywords,
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success:  (data) => {
                        // console.log(data)
                        try{
                            for(let i=0;i<data.length;i++){
                                data[i].idx = i;
                                if(i>=10)break;
                                that.search_cards_rottenTomato.contents.push(data[i])
                            }
                            var num = 0;
                            for(var type in data){
                                if(type=="celebrities"){continue;}
                                if(data[type].count==0){continue;}
                                for(let i=0;i<data[type].items.length;i++){
                                    data[type].items[i].idx = num;
                                    data[type].items[i].type = type;
                                    num+=1;
                                    if(num>=10)break;
                                    that.search_cards_rottenTomato.contents.push(data[type].items[i])
                                }
                            }
                            that.search_cards_rottenTomato.loading=false;
                        }
                        catch{
                            that.search_cards_rottenTomato.show=false;
                        }
                    },
                    error: (xhr, error) => {
                        // alert(error)
                        that.search_cards_rottenTomato.show=false;
                    }
                })
            },
            append_wiki_search:function(){
                var that = this;
                that.wiki_loading = true;

                $.ajax({
                    url: ROOT_HOST + '/tool/zhwikiQuery/' + that.searchContent + '/'+ that.es_page,
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    async:false,
                    success:  (data) => {
                        data.data.forEach(ele=>{
                            ele.show = false;
                            that.searchResults.push(ele);
                        })
                        that.wiki_loading = false;
                        that.es_page +=1;
                        $(".result_item").siblings(".result_item").removeClass("active")
                    },
                    error: (xhr, error) => {
                        alert(error)
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
