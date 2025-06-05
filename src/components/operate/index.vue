<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['add', 'delete']);

const deleteObj = () => {
  emit('delete');
}
const addObj = () => {
  emit('add');
}

</script>
<template>
    <el-button class="addButton" @click="addObj">
      <el-icon>
        <component is="Plus" />
      </el-icon>
      添加</el-button>
    <el-button class="deleteButton" @click="deleteObj">
      <el-icon>
        <component is="Delete" />
      </el-icon>
      删除</el-button>
</template>
<style lang="less" scoped></style>
