<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

import userStore from '@/stores/modules/user'
import projectStore from '@/stores/modules/project'
const user = userStore().user
const project = projectStore()
console.log(project)

import { getProjectListByLeaderId, getProjectListByLevel } from '@/api/project.js'

const projectList = ref([])
const projectType = ref(3)

let isApprover = ref(false)
const getProjectList = () => {
  isApprover.value = false
  if (projectType.value === 3) {
    getProjectListByLeaderId({
      leaderId: user.id,
    }).then((res) => {
      projectList.value = res.data
    })
  }
  if (projectType.value === 4) {
    getProjectListByLevel({
      id: user.id,
      level: user.isLeader,
    }).then((res) => {
      projectList.value = res.data
      isApprover.value = true
    })
  }
}

getProjectList()

watch(projectType, () => {
  projectList.value = []
  getProjectList()
})

const emit = defineEmits(['changeView', 'openAdd'])

const openDetail = async (item) => {
  let data = {
    id: item.id,
  }
  await getProjectDetail(data).then((res) => {
    let isApprover = false
    let projectInfo = res.data
    // 当前点击项目是否是需要当前用户审批
    if (user.isLeader == 'department' && projectInfo.stepNum == 1 && projectInfo.step1Status != 1) {
      isApprover = true
    }
    if (user.isLeader == 'frim' && projectInfo.step2Status != 1 && projectInfo.stepNum == 2) {
      isApprover = true
    }
    project.setProjectInfo(projectInfo)
    project.setIsApprover(isApprover)
  })
  emit('changeView', 2)
}

import { getProjectDetail } from '@/api/project.js'

import ProjectItem from '@/components/projectItem/index.vue'

import Operate from '@/components/operate/index.vue'

const openCreate = () => {
  emit('openAdd')
}
</script>
<template>
  <div class="head">
    <Operate :showDelete="false" @add="openCreate">
      <template #addName>创建项目</template>
    </Operate>
  </div>
  <div class="headBar">
    <el-tabs v-model="projectType" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="我创建的项目" :name="3"></el-tab-pane>
      <el-tab-pane label="我审核的项目" :name="4" v-if="user.isLeader"></el-tab-pane>
    </el-tabs>
  </div>
  <div class="projectList">
    <ProjectItem v-for="item in projectList" @click="openDetail(item)" :item="item"> </ProjectItem>
  </div>
</template>
<style lang="less" scoped>
.headBar {
  height: 50px;
}
.projectList {
  min-height: 50px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
.title {
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  font-weight: 600;
  background-color: @ruby;
  color: @header-text;
  padding-left: 50px;
  border-radius: 15px;
}
</style>
