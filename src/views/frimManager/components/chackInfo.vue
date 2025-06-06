<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

let dialogInfo = ref({
  name: '',
  leader: '',
  msg: ''
})
const initInfo = (info) => {
  dialogInfo.value = info
}

defineExpose({
  init: initInfo
})
</script>
<template>
  <div class="info">
    <div class="frimName">
      <span class="label">分公司名称：</span>
      <span>{{ dialogInfo.name }}</span>
    </div>
    <div class="frimLeader">
      <span class="label">分公司负责人：</span>
      <span>{{ dialogInfo.leaderName || '暂未分配负责人' }}</span>
    </div>
    <div class="frimMsg">
      <span class="label">分公司信息：</span>
      <span>
        {{ dialogInfo.msg || '暂无信息' }}
      </span>
    </div>
  </div>
  <div class="footer">
    <el-button type="primary" @click="close">关闭</el-button>
  </div>
</template>
<style lang="less" scoped>
.footer {
  text-align: center;
  margin-top: 20px;
  .el-button {
    padding: 8px 15px
  }
}
.info{
  .label{
    display: inline-block;
    font-weight: 700;
    color: #333;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
