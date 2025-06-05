<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close'])

const props = defineProps({
  departmentInfo: {
    type: Object,
    default: () => {}
  }
})

let info = ref(props.departmentInfo)

const close = () => {
  info.value = {}
  emit('close')
}
</script>
<template>
  <div class="info">
    <div class="frimName">
      <span class="label">部门名称：</span>
      <span>{{ info.name }}</span>
    </div>
    <div class="frimLeader">
      <span class="label">部门负责人：</span>
      <span>{{ info.leader || '暂未分配负责人' }}</span>
    </div>
    <div class="frimLeader">
      <span class="label">部门所属分公司：</span>
      <span>{{ info.frimName }}</span>
    </div>
    <div class="frimMsg">
      <span class="label">部门信息：</span>
      <span>
        {{ info.msg || '暂无信息' }}
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
