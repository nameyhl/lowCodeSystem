<script setup>
import { onMounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
let map = null

const getLocation = (AMap) => {
  let options = {
    showButton: true, //是否显示定位按钮
    position: 'RT', //定位按钮的位置
    /* LT LB RT RB */
    offset: [10, 20], //定位按钮距离对应角落的距离
    showMarker: true, //是否显示定位点
    markerOptions: {
      //自定义定位点样式，同Marker的Options
      offset: new AMap.Pixel(-18, -36),
      content:
        '<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>',
    },
    showCircle: true, //是否显示定位精度圈
    circleOptions: {
      //定位精度圈的样式
      strokeColor: '#0093FF',
      noSelect: true,
      strokeOpacity: 0.5,
      strokeWeight: 1,
      fillColor: '#02B0FF',
      fillOpacity: 0.25,
    },
  }
  AMap.plugin(['AMap.Geolocation'], function () {
    var geolocation = new AMap.Geolocation(options)
    console.log(geolocation)
    map.addControl(geolocation)
    geolocation.getCurrentPosition()
  })
}

onMounted(() => {
  AMapLoader.load({
    key: '0510401948d1561409dbb1bdac869466', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.Scale'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  }).then((AMap) => {
    map = new AMap.Map('container', {
      viewMode: '2D', // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D'
      zoom: 15, // 初始化地图层级
    })

    getLocation(AMap)
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
