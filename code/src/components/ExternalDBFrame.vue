<template>
    <div style="margin:auto;width: 100%">
        <div id="result_board">
            <div class="result_item" v-for="(item,index) in searchResults" :key="index" @click="extend($event,index)">
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
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    var $ = require("jquery")
    const Loadding = require("../js/loadding").default.Loadding;
    export default {
        name: "ExternalDBFrame",
        data(){
            return{
                searchContent: "",
                searchResults: [],
            }
        },
        mounted:function() {
            $("#left_board").remove();
            $("#right_board").css("width","100%");
            this.searchContent = window.location.search.split("?")[1];
            console.log(this.searchContent);
            this.search()
        },
        methods:{
            search:function () {
                var loadding = new Loadding();
                var that = this;
                loadding.add_title("初始化");
                loadding.__init__();
                loadding.add_process("检索中",function(){
                    $.ajax({
                        url: ROOT_HOST + '/tool/zhwikiQuery/' + that.searchContent + '/'+ '0',
                        type: 'GET',
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        success:  (data) => {
                            that.searchResults = data.data
                            that.showFlag = new Array(that.searchResults.length)
                            $(".result_item").siblings(".result_item").removeClass("active")
                        },
                        error: (xhr, error) => {
                            alert(error)
                        }
                    })
                });
                loadding.start()
            },
            extend:function (e,index) {
                if ($(".result_item:nth-child("+(index+1)+")").hasClass("active"))
                {
                    $(".result_item:nth-child("+(index+1)+")").removeClass("active")
                }else {
                    $(".result_item:nth-child("+(index+1)+")").siblings(".result_item").removeClass("active")
                    $(".result_item:nth-child("+(index+1)+")").addClass("active")
                }
            }
        }
    }
</script>

<style scoped>
    #result_board{
        padding: 30px;
        text-align: left;
    }
    .result_item{
            padding: 10px 20px;
    background: white;
    box-shadow: 0px 0px 10px -5px rgba(0,0,0,.2);
    border-radius: 1em;
    margin-bottom: 10px;
        border: 1px solid #ddd;
    }
    .result_item .title{
        height: 40px;
    line-height: 40px;
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
    }
    .result_item .content{
            font-size: 12px;
    overflow: hidden;
        max-width: none;
    line-height: 20px;
    display: -webkit-box;
    text-align: justify;
    -webkit-line-clamp: 3;
    white-space: pre-line;
    -webkit-box-orient: vertical;
    }
    .child_item{
        display: none;
    }
    .result_item.active .child_item{
        display: block;
    }
    .result_item.active .content{
        -webkit-line-clamp: unset;
        overflow: unset;
    }
    .result_item.active .child_item{
            padding: 10px 15px;
    background: rgba(0,0,0,.03);
    border-radius: 1em;
    margin-bottom: 10px;
    }
    .result_item.active .child_item .child_title{
        font-size: 14px;
    line-height: 20px;
    font-weight: bold;
    }
    .result_item.active .child_item .child_content{
        font-size: 12px;
    white-space: pre-line;
    color: #666;
    margin-top: 6px;
    }
</style>
