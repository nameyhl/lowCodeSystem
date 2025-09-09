<script setup>
import { ref, computed } from 'vue'
import projectStore from '@/stores/modules/project'
import useStore from '@/stores/modules/user'
let userInfo = useStore().user
let project = projectStore()

let projectInfo = computed(() => {
  return project.projectInfo
})

import { addDemand } from '@/api/demand'

let demandList = computed(() => {
  return project.demand
})

let addFrom = ref({
  name: '',
  design: '',
  endTime: '',
})

let addFormVisiable = ref(false)
const openAdd = () => {
  addFormVisiable.value = true
}

const handleSubmit = async () => {
  let data = {
    ...addFrom.value,
    projectId: projectInfo.value.id,
  }

  await addDemand(data)
  project.fetchDemand(projectInfo.value.id)
  addFormVisiable.value = false
}

import demandItem from '@/components/demandItem.vue'

import { updateProjectStatus } from '@/api/project'
const overDemand = async () => {
  let data = {
    id: projectInfo.projectId,
    status: 2,
  }
  await updateProjectStatus(data)
}
</script>
<template>
  <div class="demandeContainer">
    <div class="top">
      <div class="button">
        <el-button class="addButton" @click="openAdd">新增需求</el-button>
      </div>
    </div>
    <div class="body">
      <demandItem
        style="height: 100%"
        v-for="item in demandList"
        :key="item.id"
        :demandeObj="item"
        :showDelete="userInfo.id == projectInfo.leaderId"
      ></demandItem>
    </div>
    <div
      class="containerFooter"
      v-if="userInfo.id == projectInfo.leaderId && projectInfo.status == 1"
    >
      <el-button type="primary" @click="overDemand">评审结束</el-button>
    </div>
  </div>

  <el-dialog title="新增需求" v-model="addFormVisiable" width="500px">
    <div class="formBody">
      <el-form :model="addFrom" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="需求名称:" prop="name">
          <el-input
            v-model="addFrom.name"
            autocomplete="off"
            style="width: 220px"
            placeholder="请输入需求名称"
          />
        </el-form-item>
        <el-form-item label="需求设计:" prop="design">
          <el-input
            v-model="addFrom.design"
            autocomplete="off"
            style="width: 220px"
            placeholder="请输入需求设计"
          />
        </el-form-item>
        <el-form-item label="需求结束时间:" prop="endTime">
          <el-date-picker v-model="addFrom.endTime" type="date" placeholder="选择日期" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style>
.demandeContainer {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  min-height: 400px; /* 最小高度 */
  min-height: calc(100vh - 170px);
  .top {
    height: 50px;
    padding: 0 20px;
    .button {
      width: 88px;
      float: right;
    }
  }
  .body {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
  }
  .formBody {
    width: 340px;
    margin: 0 auto;
  }
  .containerFooter {
    width: 100%;
    height: 50px;
    margin-top: auto;
    line-height: 50px;
    text-align: center;
  }
}
</style>
