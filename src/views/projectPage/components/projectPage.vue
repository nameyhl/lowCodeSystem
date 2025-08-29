<script setup>
import { defineAsyncComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['changeView'])
const handleClick = () => {
  emit('changeView', 1)
}
import projectStore from '@/stores/modules/project'
let projectInfo = projectStore().projectInfo
let projectStatus = projectInfo.projectStatus
console.log(projectStatus)

import { loadComponent } from '@/utils/loadComponet'

const active = ref(0)
let View = ref(loadComponent(() => import('./projectDetail.vue')))
const clickStep = (index) => {
  // 判断项目进行到哪一步
  if (projectStatus < index) {
    ElMessage.error('项目未到当前步骤')
    return
  }
  View.value = null
  active.value = index
  if (index === 0) {
    View.value = loadComponent(() => import('./projectDetail.vue'))
  } else if (index === 1) {
    View.value = loadComponent(() => import('./projectDemand.vue'))
  } else if (index === 2) {
    View.value = loadComponent(() => import('./projectDesign.vue'))
  } else if (index === 3) {
    View.value = loadComponent(() => import('./projectTest.vue'))
  } else if (index === 4) {
    View.value = loadComponent(() => import('./projectDelivery.vue'))
  }
}

let stepList = ref([
  {
    title: '审批',
    icon: 'Edit',
    click: clickStep,
  },
  {
    title: '需求分析',
    icon: 'UploadFilled',
    click: clickStep,
  },
  {
    title: '设计/开发',
    icon: 'Picture',
    click: clickStep,
  },
  {
    title: '测试',
    icon: 'Picture',
    click: clickStep,
  },
  {
    title: '交付',
    icon: 'Picture',
    click: clickStep,
  },
])
</script>
<template>
  <div>
    <div class="top">
      <div class="goBack" @click="handleClick"><< 返回项目列表</div>
    </div>
    <div class="projectStep">
      <el-steps class="mb-4" :space="200" :active="active" simple>
        <el-step
          v-for="(item, index) in stepList"
          class="stepItem"
          :key="item.title"
          :title="item.title"
          :icon="item.icon"
          :class="{ notAllowed: projectStatus < index }"
          @click="item.click(index)"
        />
      </el-steps>
    </div>
    <div class="projectStepBody">
      <keep-alive :max="3">
        <component :is="View"></component>
      </keep-alive>
    </div>
  </div>
</template>
<style lang="less" scoped>
.top {
  height: 50px;
  line-height: 50px;
  .goBack {
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    &:hover {
      color: @link-hover;
    }
  }
}
:deep(.el-collapse-item__title) {
  font-size: 16px;
  font-weight: 500;
}
.stepItem {
  cursor: pointer;
}
.notAllowed {
  cursor: not-allowed;
}
</style>
