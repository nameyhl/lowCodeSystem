<script setup>
import { ref, watch } from 'vue'
import { View } from '@element-plus/icons-vue'

import userStore from '@/stores/modules/user'
const user = userStore().user

const props = defineProps({
  projectType: {
    type: String,
    default: '1',
  },
})

import { getProjectListByLeaderId } from '@/api/project.js'

const projectList = ref([])

watch(
  () => props.projectType,
  (newVal) => {
    if (newVal === 1) {
    }
    if (newVal === 2) {
    }
    if (newVal === 3) {
      getProjectListByLeaderId({
        leaderId: user.id,
      }).then((res) => {
        projectList.value = res.data
      })
    }
  },
)

let getProcess = (status) => {
  if (status === 0) {
    return '已提交，待审批'
  }
  if (status === 1) {
    return '已审批，待开始'
  }
  if (status === 2) {
    return '需求分析中'
  }
  if (status === 3) {
    return '设计中'
  }
  if (status === 4) {
    return '开发中'
  }
  if (status === 5) {
    return '测试中'
  }
  if (status === 6) {
    return '已完成'
  }
  if (status === 7) {
    return '已取消'
  }
  return '未知状态'
}
const emit = defineEmits(['changeView'])
const openDetail = (item) => {
  emit('changeView', item)
}
</script>
<template>
  <div class="projectList">
    <div class="projectItem" v-for="item in projectList" @click="openDetail(item)">
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
  </div>
</template>
<style lang="less" scoped>
.projectList {
  height: calc(100% - 40px);
  display: flex;
  flex-wrap: wrap;
  overflow: auto;

  .projectItem {
    width: calc(25% - 30px);
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
}
</style>
