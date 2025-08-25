<script setup>
import { ref } from 'vue'
import userStore from '@/stores/modules/user'
const user = userStore().user
let projectType = ref(1)

let View = ref(projectList)
import projectList from './components/projectList.vue'
import projectPage from './components/projectPage.vue'

const handleClick = (tab) => {
  View.value = projectList
}

import Operate from '@/components/operate/index.vue'
import { ElMessage } from 'element-plus'

let createDialog = ref(false)
const openCreate = () => {
  createDialog.value = true
}

let createForm = ref({
  name: '', // 项目名称
  msg: '', // 项目描述
  endTime: '', // 项目预期结束时间
})

let fileList = ref([])

const rules = ref({
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  msg: [{ required: true, message: '请输入项目描述', trigger: 'blur' }],
  endTime: [{ required: true, message: '请选择项目预期结束时间', trigger: 'blur' }],
})

const handleClose = () => {
  createForm.value = {
    name: '',
    msg: '',
    endTime: '',
    file: [],
  }
  createDialog.value = false
}

let formRef = ref(null)
import { addProject } from '@/api/project'
const submitForm = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      console.log(fileList.value)

      if (fileList.value.length > 0) {
        let data = {
          ...createForm.value,
          leaderId: user.id,
          filePath: fileList.value[0].response.data.url,
          fileName: fileList.value[0].response.data.name,
        }
        await addProject(data)
          .then((res) => {
            ElMessage.success(res.msg)
            handleClose()
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

const handleExceed = () => {
  createForm.value.file = null
  ElMessage.error('最多上传1个文件')
}

let projectInfo = ref({})
const changeView = (type) => {
  if (type === 1) {
    View.value = projectList
  } else {
    View.value = projectPage
  }
}

const handleBeforeUpload = (file) => {
  console.log('Uploading file:', file)
  return true
}
</script>
<template>
  <div class="head">
    <Operate :showDelete="false" @add="openCreate">
      <template #addName>创建项目</template>
    </Operate>
  </div>
  <component
    :is="View"
    :projectType="projectType"
    :projectInfo="projectInfo"
    @changeView="changeView"
  ></component>
  <el-dialog v-model="createDialog" title="创建项目" width="500" :before-close="handleClose">
    <el-form :model="createForm" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="createForm.name" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item label="项目描述" prop="msg">
        <el-input v-model="createForm.msg" placeholder="请输入项目描述" />
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
          action="api/file/upload"
          :headers="{ Authorization: 'Bearer ' + user.token }"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :before-upload="handleBeforeUpload"
        >
          <el-button type="primary">Click to upload</el-button>
          <template #tip>
            <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
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
