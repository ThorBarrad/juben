<template>
    <div>
        <el-container class="main_board">
            <el-card style="width:100%;background-color: rgba(242, 242, 242, 1);">
                <el-header class="title">忘记密码</el-header>
                <el-steps :active="1" finish-status="success" align-center>
                    <el-step title="Step1:基本信息"></el-step>
                    <el-step title="Step2:新密码"></el-step>
                </el-steps>
                <el-container>
                    <el-card style="width:100%;background: rgba(0, 0, 0, 0.05)">
                        <el-form :model="form" :rules="rules" ref="form">
                            <el-form-item label="密码" prop="password">
                                <el-input placeholder="密码（6-12位字母、数字，不能包含特殊符号）" show-password v-model="form.password" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="重复密码" prop="rpassword">
                                <el-input placeholder="请重复输入密码" show-password v-model="form.rpassword" clearable></el-input>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </el-container>
                <el-footer height="75px">
                    <el-button type="primary" size="small" class="main_button" @click="complete">完成</el-button>
                    <el-row type="flex" justify="end">
                        <el-button-group>
                            <el-button size="mini" class="button" @click="login">登录</el-button>
                            <el-button size="mini" class="button" @click="regist">注册</el-button>
                        </el-button-group>
                    </el-row>
                </el-footer>
            </el-card>
        </el-container>
    </div>
</template>

<script>
    const $=require("jquery");
    import {Message} from 'element-ui'
    import CryptoJS from 'crypto-js';

    export default {
        name: "Retrieves",
        data(){
            const validatePassword = (rule, value, callback) => {
                var re =  /^[0-9a-z_A-Z]*$/g;
                if (!re.test(value)) {
                    callback(new Error('密码不符合规范'));
                }  else {
                    callback();
                }
            };
            const validateRPassword = (rule, value, callback) => {
                var re =  /^[0-9a-z_A-Z]*$/g;
                if (!re.test(value)) {
                    callback(new Error('重复密码不符合规范'));
                }
                else if (value!=this.form.password){
                    callback(new Error('两次密码输入不一致'))
                }
                else {
                    callback();
                }
            };
            return{
                form:{
                    password:"",
                    rpassword:""
                },
                rules: {
                    password: [
                        {required: true, message: '请输入密码', trigger: 'change'},
                        {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change'},
                        {validator: validatePassword, trigger: 'change'}
                    ],
                    rpassword: [
                        {required: true, message: '请输入重复密码', trigger: 'change'},
                        {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change'},
                        {validator: validateRPassword, trigger: 'change'}
                    ],
                }
            }
        },
        mounted:function(){
        },
        methods: {
            login:function () {
                this.$router.push("../login");
            },
            regist:function () {
                this.$router.push("../register");
            },
            complete:function(){
                var that=this;
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        $.ajax({
                            url: ROOT_HOST + "/user/retrieves",
                            type: 'POST',
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            data: JSON.stringify({"password": CryptoJS.MD5(that.form.password).toString()}),
                            success: function () {
                                that.$router.push("success");
                            },
                            error: function (xhr) {
                                if(xhr.status=='401'){
                                    Message.error("找回出错，请重试")
                                }
                                else{
                                    Message.error("网络错误")
                                }
                            }
                        });
                    }
                })
            },
        }
    }
</script>

<style scoped>
    ::-webkit-input-placeholder {
        color: black;
        font-size: 13px;
    }
    .main_board{
        position: relative;
        margin: 60px auto;
        width: 500px;
        font-size:13px;
    }
    .title{
        font-weight:800;
        text-align: center;
        height:45px;
        line-height:45px;
        font-size: 18px;
    }
    .main_button{
        margin:20px auto;
        display: block;
        width:110px;
    }
    .button{
        border:none;
        background:none;
    }

</style>
