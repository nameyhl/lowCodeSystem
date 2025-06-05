<script setup>
import { defineEmits } from 'vue';

const props = defineProps({
  showAdd: {
    type: Boolean,
    default: true
  },
  showDelete: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['add', 'delete']);

const deleteObj = () => {
  emit('delete');
}
const addObj = () => {
  emit('add');
}

</script>
<template>
    <el-button class="addButton" @click="addObj" v-if="showAdd">
      <el-icon>
        <component is="Plus" />
      </el-icon>
      添加</el-button>
    <el-button class="deleteButton" @click="deleteObj" v-if="showDelete">
      <el-icon>
        <component is="Delete" />
      </el-icon>
      删除</el-button>
</template>
<style lang="less" scoped></style>
