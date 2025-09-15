<script setup>
import { ref, onMounted } from 'vue'
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

let model = ref('PC')
onMounted(() => {
  model.value = sessionStorage.getItem('model')
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
    <div class="searchBox">
      <slot name="searchFrom"></slot>
    </div>
    <div class="operateBox">
      <el-button class="addButton" @click="addObj" v-if="showAdd && model === 'PC'">
        <el-icon>
          <component is="Plus" />
        </el-icon>
        <slot name="addName"></slot>
      </el-button>
      <el-button class="deleteButton" @click="deleteObj" v-if="showDelete && model === 'PC'">
        <el-icon>
          <component is="Delete" />
        </el-icon>
        删除</el-button
      >
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
