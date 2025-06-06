<script setup>
import { ref } from 'vue';
const props = defineProps({
  userInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const emit = defineEmits(['submit', 'close'])

const submit = () => {
  emit('submit', props.userInfo, false, 'delete')
}

const close = () => {
  emit('close')
}

</script>
<template>
  <div>确认要删除<span style="color: red; font-weight: bold">{{ userInfo.name }}</span>吗？</div>
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
.el-row{
  margin-bottom: 20px;
}
</style>
