<!--
 * @Author: Wanko
 * @Date: 2023-04-27 17:39:09
 * @LastEditors: Wanko
 * @LastEditTime: 2024-07-16 17:26:10
 * @Description: 
-->
<template>
  <view class="bg-f8 h-screen overflow-hidden">
    <view class="m">
      <button class="bg-purple-light" @click="toRoute('/pages/index/two')">
        route('/pages/index/two')
      </button>
    </view>
    <view class="m">
      <button class="bg-purple-light" @click="toRoute1('/pages/index/two')">
        route.to('/pages/index/two')
      </button>
    </view>
    <view class="m">
      <button class="bg-purple-light" @click="toRoute2('/pages/index/three')">
        route.direct('/pages/index/three')
      </button>
    </view>
    <view class="m">
      <button class="bg-purple-light" @click="toRoute3('/pages/index/three')">
        route.launch('/pages/index/three')
      </button>
    </view>
    <view class="m">
      <button class="bg-purple-light" @click="toRoute4('/pages/index/four')">
        route('/pages/index/four', {event}) 监听事件
      </button>
      <button class="bg-purple-light" @click="toMini">
        打开微信小程序
      </button>
    </view>
  </view>
</template>
<script>
// import route from 'caring-route'
import route from '../../caring-route/src/index'

export default {
  methods: {
    toMini(){
      route.mini('wx87b638cc2075e9c1', 'pages/tabbar/components')
    },
    toRoute(url) {
      route({
        url
      })
      // route(url).then((_) => {
      //   console.log('跳转成功')
      // })
    },
    toRoute1(url) {
      route.to(url, {
        name: 'wanko',
        age: 25,
        hoby: {
          guitar: {
            level: 1
          }
        },
        arr: [1,2,3,4,5],
        arrObj: [{
          name:'wanko'
        }, 23, 'age']
      })
    },
    toRoute2(url) {
      route.direct(url)
    },
    toRoute3(url) {
      route.launch(url)
    },
    toRoute4(url) {
      route({
        type: 'navigateTo',
        url,
        data: {
          a: '333'
        },
        events: {
          onSuccess: (data) => {
            console.log('onSuccess', data)
          }
        }
      })
    }
  }
}
</script>
