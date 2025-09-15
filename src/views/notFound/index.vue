<script setup></script>
<template>
  <div class="body">
    <div class="box">
      <div class="title">404NotFound</div>
      <div class="text">很抱歉，页面不存在</div>
      <div class="img">
        <img src="@/assets/systemPage/404png/404.png" alt="" />
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@import './less/mobile.less';
@media (min-width: 1024px) {
  @import './less/desktop.less';
}
@media (min-width: 768px) {
  @import './less/tablet.less';
}
</style>
