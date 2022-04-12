<template>
    <div>
        <el-container class="main_board" style='background:transparent;'>
            <el-card style="width:100%;background-color: rgba(242, 242, 242, 1);">
                <el-header class="title">登录</el-header>
                <el-container>
                    <el-card style="width:100%;background: rgba(0, 0, 0, 0.05)">
                        <el-form :model="form" :rules="rules" ref="form">
                            <el-form-item label="用户名" prop="username">
                                <el-input placeholder="请输入用户名" v-model="form.username" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input placeholder="请输入密码" v-model="form.password" show-password clearable></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-checkbox size="small" v-model="if_cookie">七天内自动登录</el-checkbox>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </el-container>
                <el-footer height="100px">
                    <el-button type="primary" size="small" class="main_button" @click="login">登录</el-button>
                    <el-row type="flex" justify="end">
                            <el-button-group>
                                <el-button size="mini" class="button" @click="regist">注册</el-button>
                                <el-button size="mini" class="button" @click="forget">忘记密码</el-button>
                            </el-button-group>
                    </el-row>
                </el-footer>
            </el-card>
        </el-container>
    </div>
</template>

<script>
    const $=require("jquery");
    import Vue from "vue";
    import VueCookies from 'vue-cookies';
    Vue.use(VueCookies);
    import CryptoJS from 'crypto-js';
    import {Message} from 'element-ui'
    const validateUsername = (rule, value, callback) => {
        var re =  /^[0-9a-z_A-Z]*$/g;
        if (!re.test(value)) {
            callback(new Error('用户名不符合规范'));
        }  else {
            callback();
        }
    };
    const validatePass = (rule, value, callback) => {
        var re =  /^[0-9a-z_A-Z]*$/g;
        if (!re.test(value)) {
            callback(new Error('密码不符合规范'));
        }  else {
            callback();
        }
    };
    export default {
        name:"Login",
        data(){
            return{
                form:{
                    username:"",
                    password:"",
                },
                if_cookie:false,
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'change' },
                        { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' },
                        { validator: validateUsername, trigger: 'change' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'change' },
                        { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' },
                        { validator: validatePass, trigger: 'change' }
                    ]
                }
            }

        },
        mounted:function(){
            try {
                this.form.username = this.$cookies.get('username')
                this.form.password = this.$cookies.get('password');
                if (this.form.username!=null && this.form.username!=null)
                    this.login();
            }catch (e) {
            }
        },
        methods:{
            login:function () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        var that=this;
                        $.ajax({
                            url:ROOT_HOST+"/user/login",
                            type:'POST',
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            data:JSON.stringify({"username":this.form.username,"password":CryptoJS.MD5(this.form.password).toString()}),
                            success : function(returndata){
                                if(that.if_cookie)
                                {
                                    that.$cookies.set('username',that.form.username,"7d");
                                    that.$cookies.set('password',that.form.password,"7d");
                                }
                                that.$cookies.set('username',that.form.username,"7d");
                                sessionStorage.setItem("token",returndata.token);
                                that.$router.push("/board");
                            },
                            error : function(xhr){
                                if (xhr.status=='401')
                                    Message.error('用户名或密码错误');
                                else
                                    Message.error('网络错误')
                            }
                        });
                    } else {

                    }
                });
            },
            forget: function () {
                this.$router.push("retrieve/first");
            },
            regist:function () {
                this.$router.push("register");
            }
        },
    }
</script>

<style scoped>
    ::-webkit-input-placeholder {
        color: black;
        font-size: 13px;
    }
    .main_board{
        position: relative;
        margin: 110px auto;
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
