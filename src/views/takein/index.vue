<script setup>
import MapView from '@/components/mapView/index.vue'
import { ElMessage } from 'element-plus'
import { onUnmounted, ref } from 'vue'
import userStore from '@/stores/modules/user'
const user = userStore().user

// let location = [103.9969, 30.7155]
let location = [104.10196, 30.7112]

let AMapObj = null
let mapObj = null
let geolocation = null
let locationInterval = null
let accuracy = null

let position = null
const getLocation = () => {
  if (!mapObj || !AMapObj) {
    ElMessage.error('地图未初始化')
    return
  }

  // 清除之前的定时器
  if (locationInterval) {
    clearInterval(locationInterval)
    locationInterval = null
  }

  const options = {
    showButton: false, // 隐藏默认定位按钮，我们自己控制
    showMarker: true,
    markerOptions: {
      offset: new AMapObj.Pixel(-18, -36),
      content:
        '<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>',
    },
    showCircle: true,
    circleOptions: {
      strokeColor: '#0093FF',
      noSelect: true,
      strokeOpacity: 0.5,
      strokeWeight: 1,
      fillColor: '#02B0FF',
      fillOpacity: 0.25,
    },
  }

  // 初始化定位控件（只创建一次）
  if (!geolocation) {
    AMapObj.plugin(['AMap.Geolocation'], function () {
      geolocation = new AMapObj.Geolocation(options)
      mapObj.addControl(geolocation)
      // 启动定时定位
      startLocationInterval()
    })
  } else {
    // 如果已存在，直接启动定时定位
    startLocationInterval()
  }
}

// 启动定时定位
const startLocationInterval = () => {
  // 先立即获取一次位置
  getCurrentLocation()

  // 然后每3秒获取一次
  locationInterval = setInterval(() => {
    getCurrentLocation()
  }, 3000)
}

// 获取当前位置
const getCurrentLocation = () => {
  if (!geolocation) return

  geolocation.getCurrentPosition((status, result) => {
    if (status === 'complete') {
      position = result.position
      accuracy = result.accuracy
    } else {
      console.log('定位失败:', result.message)
    }
  })
}

// 停止定时定位
const stopLocationInterval = () => {
  if (locationInterval) {
    clearInterval(locationInterval)
    locationInterval = null
  }
}

// 组件卸载时记得清理
const cleanup = () => {
  stopLocationInterval()
  if (geolocation && mapObj) {
    mapObj.removeControl(geolocation)
    geolocation = null
  }
}

const getDetailedAddress = (latLng) => {
  if (!AMapObj) return

  return new Promise((resolve, reject) => {
    AMapObj.plugin(['AMap.Geocoder'], function () {
      var geocoder = new AMapObj.Geocoder({
        radius: 1000, // 搜索范围半径
        extensions: 'all', // 返回详细信息
      })

      geocoder.getAddress(latLng, function (status, result) {
        if (status === 'complete' && result.regeocode) {
          resolve(result.regeocode.formattedAddress)
        } else {
          reject(new Error('根据经纬度查询地址失败'))
        }
      })
    })
  })
}

import { takein, getTakeinList } from '@/api/takein'
const addTakein = async () => {
  if (position) {
    console.log(position);

    let distance = AMapObj.GeometryUtil.distance(location, [position.lng, position.lat])
    try {
      let address = await getDetailedAddress([position.lng, position.lat])
      if (distance < accuracy) {
        let data = {
          userId: user.id,
          takeinTime: new Date(),
          address,
        }
        await takein(data)
        getList()
        ElMessage.success('打卡成功')
      } else {
        ElMessage.error('距离公司距离太远，请靠近再打卡')
      }
    } catch (error) {
      ElMessage.error(error.message)
    }
    //   let data = {
    //     userId: user.id,
    //     takeinTime: new Date(),
    //   }
    //   await takein(data)
    //   ElMessage.success('打卡成功')
    //   console.log(distance)
    // }
  }
}
const getAMap = (AMap, map) => {
  AMapObj = AMap
  mapObj = map
  getLocation()
}

let list = ref([])
const getList = async () => {
  let data = {
    userId: user.id,
  }
  let res = await getTakeinList(data)
  console.log(res)
  list.value = res.data
}
getList()
onUnmounted(() => {
  cleanup()
})
</script>
<template>
  <div class="mapViewRef" ref="cesiumView">
    <MapView ref="mapViewRef" @sendAMap="getAMap" />
  </div>
  <div class="takeinButton" @click="addTakein">打卡</div>

  <div class="takeinList">
    <el-table :data="list" border style="width: 100%">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="takeinTime" label="打卡时间" align="center" />
      <el-table-column prop="address" label="地址" align="center" />
    </el-table>
  </div>
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
