<script setup>
import demandItem from '@/components/demandItem.vue'
</script>
<template>
  <div class="top">
    <div class="button">
      <el-button class="addButton">新增需求</el-button>
    </div>
  </div>
  <div class="body">
    <demandItem></demandItem>
  </div>
</template>
<style>
.top {
  height: 50px;
  padding: 0 20px;
  .button {
    width: 88px;
    float: right;
  }
}
</style>
