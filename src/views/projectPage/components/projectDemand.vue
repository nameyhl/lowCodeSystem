<script setup>
import { ref, computed } from 'vue'
import projectStore from '@/stores/modules/project'
import useStore from '@/stores/modules/user'
let user = useStore().user
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

let rules = {
  name: [{ required: true, message: '请输入需求名称', trigger: 'blur' }],
  design: [{ required: true, message: '请输入需求设计', trigger: 'blur' }],
  endTime: [{ required: true, message: '请选择需求结束时间', trigger: 'blur' }],
}

let addFormVisiable = ref(false)

let formRef = ref(null)
const openAdd = () => {
  addFormVisiable.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      let data = {
        ...addFrom.value,
        projectId: projectInfo.value.id,
      }
      await addDemand(data)
      project.fetchDemand(projectInfo.value.id)
      addFormVisiable.value = false
      addFrom.value = {
        name: '',
        design: '',
        endTime: '',
      }
    }
  })
}

const handleClose = () => {
  addFormVisiable.value = false
  addFrom.value = {
    name: '',
    design: '',
    endTime: '',
  }
}

import demandItem from '@/components/demandItem.vue'

let fileList = ref([])

const handleExceed = () => {
  fileList.value = []
}

let overDemandVisiable = ref(false)
const handleBeforeUpload = (file) => {
  let fileName = file.name
  let nameArr = fileName.split('.')
  let suffix = nameArr[nameArr.length - 1]
  suffix = suffix.toLowerCase()
  if (suffix != 'pdf') {
    ElMessage.error('请上传pdf文件')
    return false
  }
  return true
}
import { updateProjectStatus } from '@/api/project'
import { ElMessage } from 'element-plus'
const overDemand = async () => {
  overDemandVisiable.value = true
}
const closeDemand = async () => {
  overDemandVisiable.value = false
  fileList.value = []
}
const submitFile = async () => {
  console.log(fileList.value)
  if (fileList.value.length == 0) {
    ElMessage.error('请上传文件')
    return
  } else {
    let data = {
      id: projectInfo.value.id,
      status: projectInfo.value.status + 1,
      filePath: fileList.value[0].path,
      fileName: fileList.value[0].name,
    }
    await updateProjectStatus(data).then(() => {
      project.fetchProjectInfo(projectInfo.value.id)
      project.fetchFile(projectInfo.value.id)
      ElMessage.success('上传成功')
      closeDemand()
    })
  }
}
const handleError = (error) => {
  console.error('上传失败:', error)
  ElMessage.error(`上传失败: ${error.message}`)
}
const handleSuccess = (res) => {
  fileList.value.push({
    name: res.data.fileName,
    path: res.data.fileUrl,
  })
}
</script>
<template>
  <div class="demandeContainer">
    <div class="top">
      <div class="button" v-if="user.id == projectInfo.leaderId">
        <el-button class="addButton" @click="openAdd">新增需求</el-button>
      </div>
    </div>
    <div class="body">
      <demandItem
        style="height: 100%"
        v-for="item in demandList"
        :key="item.id"
        :demandeObj="item"
        :showDelete="user.id == projectInfo.leaderId"
      ></demandItem>
    </div>
    <div class="containerFooter" v-if="user.id == projectInfo.leaderId && projectInfo.status == 1">
      <el-button type="primary" @click="overDemand">评审结束</el-button>
    </div>
  </div>

  <el-dialog title="新增需求" v-model="addFormVisiable" width="500px" :before-close="handleClose">
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
            type="textarea"
            rows="4"
            placeholder="请输入需求设计"
          />
        </el-form-item>
        <el-form-item label="需求结束时间:" prop="endTime">
          <el-date-picker v-model="addFrom.endTime" type="date" placeholder="选择日期" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-dialog>

  <el-dialog
    title="需求文档"
    v-model="overDemandVisiable"
    width="500px"
    :before-close="closeDemand"
  >
    <el-upload
      class="upload-demo"
      :headers="{ Authorization: 'Bearer ' + user.token }"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :before-upload="handleBeforeUpload"
      :limit="1"
      drag
      action="api/file/upload"
      multiple
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖动文件或 <em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">只允许上传pdf文件</div>
      </template>
    </el-upload>

    <template #footer>
      <el-button @click="closeDemand">取消</el-button>
      <el-button type="primary" @click="submitFile">提交</el-button>
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
