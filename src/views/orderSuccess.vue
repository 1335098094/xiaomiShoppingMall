<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span slot="bread">orderConfirm</span>
      </nav-bread>
      <div>
        <div class="container">
          <div class="page-title-normal">
            <h2 class="page-title-h2"><span>check out</span></h2>
          </div>
          <!-- 进度条 -->
          <div class="check-step">
            <ul>
              <li class="cur"><span>Confirm</span> address</li>
              <li class="cur"><span>View your</span> order</li>
              <li class="cur"><span>Make</span> payment</li>
              <li class="cur"><span>Order</span> confirmation</li>
            </ul>
          </div>

          <div class="order-create">
            <div class="order-create-pic"><img src="static/ok-2.png" alt=""></div>
            <div class="order-create-main">
              <h3>恭喜你 <br>下单成功</h3>
              <p>
                <span>订单编号：{{orderId}}</span>
                <span>支付总额：{{orderTotal | currency('￥')}}</span>
              </p>
              <div class="order-create-btn-wrap">
                <div class="btn-l-wrap">
                  <router-link href="javascript:;" class="btn btn--m" to="/cart">购物车</router-link>
                </div>
                <div class="btn-r-wrap">
                  <router-link href="javascript:;" class="btn btn--m" to="/">商品首页</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav-footer> </nav-footer>
    </div>
</template>

<script>
  import '@/assets/css/base.css'
  import '@/assets/css/checkout.css'
  import NavHeader from '@/components/Header.vue'
  import NavFooter from '@/components/Footer.vue'
  import NavBread from '@/components/Bread.vue'
  import Model from '@/components/Model.vue'
  import axios from 'axios'
    export default {
        name: "orderSuccess",
        components:{
          NavHeader,
          NavFooter,
          NavBread,
          Model
        },
        data(){
            return{
              orderList:[],
              orderId:'',
              orderTotal:0
            }
        },
      created(){
        if(JSON.stringify(this.$route.params)!=='{}'){
          this.$cookies.set('orderId',this.$route.params.orderId);
          this.orderId=this.$route.params.orderId
        }else{
          this.orderId= this.$cookies.get('orderId')
        }
        this.initData()
      },
      methods:{
        initData(){
          axios.post('/api-dev/users/getOrder',{
            orderId:this.orderId
          }).then((res)=>{
            if(res.data.status=='0'){
              this.orderId=res.data.result[0].orderId;
              this.orderTotal=res.data.result[0].orderTotal;
            }else{
              this.$alert('提示',res.data.msg)
            }
          }).catch((err)=>{
            console.log(err)
          })
        }
      }
    }
</script>

<style scoped>

</style>
