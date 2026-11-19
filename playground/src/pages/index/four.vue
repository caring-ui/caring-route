<!--
 * @Author: Wanko
 * @Date: 2023-04-27 17:39:09
 * @LastEditors: Wanko
 * @LastEditTime: 2024-05-29 15:54:04
 * @Description: 
-->
<template>
  <view class="bg-f8 h-screen overflow-hidden">
    <view class="m">
      <button class="bg-purple-light">111</button>
    </view>
    <view class="m">
      <button class="bg-purple-light" @click="back1()">
        route.back(),返回上一级 并发送事件
      </button>
    </view>
  </view>
</template>
<script>
import route from 'caring-route'

export default {
  methods: {
    toRoute(url) {
      route(url)
    },
    back2() {
      route.back(2)
    },
    back1() {
      this.getOpenerEventChannel().emit('onSuccess', {
        data: 'data from home'
      })
      route.back(1)
    }
  }
}
</script>
