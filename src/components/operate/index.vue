<script setup>
import { defineEmits } from 'vue'

const props = defineProps({
  showAdd: {
    type: Boolean,
    default: true,
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['add', 'delete'])

const deleteObj = () => {
  emit('delete')
}
const addObj = () => {
  emit('add')
}
</script>
<template>
  <div class="searchBody">
    <slot name="searchFrom"></slot>
    <div class="operateBox">
      <el-button class="addButton" @click="addObj" v-if="showAdd">
        <el-icon>
          <component is="Plus" />
        </el-icon>
        添加</el-button
      >
      <el-button class="deleteButton" @click="deleteObj" v-if="showDelete">
        <el-icon>
          <component is="Delete" />
        </el-icon>
        删除</el-button
      >
    </div>
  </div>
</template>
<style lang="less" scoped>
.searchBody {
  display: flex;
  justify-content: space-between;
}
</style>
