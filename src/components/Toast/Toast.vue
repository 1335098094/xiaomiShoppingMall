<template>
  <div class="alert_mask" v-show="isShow">
    <div class="alert_content">
      <div class="alert_title">
        {{title}}<span class="alert_title_span" @click="close()">X</span>
      </div>
      <div class="alert_main">
        <img v-show="imgs" class="imgshow" src="static/ok.png" style="width:40px;vertical-align: middle">{{content}}
      </div>
      <div class="alert_footer">
        <button type='button' class="alert_button" id="alertbutton">{{cancelButtonText}}</button>
        <button type='button' class="alert_button" id="alertbutton1">{{confirmButtonText}}</button>
      </div>
    </div>
  </div>

  <!--<div class="toast" v-if="isShow">-->
    <!--<div class="toast-div">-->
        <!--{{text}}-->
    <!--</div>-->
  <!--</div>-->

</template>

<script>
    export default {
      data(){
        return{
          title:'内容',
          content:'这是一段内容',
          confirmButtonText:'确定',
          cancelButtonText: '取消',
          isShow:true,
          imgs:true
        }
      },
      methods:{
        close(){
          this.isShow=false
        }
      }
    }
</script>

<style>
  .alert_mask{
    position: fixed;
    top: 0px;
    left:0px;
    right: 0px;
    bottom: 0px;
    background: rgba(0,0,0,.4);
    text-align: center;
    z-index: 2003;
  }
  .alert_mask:after {
    content: "";
    display: inline-block;
    height: 100%;
    width: 0;
    vertical-align: middle;
  }
  .alert_content{
    display: inline-block;
    width: 420px;
    padding-bottom: 10px;
    vertical-align: middle;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    font-size: 18px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    text-align: left;
    overflow: hidden;
    backface-visibility: hidden;
  }
  .alert_title{
    position: relative;
    padding: 15px;
    padding-bottom: 10px;
  }
  .alert_main{
    position: relative;
    padding: 10px 15px;
    color: #606266;
    font-size: 14px;
  }
  .alert_footer{
    padding: 5px 15px 0;
    text-align: right;
  }
  .alert_button{
    border:1px solid #d1434a;
    color: #d1434a;
    /*background-color: #409eff;*/
    /*border-color: #409eff;*/
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
    cursor: pointer;
  }
  .alert_title_span{
    float: right;
    color: #999;
    cursor: pointer;
  }
  .imgshow{
    display: none;
  }
  @media only screen and (max-width: 767px) {
    .alert_title{
      display: none;
    }
    .alert_main{
      margin-top: 20px;
      text-align: center;
    }
    .alert_content{
      width: auto;
    }
    .alert_button{
      margin: 0px 5px;
      margin-top: 10px;
    }
    .imgshow{
      display: inline-block;
    }
  }

  /*.toast{*/
    /*top:50%;*/
    /*position: fixed;*/
    /*left: 50%;*/
    /*transform: translate(-50%, 0);*/
    /*margin-top: 1rem;*/
    /*background: #000000;*/
    /*color: #FFFFFF;*/
    /*padding: 0 0.2rem;*/
    /*border-radius: 0.2rem;*/
  /*}*/
</style>
