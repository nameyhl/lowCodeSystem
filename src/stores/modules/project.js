import { getDemandList } from '@/api/demand'
import { getProjectById, getProjectDetail, getFile } from '@/api/project'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 按照status区分需求
function getDemandListByStatus(reslut) {
  let aws = {}
  let statusList = [
    'close', //关闭
    'undeveloped', // 未开发
    'developing', // 开发中
    'reject', // 已驳回
    'noTest', // 未测试
    'testing', // 测试中
    'nopass', // 测试未通过
    'pass', // 完成
  ]

  statusList.forEach((item, index) => {
    aws[item] = reslut.filter((i) => i.status === index)
  })
  return aws
}

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

  // 审批流程
  let approve = ref({})
  const setApprove = (data) => {
    approve.value = data
  }
  const getApprove = () => {
    return approve.value
  }

  // 项目需求
  let demand = ref([])
  let demandByStatus = ref({})
  const setDemand = (data) => {
    demand.value = data
  }
  const getDemand = () => {
    return demand.value
  }

  // 当前用户是否需要当前用户审批
  let isApprover = ref(false)
  const setIsApprover = (data) => {
    isApprover.value = data
  }
  const getIsApprover = () => {
    return isApprover.value
  }

  // 项目文件
  let file = ref([])
  const setFile = (data) => {
    file.value = data
  }
  const getFileList = () => {
    return file.value
  }

  const fetchProjectInfo = async (projectId) => {
    return new Promise(async (resolve, reject) => {
      getProjectById({ id: projectId })
        .then((res) => {
          projectInfo.value = res.data
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const fetchApprove = async (projectId) => {
    return new Promise(async (resolve, reject) => {
      await getProjectDetail({ id: projectId })
        .then((res) => {
          approve.value = res.data
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // 异步获取项目需求
  const fetchDemand = async (projectId) => {
    return new Promise(async (resolve, reject) => {
      await getDemandList({
        id: projectId,
      })
        .then((res) => {
          demand.value = res.data
          demandByStatus.value = getDemandListByStatus(res.data)
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const fetchFile = async (projectId) => {
    return new Promise(async (resolve, reject) => {
      await getFile({
        id: projectId,
      })
        .then((res) => {
          file.value = res.data
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  return {
    projectInfo,
    setProjectInfo,
    getProjectInfo,
    removeProjectInfo,
    fetchProjectInfo,
    approve,
    setApprove,
    getApprove,
    fetchApprove,
    demand,
    demandByStatus,
    setDemand,
    getDemand,
    fetchDemand,
    isApprover,
    setIsApprover,
    getIsApprover,
    file,
    getFileList,
    setFile,
    fetchFile,
  }
})

export default projectStore
