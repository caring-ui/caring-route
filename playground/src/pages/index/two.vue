<!--
 * @Author: Wanko
 * @Date: 2023-04-27 17:39:09
 * @LastEditors: Wanko
 * @LastEditTime: 2026-01-12 15:03:36
 * @Description: 
-->
<template>
  <view class="bg-f8 h-screen overflow-hidden">
    <view class="m">
      <button class="bg-purple-light" @click="toRoute('pages/index/three')">
        route('pages/index/three')
      </button>
    </view>
    <view class="m">
      <button class="bg-purple-light" @click="back('pages/index/three')">
        route.back(),返回上一级
      </button>
    </view>
  </view>
</template>
<script>
import route from 'caring-route'

export default {
  onLoad(options) {
    console.log('🐛 ~ two.vue:28 ~ options 🐛:', options)
    const query = route.query(options)
    console.log('🐛 ~ two.vue:29 ~ query 🐛:', query)
  },
  methods: {
    toRoute(url) {
      route(url)
    },
    back() {
      route.back()
    }
  }
}
</script>
