<template>
  <div>
  <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}">
    <div class="md-modal-inner">
      <div class="md-top">
        <button class="md-close" @click="close()">Close</button>
      </div>
      <div class="md-content">
        <div class="confirm-tips">
         <slot name="message"></slot>
        </div>
        <div class="login-wrap">
          <slot name="btns"></slot>
          <!--<a href="javascript:;" class="btn-login" @click="login">登  录</a>-->
        </div>
      </div>
    </div>
  </div>
  <div class="md-overlay" v-if="mdShow" @click="close()"></div>
  </div>
</template>

<script>
  import './../assets/css/login.css'
  export default {
    name:'model',
    props:['mdShow'],
    methods:{
      close(){
        console.log('进入方法');
        this.$emit("close");
      }
    }
  }
</script>

<style>

</style>
