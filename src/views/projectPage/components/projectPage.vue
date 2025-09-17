<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const emit = defineEmits(['changeView'])
const handleClick = () => {
  emit('changeView', 1)
}
import projectStore from '@/stores/modules/project'
const project = projectStore()
let projectInfo = computed(() => {
  return project.projectInfo
})
import userStore from '@/stores/modules/user'
let user = userStore().user

import { loadComponent } from '@/utils/loadComponet'

const active = ref(0)
let View = ref(loadComponent(() => import('./projectDetail.vue')))
const clickStep = (index) => {
  if (active.value == index) {
    return
  }

  // 判断项目进行到哪一步
  if (projectInfo.value.status < index) {
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
    title: '设计开发',
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

import { deleteProjectById } from '@/api/project'

const deleteProject = () => {
  ElMessageBox.confirm(`确定删除项目${projectInfo.value.name}吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    let data = {
      id: projectInfo.value.id,
    }
    console.log(data)
    await deleteProjectById(data)
      .then((res) => {
        ElMessage.success('删除成功')
        handleClick()
      })
      .catch(() => {
        ElMessage.error('删除失败')
      })
  })
}
</script>
<template>
  <div>
    <div class="top">
      <div class="goBack" @click="handleClick"><< 返回项目列表</div>
      <div class="right">
        <el-button type="danger" @click="deleteProject" v-if="user.id == projectInfo.leaderId"
          >删除项目</el-button
        >
      </div>
    </div>
    <div class="projectStep">
      <el-steps class="mb-4" :active="active" simple>
        <el-step
          v-for="(item, index) in stepList"
          class="stepItem"
          :key="item.title"
          :title="item.title"
          :icon="item.icon"
          :class="{ notAllowed: projectInfo.status < index }"
          @click="item.click(index)"
        />
      </el-steps>
    </div>
    <div class="projectStepBody">
      <keep-alive :max="3">
        <component :is="View" @projectOver="handleClick"></component>
      </keep-alive>
    </div>
  </div>
</template>
<style lang="less" scoped>
.top {
  display: flex;
  justify-content: space-between;
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
.projectStep {
  :deep(.el-step__icon) {
    display: none;
  }
}
.projectStepBody {
  height: calc(100%);
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
:deep(.el-step__title.is-process) {
  color: #ff0000;
}
</style>
