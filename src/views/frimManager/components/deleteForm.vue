<script setup>
import { ref } from 'vue';

let rowInfo = ref({})

const props = defineProps({
  frimInfo: {
    type: Object,
    default: () => ({})
  }
})
rowInfo.value = props.frimInfo

const emit = defineEmits(['submit', 'close'])

const close = () => {
  emit('close')
}
const submit = () => {
  emit('submit', rowInfo.value, false, 'delete')
}

</script>
<template>
  <div>确认要删除<span style="color: red; font-weight: bold">{{ rowInfo.name }}</span>吗</div>
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
