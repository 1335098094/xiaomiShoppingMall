<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span slot="bread">orderConfirm</span>
    </nav-bread>
    <div class="container">
      <div class="checkout-order">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- process step -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li><span>Make</span> payment</li>
            <li><span>Order</span> confirmation</li>
          </ul>
        </div>

        <!-- order list -->
        <div class="page-title-normal checkout-title">
          <h2><span>Order content</span></h2>
        </div>
        <div class="item-list-wrap confirm-item-list-wrap">
          <div class="cart-item order-item">
            <div class="cart-item-head">
              <ul>
                <li>Order contents</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="(item,index) in orderListFilter" :key="index" >
                <div class="cart-tab-1">
                  <div class="cart-item-pic">
                    <img :src="'static/'+item.productImage" alt="">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>

                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice | currency('￥')}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self">
                      <div class="select-self-area">
                        <span class="select-ipt">×{{item.productNum}}</span>
                      </div>
                    </div>
                    <div class="item-stock item-stock-no">库存充足</div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{item.salePrice*item.productNum | currency('￥')}}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Price count -->
        <div class="price-count-wrap">
          <div class="price-count">
            <ul>
              <li>
                <span>商品总价:</span>
                <span>{{goodsMoney | currency('￥')}}</span>
              </li>
              <li>
                <span>邮费:</span>
                <span>{{ship | currency('￥')}}</span>
              </li>
              <li>
                <span>折扣价:</span>
                <span>{{discount | currency('￥')}}</span>
              </li>
              <li class="order-total-price">
                <span>总价:</span>
                <span>{{allMoney | currency('￥')}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="order-foot-wrap">
          <div class="prev-btn-wrap" @click="goBack()">
            <button class="btn btn--m" >Previous</button>
          </div>
          <div class="next-btn-wrap">
            <button class="btn btn--m btn--red" @click="goPay()">去支付</button>
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
      name: "orderConfirm",
      components:{
        NavHeader,
        NavFooter,
        NavBread,
        Model
      },
      data(){
          return{
            orderList:[],
            goodsMoney:null,
            ship:0,
            discount:0,
            allMoney:null
          }
      },
      computed:{
        orderListFilter:{
          get(){
            return this.orderList.filter(item=>item.checked=='1')
          }
        },
      },
      created(){
        this.initData()
      },
      methods:{
        //初始化数据
        initData(){
          axios.get('/api-dev/users/cart').then((res)=>{
            this.orderList=res.data.result;
            this.orderList.forEach((item)=>{
              if(item.checked=='1'){
                this.goodsMoney+=(item.salePrice*item.productNum)
              }
            })
            this.allMoney=this.goodsMoney-this.ship-this.discount;
          }).catch((err)=>{
            console.log(err)
          })
        },
        //返回
        goBack(){
          this.$router.go(-1)
        },
        goPay(){
          var data={
            'addressId':this.$route.query.addressId,
            'orderList':this.orderListFilter,
            'allMoney':this.allMoney
          };
          axios.post('/api-dev/users/addOrder',{data}).then((res)=>{
              if(res.data.status=='0'){
                var ids=[];
                var delNum=0;
                this.orderListFilter.forEach(item=>{
                  ids.push(item.productId);
                  delNum=parseInt(delNum)+parseInt(item.productNum)
                });
                //删除购物车选择的数据
                axios.post('/api-dev/users/delCart',{
                  productId:ids
                }).then((res)=>{
                  this.$store.commit('SET_UPDATECOUNT',-delNum);
                  console.log(res)
                }).catch((err)=>{
                  console.log(err)
                });

                this.$router.push({ name: 'orderSuccess', params: { orderId:res.data.result.orderId }});
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

<style>

</style>
