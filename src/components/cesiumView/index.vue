<script setup>
import { ref, onMounted } from 'vue'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

// 设置 Cesium 基础 URL
window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/'
const cesiumContainer = ref(null)

let viewer = null

// 将相机定位到指定位置
const flyTo = (position) => {
  if (viewer) {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        position.coords.longitude,
        position.coords.latitude,
        1000,
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0.0,
      },
    })
  }
}

onMounted(async () => {
  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NzFiMDc5Ni05YjE2LTQ2YWYtYmJlMi1mNzRhYWM5ZGY2ZGUiLCJpZCI6MjU2NzIxLCJpYXQiOjE3MzIxNTI4OTZ9.WTGHaY16gaELJeBQbjcL7fSbd21wUWvzZkTbG9D-uqw'

  // 初始化Cesium Viewer
  viewer = new Cesium.Viewer('cesiumContainer', {
    // 隐藏一些默认控件
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: true,
    geocoder: false,
    homeButton: true,
    infoBox: true,
    sceneModePicker: true,
    selectionIndicator: true,
    timeline: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
  })

  // 添加天地图影像服务 - 正确配置
  const tdtImageryProvider = new Cesium.WebMapTileServiceImageryProvider({
    url: 'https://t0.tianditu.gov.cn/img_w/wmts?tk=fffebb6614937f8ec05898767b3f58d7',
    layer: 'img',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'w',
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    maximumLevel: 18,
    credit: new Cesium.Credit('天地图影像数据'),
  })

  // 添加天地图标注服务 - 正确配置
  const tdtLabelImageryProvider = new Cesium.WebMapTileServiceImageryProvider({
    url: 'https://t0.tianditu.gov.cn/cia_w/wmts?tk=fffebb6614937f8ec05898767b3f58d7',
    layer: 'cia',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'w',
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    maximumLevel: 18,
    credit: new Cesium.Credit('天地图标注数据'),
  })

  // 先添加影像图层
  viewer.imageryLayers.addImageryProvider(tdtImageryProvider)

  // 再添加标注图层（会显示在影像之上）
  viewer.imageryLayers.addImageryProvider(tdtLabelImageryProvider)

  // 隐藏Cesium ion徽标
  viewer._cesiumWidget._creditContainer.style.display = 'none'
})

// 暴露flyTo方法
defineExpose({
  flyTo,
})
</script>

<template>
  <div id="cesiumContainer" class="cesium-container"></div>
</template>

<style lang="less" scoped>
.cesium-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
