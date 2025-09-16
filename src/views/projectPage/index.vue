<script setup>
import { ref } from 'vue'
let projectType = ref(1)
import projectStore from '@/stores/modules/project'
const project = projectStore()

let loading = ref(false)

let View = ref(projectList)
import projectList from './components/projectList.vue'
import projectPage from './components/projectPage.vue'

const changeView = async (type, item) => {
  console.log(type)
  if (type === 1) {
    View.value = projectList
  } else {
    View.value = projectPage
    loading.value = true
    project.setProjectInfo(item)
    await project.fetchDemand(item.id)
    await project.fetchApprove(item.id)
    await project.fetchProjectInfo(item.id)
    await project.fetchFile(item.id)
    loading.value = false
  }
}
</script>
<template>
  <component
    v-loading="loading"
    :is="View"
    :projectType="projectType"
    @changeView="changeView"
    :ref="projectPageRef"
  ></component>
</template>
<style lang="less" scoped>
@import './less/index/mobile.less';
@media (min-width: 1024px) {
  @import './less/index/desktop.less';
}
@media (min-width: 768px) {
  @import './less/index/tablet.less';
}
</style>
