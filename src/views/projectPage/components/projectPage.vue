<script setup>
import { ref } from 'vue'

const emit = defineEmits(['changeView'])
const handleClick = () => {
  emit('changeView', 1)
}
</script>
<template>
  <div>
    <div class="top">
      <div class="goBack" @click="handleClick"><< 返回项目列表</div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.top {
  height: 50px;
  line-height: 50px;
  .goBack {
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    &:hover {
      color: @link-hover;
    }
  }
}
</style>
