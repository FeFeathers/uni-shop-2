<template>
  <view>
    <!-- 轮播图   -->
    <!-- :circular:true  衔接滚动 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <!-- 实现点击跳转（用 navigator）并 传递id参数 -->
        <navigator  class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <image :src="item.image_src" class="nav-img"></image>
       </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航 -->
    <view class="nav-list">
       <view class="nav-item" v-for="(item,index) in navList" :key="index" @click="navClickHandler(item)">
          <image :src="item.image_src" class="nav-img"></image>
       </view>  
    </view>
   <!-- 楼层区域 -->
   <!-- 楼层容器 -->
   <view class="floor-list">
     <!-- 每个楼层的 item 项 -->
     <view class="floor-item" v-for="(item,index) in floorList" :key="index">
       <!-- 楼层标题 -->
       <image :src="item.floor_title.image_src" class="floor-title"></image>
       <!-- 楼层图片 -->
       <view class="floor-img-box">
         <!-- 左侧大图片盒子(实现点击跳转，需要将 view 改为 navigator) -->
         <navigator class="left-img-box" :url="item.product_list[0].url">
           <!-- mode属性：设置图片或视频的裁剪、缩放、填充
                         widthFix  宽度不变，高度自适应-->
           <image :src="item.product_list[0].image_src" :style="{width:item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
         </navigator>
         <!-- 右侧 图片盒子 -->
         <view class="right-img-box">
           <!-- 去掉第一张图片后的图片 -->
           <navigator class="right-img-item" v-for="(item2,index2) in item.product_list" :key="index2" v-if="index2 !==0" :url="item2.url">
             <image :src="item2.image_src" :style="{width:item2.image_width+'rpx'}" mode="widthFix"></image>
           </navigator>
         </view>
       </view>
     </view>
   </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 轮播图数据列表
        swiperList:[],
        // 分类导航数据列表
        navList:[],
        // 楼层数据
        floorList:[],
      };
    },
    onLoad() {
      // 调用 获取轮播图数据 的方法
      this.getSwiperList()
      // 调用 获取分类导航数据 的方法
      this.getNavList()
      // 调用 获取楼层数据 的方法
      this.getFloorList()
    },
    methods:{
      // 定义 获取轮播图数据 方法
      async getSwiperList(){
        const {data:res} = await uni.$http.get('/api/public/v1/home/swiperdata')
        console.log(res)
        // 请求失败
        if(res.meta.status !==200)
        {
          // 直接调用全局封装的方法
          return uni.$showMsg()
          // return uni.showToast({
          //   title:'数据请求失败！',
          //   duration: 1500,
          //   icon:'none'
          // })
        }
        this.swiperList = res.message
      },
      // 定义 获取分类导航数据 方法
      async getNavList(){
         const { data: res } = await uni.$http.get('/api/public/v1/home/catitems')
         // const { data: res } = await uni.$http.get('/api/public/v1/home/catitems')
         console.log("getNavList")
         console.log(res)
         if(res.meta.status !== 200){
           return uni.$showMsg()
         }
         this.navList = res.message
      },
      // nav的点击事件
      navClickHandler(item){
        console.log("点击了分类导航")
        console.log(item)
        if(item.name === '分类'){
          uni.switchTab({
            url:'/pages/cate/cate'
          })
        }
      },
      // 定义 获取楼层数据 方法
      async getFloorList(){
        const { data:res } =await uni.$http.get('/api/public/v1/home/floordata')
        console.log("获取楼层数据")
        if(res.meta.status !== 200){
          return uni.$showMsg()
        }
        // 拿到数据后，先通过双层 forEach 循环，处理 URL 地址
        // 因为此地 后端提供的接口中url路径出错，所以 创建一个自定义的 url 属性，并加上正确的地址
        res.message.forEach(floor =>{
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        // 然后赋值
        this.floorList = res.message
      }
      
    },
  }
</script>

<style lang="scss">
swiper{
  height: 330rpx;
  .swiper-item,
  image{
    height: 100%;
    width: 100%;
  }
}

.nav-list{
  display: flex;
  justify-content: space-around;
  margin: 30rpx 0;
  .nav-img{
    width: 128rpx;
    height: 140rpx;
  }
}

.floor-img-box{
  display: flex;
  padding-left: 10rpx;
}
.floor-title{
  width: 100%;
  height: 60rpx;
}
.right-img-box{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
