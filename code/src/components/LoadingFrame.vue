<template>
    <div id="mainwindow">
        <div id="loading">
            <div id="loading-center"  v-loading="loading">
                <div id="loading-center-absolute">
        <!--            <div class="object" id="object_four"></div>-->
        <!--            <div class="object" id="object_three"></div>-->
        <!--             <div class="object" id="object_two"></div>-->
        <!--            <div class="object" id="object_one"></div>-->
                </div>
                <div style="position: absolute;bottom: 20px;width: 100%;text-align: center;color: black;font-weight: 900;" id="log">Loading ...</div>
            </div>
        </div>
        <iframe id="main_board" :src="src"/>
    </div>
</template>

<script>
import "../index"
    export default {
        data(){
            return{
                src:"",
                loading:true,
            }
        },
        mounted:function(){
            this.src=MAIN_PAGE_PATH;
            var that = this;
            var iframe = document.getElementById("main_board");
            if (iframe.attachEvent){
            iframe.attachEvent("onload", function(){
                document.getElementById("log").innerText = "Loaded!";
                that.loading=false;
                setTimeout(function(){
                    document.getElementById("loading").style.transform = "scale(.3)";
                    document.getElementById("loading").style.borderRadius = "40px";
                    document.getElementById("loading").style.top = "100%";
                    document.getElementById("main_board").style.borderRadius = "0px";
                    document.getElementById("main_board").style.top = "0px";
                    document.getElementById("main_board").style.transform = "scale(1)";
                    // setTimeout(function(){document.getElementById("loading").outerHTML = "";},600)
                },500)
            });
            } else {
            iframe.onload = function(){
                document.getElementById("log").innerText = "Loaded!";
                that.loading=false;
                setTimeout(function(){
                    document.getElementById("loading").style.transform = "scale(.3)";
                    document.getElementById("loading").style.borderRadius = "40px";
                    document.getElementById("loading").style.top = "100%";
                    document.getElementById("main_board").style.borderRadius = "0px";
                    document.getElementById("main_board").style.top = "0px";
                    document.getElementById("main_board").style.transform = "scale(1)";
                // setTimeout(function(){document.getElementById("loading").outerHTML = "";},600)
                },500)
            };
            }
            
            document.getElementById("mainwindow").appendChild(iframe);
        },
        methods: {


        }
    }
</script>

<style scoped>
#mainwindow{
    overflow: hidden;
    background: #333;
    /* border-radius: 10px; */
    position: absolute;
    height: 100%;
    width: 100%;
    box-shadow: 0px 5px 10px -2px rgba(0,0,0,.3);
}   
#main_board{
    height: 
    100%;
    width: 100%;
    position: absolute;top:100px;left:0;
    border:0px;
    transform: scale(.5);
    overflow:hidden;
    border-radius:100px;
    transition: cubic-bezier(0.25, 0.25, 0, 1) 1.5s;
}

#loading{
    background-color: #efefef;
    height: 100%;
    width: 100%;
    position: fixed;
    z-index: 1;
    margin-top: 0px;
    /* opacity: .1; */
    top: 0px;
    left:0px;
    transition:cubic-bezier(0.25, 0.25, 0, 1) 1.5s;
}
#loading-center{
    width: 100%;
    height: 100%;
    position: relative;
    }
#loading-center-absolute {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 200px;
    width: 200px;
    margin-top: -100px;
    margin-left: -100px;
    /* background-image:url("./source/04.gif"); */
    background-position: center;
    background-size: 100% auto;
    background-repeat: no-repeat;
}
.object{

    -moz-border-radius: 50% 50% 50% 50%;
    -webkit-border-radius: 50% 50% 50% 50%;
    border-radius: 50% 50% 50% 50%;
    position: absolute;
    border-top: 5px solid #FFF;
    border-bottom: 5px solid transparent;
    border-left:  5px solid #FFF;
    border-right: 5px solid transparent;
    
    -webkit-animation: animate 2s infinite;
    animation: animate 2s infinite; 

    }
#object_one{
    left: 75px;
    top: 75px;
    width: 50px;
    height: 50px;
    }
                            
#object_two{
    left: 65px;
    top: 65px;
    width: 70px;
    height: 70px;
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
    }
        
#object_three{
    left: 55px;
    top: 55px;
    width: 90px;
    height: 90px;
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
    }
#object_four{
    left: 45px;
    top: 45px;
    width: 110px;
    height: 110px;
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
    
    } 
   @-webkit-keyframes animate {
     

    50% {

        -ms-transform: rotate(360deg) scale(0.8); 
        -webkit-transform: rotate(360deg) scale(0.8); 
        transform: rotate(360deg) scale(0.8); 
      }
    }

    @keyframes animate {
        
    50% {

        -ms-transform: rotate(360deg) scale(0.8); 
        -webkit-transform: rotate(360deg) scale(0.8); 
        transform: rotate(360deg) scale(0.8); 
      } 
    }
</style>