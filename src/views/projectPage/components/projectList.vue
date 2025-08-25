<script setup>
import { ref, watch } from 'vue'

import userStore from '@/stores/modules/user'
const user = userStore().user

import { getProjectListByLeaderId } from '@/api/project.js'

const projectList = ref([])
const projectType = ref(1)

const getProjectList = () => {
  console.log(123)
  console.log(projectType.value)
  if (projectType.value === 3) {
    getProjectListByLeaderId({
      leaderId: user.id,
    }).then((res) => {
      projectList.value = res.data
    })
  }
}

watch(projectType, () => {
  projectList.value = []
  getProjectList()
})

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
const openDetail = () => {
  emit('changeView', 2)
}
</script>
<template>
  <div class="headBar">
    <el-tabs v-model="projectType" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="我的项目" :name="1"> </el-tab-pane>
      <el-tab-pane label="我负责的项目" :name="2"> </el-tab-pane>
      <el-tab-pane label="我创建的项目" :name="3"> </el-tab-pane>
    </el-tabs>
    <component
      :is="View"
      :projectType="projectType"
      :projectInfo="projectInfo"
      @changeView="changeView"
    ></component>
  </div>
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
.headBar {
  height: 50px;
}
.projectList {
  height: calc(100% - 90px);
  display: flex;
  flex-wrap: wrap;
  overflow: auto;

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
}
</style>
