<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span slot="bread">Goods</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">排序:</span>
            <a href="javascript:void(0)" @click="changeSort('up')" class="default " :class="{ 'cur':queryList.sort==1 }">默认升序</a>
            <a href="javascript:void(0)" @click="changeSort('down')" class="price" :class="{ 'cur':queryList.sort==-1 }">降序 <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterOpo()">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" :class="{'filterby-show':fliterBy}">
              <dl class="filter-price">
                <dt>价格:</dt>
                <dd>
                  <a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="allPrice()">All</a>
                </dd>
                <dd v-for="(pricefilter,index) in priceFilter" :key="index" >
                  <a href="javascript:void(0)" :class="{'cur':priceChecked==index}" @click="setPriceFilter(index)">{{pricefilter.startPrice}}-{{pricefilter.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList" :key="index">
                    <div class="pic">
                      <a href="#"><img v-lazy="'static/'+item.productImage" alt="" :key="item.productImage"></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price" style="text-align: center">{{item.salePrice | currency('￥')}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="100">
                  <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading"/>
                  <p v-show="loaded" style="font-size:16px;">没有更多数据了</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayflag" @click.stop="closePop"></div>

      <nav-footer> </nav-footer>
    </div>

</template>
<script>
  import '@/assets/css/base.css'
  import '@/assets/css/product.css'
  import '@/assets/css/login.css'
  import '@/assets/css/checkout.css'
  import NavHeader from '@/components/Header.vue'
  import NavFooter from '@/components/Footer.vue'
  import NavBread from '@/components/Bread.vue'
  import Model from '@/components/Model.vue'
  import axios from 'axios'
    export default{
        data(){
            return {
              goodsList:[],
              priceFilter:[
                {
                  startPrice:'0.00',
                  endPrice:'100.00'
                },
                {
                  startPrice:'100.00',
                  endPrice:'500.00'
                },
                {
                  startPrice:'500.00',
                  endPrice:'1000.00'
                },
                {
                  startPrice:'1000.00',
                  endPrice:'5000.00'
                }
              ],
              priceChecked:'all',
              fliterBy:false,//价格表
              overLayflag:false,//遮盖层
              busy:true,//加载
              loading:false,//加载动画
              loaded:false,//显示没有更多数据
              mdShow:false,
              mdShowCart:false,
              queryList:{
                page:1,
                pageSize:8,
                sort:1,
                startPrice:'all',
                endPrice:'all'
              }
            }
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread,
          Model
        },
        created(){
          this.initData()
        },
        mounted(){

        },
        methods: {
          //获取数据
          initData(flag) {
            this.loading = true;//显示加载
            axios.get('/api-dev/goods', {
              params: this.queryList
            }).then((res) => {
              this.loading = false;//关闭加载
              if (flag) {
                this.goodsList = this.goodsList.concat(res.data.result.list);
                if (res.data.result.count < this.queryList.pageSize) {
                  this.busy = true;
                  this.loaded = true
                } else {
                  this.busy = false
                }
              } else {
                this.goodsList = res.data.result.list;
                this.busy = false
              }
            }).catch((error) => {
              console.log(error)
            })
          },
          //所有的价格
          allPrice() {
            this.queryList.page = 1;
            this.queryList.startPrice = 'all';
            this.queryList.endPrice = 'all';
            this.initData();
          },
          //价格筛选
          setPriceFilter(index) {
            this.priceChecked = index;
            this.queryList.page = 1;
            this.queryList.startPrice = this.priceFilter[index].startPrice;
            this.queryList.endPrice = this.priceFilter[index].endPrice;
            this.initData();
            this.fliterBy = false;
            this.overLayflag = false
          },
          //价格弹窗
          showFilterOpo() {
            this.fliterBy = true;
            this.overLayflag = true
          },
          //关闭价格弹窗
          closePop() {
            this.fliterBy = false;
            this.overLayflag = false
          },
          //价格排序
          changeSort(sortBy) {
            this.queryList.page = 1;
            sortBy === 'down' ? (this.queryList.sort = -1) : (this.queryList.sort = 1);
            this.initData()
          },
          //上拉加载
          loadMore() {
            this.busy = true;
            setTimeout(() => {
              this.queryList.page++;
              this.initData(true)
            }, 1000);
          },
          //加入购物车
          addCart(item) {
            var data=item
            axios.post('/api-dev/goods/addCart',{
              data
            }).then((res)=>{
                if(res.data.status=='0'){
                  this.$toast('提示','加入购物车成功','去购物车','确定',true).then(()=>{
                    this.$router.push({ path: '/cart' })
                  }).catch(()=>{});
                  this.$store.commit('SET_UPDATECOUNT',1);
                  console.log(this.$store.state.user.cartCount);
                }else{
                  this.$alert('提示','暂未登录，请先登录')
                }
            }).catch((err)=>{
                  console.log(err)
            });
          }
        }
    }
</script>
