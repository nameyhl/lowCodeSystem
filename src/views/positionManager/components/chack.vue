<script setup>
import { ref } from 'vue'

const prop = defineProps({
  positionInfo: {
    type: Object,
    default: () => {},
  },
})

const positionInfo = ref(prop.positionInfo)

const emits = defineEmits(['close'])

const close = () => {
  emits('close')
}
</script>
<template>
  <div>
    <div>职位名称：{{ positionInfo.name }}</div>
    <div>部门名称：{{ positionInfo.departmentName || '暂无部门' }}</div>
    <div>公司名称：{{ positionInfo.frimName || '暂无公司' }}</div>
    <div>负责人：{{ positionInfo.leaderName || '暂无负责人' }}</div>
    <div>备注：{{ positionInfo.msg }}</div>
  </div>
  <div style="text-align: center; margin-top: 20px">
    <el-button type="primary" @click="close">关闭</el-button>
  </div>
</template>
<style lang="less" scoped></style>
