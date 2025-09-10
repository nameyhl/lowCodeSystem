<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['openDetail'])

const openDetail = (item) => {
  emit('openDetail', item)
}

let item = ref(props.item)

let getProcess = (status) => {
  if (status === 0) {
    return '审批中'
  }
  if (status === 1) {
    return '需求分析中'
  }
  if (status === 2) {
    return '设计开发中'
  }
  if (status === 3) {
    return '测试中'
  }
  if (status === 4) {
    return '待交付'
  }
  if (status === 5) {
    return '已完成'
  }
  return '未知状态'
}
</script>
<template>
  <div class="projectItem" @click="openDetail(item)">
    <div class="projectName">{{ item.name }}</div>
    <div class="projectStatus">
      <div class="title">当前项目进度：</div>
      <div class="status">{{ getProcess(item.status) }}</div>
    </div>
    <div class="projectTime">
      <div class="createTime">
        <div class="title">创建时间：</div>
        <div class="time">{{ item.createTime }}</div>
      </div>
      <div class="endTime">
        <div class="title">预期结束时间：</div>
        <div class="time">{{ item.endTime }}</div>
      </div>
    </div>
    <div class="projectLeader">
      <div class="title">项目负责人：</div>
      {{ item.leaderName }}
    </div>
  </div>
</template>
<style>
.projectItem {
  width: 15rem;
  height: 106px;
  font-size: 14px;
  border: 2px solid #ff0f00;
  margin: 10px;
  padding: 0 3px 10px;
  cursor: pointer;

  &:hover {
    border: 4px solid #007bff;
    margin: 8px;
  }
  div :not(:first-child) {
    height: 20px;
    line-height: 20px;
  }
  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .projectName {
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
  .projectStatus {
    display: flex;
  }
  .projectTime {
    padding-left: 2rem;

    .createTime {
      display: flex;
    }
    .endTime {
      display: flex;
    }
  }
  .projectLeader {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
