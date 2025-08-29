import { defineStore } from 'pinia'
import { ref } from 'vue'

const projectStore = defineStore('project', () => {
  // 项目信息
  let projectInfo = ref(null)

  const setProjectInfo = (data) => {
    projectInfo.value = data
  }

  const getProjectInfo = () => {
    return projectInfo.value
  }

  const removeProjectInfo = () => {
    projectInfo.value = null
  }

  // 当前用户是否需要当前用户审批
  let isApprover = ref(false)
  const setIsApprover = (data) => {
    isApprover.value = data
  }
  const getIsApprover = () => {
    return isApprover.value
  }

  return {
    projectInfo,
    setProjectInfo,
    getProjectInfo,
    removeProjectInfo,
    isApprover,
    setIsApprover,
    getIsApprover,
  }
})

export default projectStore
