<script setup>
import { ref } from 'vue'
import userStore from '@/stores/modules/user'
let userInfo = userStore().user

import CesiumView from '@/components/cesiumView/index.vue'

let location = ref({
  latitude: '30.7173',
  longitude: '104.0035',
})

// 计算当前位置相对location的距离
// 计算当前位置相对location的距离
const checkLocation = (position) => {
  const lat1 = location.value.latitude
  const lon1 = location.value.longitude
  const lat2 = position.coords.latitude
  const lon2 = position.coords.longitude
  const R = 6371 // 地球半径，单位为公里
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c * 1000 // 单位为公里
  return distance
}

import { takein } from '@/api/takein'

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('当前位置：', position.coords.latitude, position.coords.longitude)
        const distance = checkLocation(position)
        if (distance < 100) {
          console.log('打卡成功')
          let data = {
            userId: userInfo.id,
            takeinTime: new Date(),
          }
          await takein(data)
        }
      },
      (error) => {
        console.error('获取位置失败：', error.message)
      },
    )
  } else {
    console.error('浏览器不支持定位')
  }
}
</script>
<template>
  <div class="cesiumView">
    <CesiumView />
  </div>
  <el-button type="primary" @click="getLocation">获取当前定位</el-button>
</template>

<style lang="less">
@import './less/mobile.less';
@media (min-width: 1024px) {
  @import './less/desktop.less';
}
@media (min-width: 768px) {
  @import './less/tablet.less';
}
</style>
