<script setup>
import { ref } from 'vue'
let projectType = ref(1)

let View = ref(projectList)
import projectList from './components/projectList.vue'
import projectPage from './components/projectPage.vue'

const changeView = async (type) => {
  console.log(type)
  if (type === 1) {
    View.value = projectList
  } else {
    View.value = projectPage
  }
}
</script>
<template>
  <component
    :is="View"
    :projectType="projectType"
    @changeView="changeView"
    :ref="projectPageRef"
  ></component>
</template>
<style lang="less" scoped>
.head {
  height: 50px;
}

.headBar {
  height: calc(100% - 50px);
}

:deep(.el-tabs__content) {
  visibility: hidden;
}
:deep(.el-tabs__header) {
  margin: 0;
}
</style>
