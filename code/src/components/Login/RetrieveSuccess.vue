<template>
    <div>
        <el-container class="main_board">
            <el-card style="width:100%;background-color: rgba(242, 242, 242, 1);">
                <el-row type="flex" align="middle" justify="center" class="word1">
                    恭喜找回成功
                </el-row>
                <el-row  type="flex" align="top" justify="center" class="word2">
                    3秒后将自动跳转到登录页面
                </el-row>
                <el-row type="flex" align="bottom" justify="end" class="word3" @click="tologin">
                    若没有自动跳转，请点击此处
                </el-row>
            </el-card>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "RetrieveSuccess",
        data(){
            return{

            }
        },
        mounted:function(){
            setTimeout( ()=> {
                this.$router.push("../login");
            },3000);
        },
        methods: {
            tologin:function () {
                this.$router.push("../login");
            }
        }
    }
</script>

<style scoped>
    .main_board{
        position: relative;
        margin: 160px auto;
        width: 500px;
        font-size:13px;
    }
    .word1{
        height: 180px;
        font-size: 32px;
        font-weight: 700;
    }
    .word2{
        height: 60px;
        font-weight:700;
        text-align: center;
        font-size:18px;
    }
    .word3{
        color: #169BD5;
        font-size: 13px;
    }
</style>
