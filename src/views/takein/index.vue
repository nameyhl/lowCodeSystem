<script setup>
import MapView from '@/components/mapView/index.vue'
import { ref } from 'vue'
</script>
<template>
  <div class="cesiumView" ref="cesiumView">
    <MapView ref="cesiumViewRef" />
  </div>
  <div class="takeinButton">打卡</div>
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
