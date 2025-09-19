<script setup>
import { onMounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
let map = null

const emit = defineEmits(['sendAMap'])

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: 'c293411f67581ff755312d01c5031bdb', // 请替换为实际的安全密钥
  }
  AMapLoader.load({
    key: '3db40611c8d97e6665c430ba16a4aa5c', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.Scale'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  }).then((AMap) => {
    map = new AMap.Map('container', {
      viewMode: '2D', // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D'
      zoom: 15, // 初始化地图层级
    })
    let marker = new AMap.Marker({
      icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
      position: [103.9969, 30.7155],
      offset: new AMap.Pixel(-13, -30),
    })
    marker.setMap(map)

    // 把视图定位到marker
    map.setCenter(marker.getPosition())

    emit('sendAMap', AMap, map)
  })
})
</script>
<template>
  <div class="mapView" ref="mapView">
    <div id="container"></div>
  </div>
</template>
<style lang="less" scoped>
.mapView {
  width: 100%;
  height: 100%;
  #container {
    width: 100%;
    height: 100%;
  }
}
</style>
