<template>
   <div> 
      <nav-header></nav-header>
      <nav-bread>
      <span slot='bread'>Goods</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!--filter-->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}"  @click="priceChecked='all'">All</a></dd>
                <dd v-for="(price,index) in priceFilter " v-bind:key='index'>
                  <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!--search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList" v-bind:key='index'>
                    <div class="pic">
                      <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">${{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">ADD TO BASKET</a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
               <!--scroll -->
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
loadmore...
</div>
            </div>
          </div>
        </div>
         <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
          <p slot="message">
             请先登录,否则无法加入到购物车中!
          </p>
          <div slot="btnGroup">
              <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
          </div>
      </modal>
      <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>1 item added to basket</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">Shopping</a>
          <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">Checkout</router-link>
        </div>
      </modal>
      </div>
     <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
     <nav-footer/> 
    </div>
</template>
<style>
</style>
<script>
    import './../assets/css/base.css'
    import './../assets/css/product.css'
    import NavHeader from '@/components/NavHeader.vue'
    import NavFooter from '@/components/NavFooter.vue'
    import NavBread from '@/components/NavBread.vue'
    import Modal from '@/components/Modal.vue'
    import axios from 'axios'
    export default{
        data(){
            return {
            goodsList:[],
            sortFlag:true,
            page:1,
            pageSize:15,
            busy:true,
            loading:false,
            mdShow:false,
            mdShowCart:false,
            priceFilter:[
              {
                startPrice:'0.00',
                endPrice:'100.00'
              },{
                startPrice:'100.00',
                endPrice:'500.00'
              },
              {
                startPrice:'500.00',
                endPrice:'1000.00'
              },{
                startPrice:'1000.00',
                endPrice:'2000.00'
              }
            ],
            priceChecked:'all',
            filterBy:false,
            overLayFlag:false
            }
        },
        components:{
          NavHeader,
          NavFooter,
          NavBread,
          Modal
       
        },
        
         mounted:
         function(){
         this.getGoodsList();
        },
        methods:{
          getGoodsList(flag){
          var param={
            page:this.page,
            pageSize:this.pageSize,
            sort:this.sortFlag?1:-1,
            priceLevel:this.priceChecked
          }
          axios.get('/goods/list',{params:param}).then((result)=>{
          let res=result.data;
          if(res.status=='0'){
            if(flag){
             this.goodsList=this.goodsList.concat(res.result.list);
             if(res.result.count==0){
               this.busy=true;
             }else{
               this.busy=false;
             }
            }else{
             this.goodsList=res.result.list;
             this.busy=false;
            }
          }else{
            this.goodsList=[];
          }
           })
          },
          sortGoods(){   //实现排序功能
          this.sortFlag=! this.sortFlag;
          this.page=1;
          this.getGoodsList()
          },
          loadMore(){
           this.busy = true;
                setTimeout(() => {
                  this.page++;
                  this.getGoodsList(true);
                }, 500);
          },
          addCart(productId){
          axios.post('/goods/addCart',{
            productId:productId
          }).then((res)=>{
          if(res.status==0){
            this.mdShow=true;
          }else{
            this.mdShowCart=true;
          }
          });
          },
          closeModal(){
            this.mdShow=false;
            //this.mdShowCart=false;
          },
         
          showFilterPop(){
            this.filterBy=true;
            this.overLayFlag=true;
          },
          //筛选价格功能
          setPriceFilter(index){
          this.priceChecked=index;
          this.page=1;
          this.getGoodsList();
          },
          closePop(){
            this.filterBy=false;
            this.overLayFlag=false;
          },
        }

    }
</script>