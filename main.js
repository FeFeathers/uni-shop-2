
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'
// 挂载
uni.$http = $http

// 请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 挂载  请求拦截器
$http.beforeRequest = function(options){
  uni.showLoading({
    title:'数据加载中'
  })
}

// 挂载 响应拦截器
$http.afterRequest = function () {
  uni.hideLoading()
}

// 封装弹框的方法
uni.$showMsg = function(title  = '数据加载失败', duration = 1500){
  uni.showToast({
    title,
    duration,
    icon:'none'
  })
}

// 关闭生产环境提醒
Vue.config.productionTip = false

App.mpType = 'app'


const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif