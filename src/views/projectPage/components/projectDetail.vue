<script setup>
import { ElMessageBox, ElInput, ElMessage } from 'element-plus'
import { ref, h, computed, watch } from 'vue'
import { View, Hide } from '@element-plus/icons-vue'

import projectStore from '@/stores/modules/project'
import userStore from '@/stores/modules/user'
let user = userStore().user
let project = projectStore()
let process = ref([])
let active = ref(0)
let isApprover = ref(false)

let projectInfo = computed(() => {
  return project.approve
})
watch(projectInfo, (newVal, oldVal) => {
  getAllData()
})
let getAllData = () => {
  active.value = projectInfo.value.stepNum
  process.value = [
    {
      title: '项目提交',
      startTime: projectInfo.value.projectCreateTime,
      endTime: projectInfo.value.projectCreateTime,
      processStatus: 1,
      submitUser: projectInfo.value.leaderName,
    },
    {
      title: '部门审批',
      startTime: projectInfo.value.projectCreateTime,
      desc: projectInfo.value.step1Msg,
      processStatus: projectInfo.value.step1Status,
      endTime: projectInfo.value.step1EndTime,
      submitUser: projectInfo.value.departmentLeaderName,
    },
    {
      title: '公司负责人审批',
      startTime: projectInfo.value.step1EndTime,
      processStatus: projectInfo.value.step2Status,
      desc: projectInfo.value.step2Msg,
      endTime: projectInfo.value.step2EndTime,
      submitUser: projectInfo.value.frimLeaderName,
    },
    {
      processStatus: projectInfo.value.step3Status,
      title: '项目完成',
      startTime: projectInfo.value.step2EndTime,
    },
  ]
  // 当前点击项目是否是需要当前用户审批

  isApprover.value =
    (user.isLeader == 'department' &&
      projectInfo.value.stepNum == 1 &&
      projectInfo.value.step1Status != 1) ||
    (user.isLeader == 'frim' &&
      projectInfo.value.step2Status != 1 &&
      projectInfo.value.stepNum == 2)
}
getAllData()

const getStatus = (status) => {
  if (status === 0) {
    return '未到达'
  }
  if (status === 1) {
    return '已通过'
  }
  if (status === 2) {
    return '已驳回'
  }
  if (status === 3) {
    return '待审批'
  }
}

let getProcess = (status) => {
  if (status === 0) {
    return '已提交，待审批'
  }
  if (status === 1) {
    return '已审批，待开始'
  }
  if (status === 2) {
    return '需求分析中'
  }
  if (status === 3) {
    return '设计中'
  }
  if (status === 4) {
    return '开发中'
  }
  if (status === 5) {
    return '测试中'
  }
  if (status === 6) {
    return '已完成'
  }
  if (status === 7) {
    return '已取消'
  }
  return '未知状态'
}

let activeNames = ref(['1', '2', '3', '4'])
const handleChange = (val) => {
  console.log(val)
}

import { updateProject } from '@/api/project'

let message = ref('')
// 审批
const handleApprove = (status) => {
  message.value = ''
  let boxTitle = status === 'pass' ? '审批建议' : '驳回原因'
  ElMessageBox({
    customClass: 'custom-message-box',
    title: boxTitle,
    // Should pass a function if VNode contains dynamic props
    message: () =>
      h(ElInput, {
        modelValue: message.value,
        'onUpdate:modelValue': (val) => {
          message.value = val
        },
        placeholder: `请输入${boxTitle}`,
        type: 'textarea',
        minlength: 10,
        maxlength: 200,
        showWordLimit: true,
        style: { width: '400px' },
      }),
  })
    .then(async () => {
      if (!message.value) {
        ElMessage.error(`请输入${boxTitle}`)
        return
      }
      let data = {
        stepMsg: message.value,
        states: status,
        id: projectInfo.value.projectId,
        stepNum: projectInfo.value.stepNum,
      }
      await updateProject(data).then((res) => {
        project.fetchProjectInfo(projectInfo.value.projectId)
        project.fetchApprove(projectInfo.value.projectId)
      })
    })
    .catch(() => {
      console.log('取消')
    })
}

let isShowCode = ref(false)
const showCode = () => {
  isShowCode.value = !isShowCode.value
}
import { getFileStream } from '@/api/file'

let chackFile = async (path) => {
  getFileStream(path).then(async (res) => {
    const blob = new Blob([res], { type: 'application/pdf' })
    console.log(blob)
    const url = URL.createObjectURL(blob)
    // 通过url访问文件
    window.open(url)
  })
}
const exportFile = async (path, fileName) => {
  const res = await getFileStream(path)
  const blob = new Blob([res], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  // 创建隐藏的下载链接
  const link = document.createElement('a')
  link.href = url
  link.download = fileName || `file_${Date.now()}`
  link.style.display = 'none'

  // 触发下载
  document.body.appendChild(link)
  link.click()

  // 清理资源
  URL.revokeObjectURL(url)
  document.body.removeChild(link)
}
</script>
<template>
  <div>
    <div class="projectDetial">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="项目信息" name="1">
          <div class="projectInfo">
            <el-row :gutters="20">
              <el-col :span="12">
                <div class="title">项目名称：</div>
                <div class="desc">{{ projectInfo.projectName }}</div>
              </el-col>
              <el-col :span="12">
                <div class="title">项目预期结束时间：</div>
                <div class="desc">{{ projectInfo.ProjectEndTime }}</div>
              </el-col>
            </el-row>
            <el-row :gutters="20">
              <el-col :span="12">
                <div class="title">项目编码：</div>
                <div class="desc">
                  {{ isShowCode ? projectInfo.projectCode : '****' }}
                  <el-icon @click="showCode" v-if="isShowCode"><View /></el-icon>
                  <el-icon @click="showCode" v-else><Hide /></el-icon>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="title">项目创建时间：</div>
                <div class="desc">{{ projectInfo.projectCreateTime }}</div>
              </el-col>
            </el-row>
            <el-row :gutters="20">
              <el-col :span="12">
                <div class="title">项目状态：</div>
                <div class="desc">{{ getProcess(projectInfo.projectStatus) }}</div>
              </el-col>
              <el-col :span="12">
                <div class="title">项目负责人：</div>
                <div class="desc">{{ projectInfo.leaderName }}</div>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item title="项目描述" name="3">
          <div class="projectDesc">
            <div class="desc">{{ projectInfo.msg }}</div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="项目附件" name="4">
          <div class="fileBody">
            <div class="fileName">
              <span @click="chackFile(projectInfo.filePath)">
                {{ projectInfo.fileName }}
              </span>
            </div>
            <div class="exportButton">
              <el-button
                link
                type="primary"
                @click="exportFile(projectInfo.filePath, projectInfo.fileName)"
                >导出</el-button
              >
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="项目进度" name="2">
          <div class="projectProcess">
            <div style="height: 300px; max-width: 600px">
              <el-steps direction="vertical" :active="active">
                <el-step
                  v-for="item in process"
                  :title="item.title"
                  :key="item.title"
                  :class="{ reject: item.processStatus === 2 }"
                >
                  <template #description>
                    <div class="leftBox">
                      <div class="time">提交时间：{{ item.startTime }}</div>
                      <div class="user" v-if="item.submitUser">审批人：{{ item.submitUser }}</div>
                      <div class="time" v-if="item.endTime">结束时间：{{ item.endTime }}</div>
                    </div>
                    <div class="rightBox">
                      <div class="desc" v-if="item.desc">
                        {{ item.processStatus != 2 ? '审批建议：' : '驳回原因：' }}
                        <el-tooltip :content="item.desc" placement="top">
                          {{ item.desc }}
                        </el-tooltip>
                      </div>
                      <div class="status">{{ getStatus(item.processStatus) }}</div>
                    </div>
                  </template>
                </el-step>
              </el-steps>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="footer">
      <el-button v-if="isApprover" type="primary" @click="handleApprove('pass')">通过</el-button>
      <el-button v-if="isApprover" type="danger" @click="handleApprove('reject')">驳回</el-button>
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
.fileBody {
  .fileName {
    width: 70%;
    font-size: 14px;
    span:hover {
      color: @link-hover;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  display: flex;
}
.projectDetial {
  width: 100%;
  .projectInfo {
    width: 80%;
    margin: 0 auto;
  }

  .projectInfo {
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
    .el-col {
      display: flex;
      height: 50px;
      line-height: 50px;
      text-align: center;
      div {
        border-top: 1px solid #000;
        border-left: 1px solid #000;
      }
      .title {
        width: 10rem;
        font-weight: bold;
      }
      .desc {
        width: 70%;
      }
    }
  }
}
.footer {
  width: 80%;
  margin: 10px auto 0 auto;
  text-align: center;
}
:deep(.el-collapse-item__title) {
  font-size: 16px;
  font-weight: 500;
}
:deep(.el-step__description) {
  display: flex;
  .leftBox {
    width: 50%;
  }
  .rightBox {
    width: 50%;
    height: 100%;
    .desc {
      height: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .status {
      height: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
:deep(.el-overlay) {
  :deep(.el-message-box) {
    .el-message-box__message {
      width: 100%;
      font-size: 16px !important;
    }
  }
}
:deep(.reject) .el-step__head {
  color: #ff4d4f !important;
  border-color: #ff4d4f !important;
}

:deep(.reject) .el-step__title {
  color: #ff4d4f !important;
}

:deep(.reject) .el-step__icon {
  background-color: #ff4d4f !important;
  color: white !important;
}

:deep(.reject) .el-step__description {
  color: #ff4d4f !important;
}
</style>
