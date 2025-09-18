<script setup>
import { nextTick, onMounted, ref } from 'vue'
import userStore from '@/stores/modules/user'
let userInfo = userStore().user

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

let cesiumViewRef = ref(null)
let cesiumView = ref(null)

const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const distance = checkLocation(position)
          resolve(position)

          // if (distance < 100) {
          //   console.log('打卡成功')
          //   let data = {
          //     userId: userInfo.id,
          //     takeinTime: new Date(),
          //   }
          //   await takein(data)
          // }
        },
        (error) => {
          console.error('获取位置失败：', error.message)
          reject('获取定位失败')
        },
        {
          enableHighAccuracy: true, // 启用高精度定位
          timeout: 10000, // 超时时间10秒
          maximumAge: 3000, // 接受3秒内的缓存位置
        },
      )
    } else {
      reject('获取定位失败')
    }
  })
}

// 将cesium定位到当前位置
const flyToCurrentLocation = async () => {
  try {
    const position = await getLocation()
    if (cesiumViewRef.value) {
      cesiumViewRef.value.flyTo(position)
    }
  } catch (error) {
    console.error('定位失败：', error.message)
  }
}

flyToCurrentLocation()
</script>
<template>
  <div class="cesiumView" ref="cesiumView">
    <CesiumView ref="cesiumViewRef" />
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
