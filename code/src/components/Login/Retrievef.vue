<template>
    <div>
        <el-container class="main_board">
            <el-card style="width:100%;background-color: rgba(242, 242, 242, 1);">
                <el-header class="title">忘记密码</el-header>
                <el-steps :active="0" finish-status="success" align-center>
                    <el-step title="Step1:基本信息"></el-step>
                    <el-step title="Step2:新密码"></el-step>
                </el-steps>
                <el-container>
                    <el-card style="width:100%;background: rgba(0, 0, 0, 0.05)">
                        <el-form :model="form" :rules="rules" ref="form">
                            <el-form-item label="用户名" prop="username">
                                <el-input placeholder="请输入用户名（6-12位不能包含特殊字符）" v-model="form.username" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱地址" prop="email">
                                <el-input placeholder="请输入邮箱地址" v-model="form.email" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="密码找回口令" prop="fkey">
                                <el-input placeholder="请输入密码找回口令（4-12个字母）" v-model="form.fkey" clearable></el-input>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </el-container>
                <el-footer height="75px">
                    <el-button type="primary" size="small" class="main_button" @click="next">下一步</el-button>
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
        name: "Retrievef",
        data(){
            const validateUsername = (rule, value, callback) => {
                var re =  /^[0-9a-z_A-Z]*$/g;
                if (!re.test(value)) {
                    callback(new Error('用户名不符合规范'));
                }  else {
                    callback();
                }
            };
            const validateEmail = (rule, value, callback) => {
                if (!this.emailCheck(this.form.email)) {
                    callback(new Error('邮箱不符合规范'));
                }  else {
                    callback();
                }
            };
            const validateFKey = (rule, value, callback) => {
                var re =  /^[0-9a-z_A-Z]*$/g;
                if (!re.test(value)) {
                    callback(new Error('找回口令不符合规范'));
                }  else {
                    callback();
                }
            };
            return{
                form:{
                    username:"",
                    email:"",
                    fkey:"",
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'change'},
                        {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change'},
                        {validator: validateUsername, trigger: 'change'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'change'},
                        {validator: validateEmail, trigger: 'change'}
                    ],
                    fkey: [
                        {required: true, message: '请输入用户名', trigger: 'change'},
                        {min: 4, max: 12, message: '长度在 4 到 12 个字符', trigger: 'change'},
                        {validator: validateFKey, trigger: 'change'}
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
            next:function () {
                var that=this;
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        $.ajax({
                            url: ROOT_HOST + "/user/retrievef",
                            type: 'POST',
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            data: JSON.stringify({
                                "username": that.form.username,
                                "email": that.form.email,
                                "s_code": CryptoJS.MD5(that.form.fkey).toString()
                            }),
                            success: function () {
                                that.$router.push("second");
                            },
                            error: function (xhr) {
                                if(xhr.status=='401'){
                                    Message.error("用户名不存在或邮箱、找回码错误")
                                }
                                else{
                                    Message.error("网络错误")
                                }
                            }
                        });
                    }
                })
            },
            emailCheck:function(emailAddr)
            {
                if((emailAddr == null) || (emailAddr.length < 2)) return false ;
                var aPos = emailAddr.indexOf("@" ,1) ;
                if(aPos < 0)
                {
                    return false ;
                }
                if(emailAddr.indexOf("." ,aPos+2) < 0)
                {
                    return false ;
                }
                return true ;
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
