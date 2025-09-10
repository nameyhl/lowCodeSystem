<script setup>
import { ref, watch } from 'vue'

import { ElMessage } from 'element-plus'

import userStore from '@/stores/modules/user'
import projectStore from '@/stores/modules/project'
const user = userStore().user
const project = projectStore()

let createForm = ref({
  name: '', // 项目名称
  msg: '', // 项目描述
  endTime: '', // 项目预期结束时间
  file: [],
})
const rules = ref({
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  msg: [{ required: true, message: '请输入项目描述', trigger: 'blur' }],
  endTime: [{ required: true, message: '请选择项目预期结束时间', trigger: 'blur' }],
})
let createDialog = ref(false)

const handleClose = () => {
  createForm.value = {
    name: '',
    msg: '',
    endTime: '',
    file: [],
  }
  createDialog.value = false
}

const handleExceed = () => {
  createForm.value.file = null
  ElMessage.error('最多上传1个文件')
}

let formRef = ref(null)
import { addProject } from '@/api/project'
const submitForm = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      if (fileList.value.length > 0) {
        let data = {
          ...createForm.value,
          leaderId: user.id,
          filePath: fileList.value[0].response.data.fileUrl,
          fileName: fileList.value[0].response.data.fileName,
        }
        await addProject(data)
          .then((res) => {
            ElMessage.success(res.msg)
            handleClose()
            getProjectList()
          })
          .catch((err) => {
            ElMessage.error('创建失败')
          })
      } else {
        ElMessage.error('请上传项目附件')
      }
    } else {
      ElMessage.error('请将表单输入完整')
    }
  })
}
const handleBeforeUpload = (file) => {
  console.log('Uploading file:', file)
  let nameArr = file.name.split('.')
  let suffix = nameArr[nameArr.length - 1]
  if (suffix != 'pdf') {
    ElMessage.error('请上传pdf文件')
    return false
  }
  ElMessage.success('上传成功')
  return true
}

let fileList = ref([])

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
  project.setProjectInfo(item)
  await project.fetchDemand(item.id)
  await project.fetchApprove(item.id)
  await project.fetchProjectInfo(item.id)
  await project.fetchFile(item.id)
  emit('changeView', 2)
}

import ProjectItem from '@/components/projectItem/index.vue'

import Operate from '@/components/operate/index.vue'

const openCreate = () => {
  createDialog.value = true
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
  <el-dialog v-model="createDialog" title="创建项目" width="500" :before-close="handleClose">
    <el-form :model="createForm" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="createForm.name" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item label="项目描述" prop="msg">
        <el-input
          v-model="createForm.msg"
          type="textarea"
          :max="200"
          show-word-limit
          placeholder="请输入项目描述"
        />
      </el-form-item>
      <el-form-item label="预期结束时间" prop="endTime">
        <el-date-picker
          v-model="createForm.endTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="选择项目预期结束时间"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="项目附件" prop="file">
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          :accept="['.pdf']"
          action="api/file/upload"
          :headers="{ Authorization: 'Bearer ' + user.token }"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :before-upload="handleBeforeUpload"
        >
          <el-button type="primary">点击上传</el-button>
          <template #tip>
            <div class="el-upload__tip">只能上传pdf文件</div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </template>
  </el-dialog>
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
