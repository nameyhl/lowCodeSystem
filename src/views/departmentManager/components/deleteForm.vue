<script setup>
import { ref } from 'vue';

const porps = defineProps({
  departmentInfo: {
    type: Object,
    default: () => ({})
  },
})

let info = ref(porps.departmentInfo)

const emit = defineEmits(['submit', 'close'])
const submit = () => {
  emit('submit', info.value, false, 'delete')
}
const close = () => {
  emit('close')
}
</script>
<template>
  <div>确认要删除<span style="color: red; font-weight: bold;">{{info.name}}</span>吗？</div>
  <div>删除后不可恢复！</div>
  <div>请谨慎操作！></div>
  <div class="foot">
    <el-button style="padding: 8px 15px" type="primary" @click="submit">提交</el-button>
    <el-button style="padding: 8px 15px" @click="close">取消</el-button>
  </div>
</template>
<style lang="less" scoped>
.foot{
  text-align: center;
  margin-top: 20px;
}
</style>
