<script setup>
import { ElMessageBox, ElInput } from 'element-plus'
import { computed, ref, h } from 'vue'

const props = defineProps({
  projectInfo: {
    type: Object,
    default: () => {},
  },
  isApprover: {
    type: Boolean,
    default: false,
  },
})

console.log(props.isApprover)

const isApprover = ref(props.isApprover)
let projectInfo = ref(props.projectInfo)

let process = ref([
  {
    title: '项目提交',
    startTime: projectInfo.value.projectCreateTime,
    endTime: projectInfo.value.projectCreateTime,
    submitUser: projectInfo.value.leaderName,
  },
  {
    title: '部门审批',
    startTime: projectInfo.value.projectCreateTime,
    desc: projectInfo.value.step1Message,
    endTime: projectInfo.value.step1EndTime,
    submitUser: projectInfo.value.departmentLeaderName,
  },
  {
    title: '公司负责人审批',
    startTime: projectInfo.value.step1EndTime,
    desc: projectInfo.value.step2Message,
    endTime: projectInfo.value.step2EndTime,
    submitUser: projectInfo.value.frimLeaderName,
  },
  {
    title: '项目完成',
    startTime: projectInfo.value.step2EndTime,
  },
])
let active = ref(projectInfo.value.stepNum)

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

const emit = defineEmits(['changeView'])
const handleClick = () => {
  emit('changeView', 1)
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
  let boxTitle = status === 'pass' ? '审批建议' : '不合格情况'
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
        style: 'width: 100%',
      }),
  })
    .then(async () => {
      let data = {
        stepMsg: message.value,
        states: status,
        id: projectInfo.value.projectId,
        stepNum: projectInfo.value.stepNum,
      }
      console.log(data)

      await updateProject(data).then((res) => console.log(res))
    })
    .catch(() => {
      console.log('取消')
    })
}
</script>
<template>
  <div>
    <div class="top">
      <div class="goBack" @click="handleClick"><< 返回项目列表</div>
    </div>
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
                <div class="desc">{{ projectInfo.projectCode }}</div>
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
        <el-collapse-item title="项目进度" name="2">
          <div class="projectProcess">
            <div style="height: 300px; max-width: 600px">
              <el-steps direction="vertical" :active="active">
                <el-step v-for="item in process" :title="item.title" :key="item.title">
                  <template #description>
                    <div class="leftBox">
                      <div class="time">提交时间：{{ item.startTime }}</div>
                      <div class="user" v-if="item.submitUser">审批人：{{ item.submitUser }}</div>
                      <div class="time" v-if="item.endTime">结束时间：{{ item.endTime }}</div>
                    </div>
                    <div class="rightBox">
                      <div class="desc" v-if="item.desc">审批建议：{{ item.desc }}</div>
                    </div>
                  </template>
                </el-step>
              </el-steps>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="项目描述" name="3">
          <div class="projectDesc">
            <div class="desc">{{ projectInfo.msg }}</div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="项目附件" name="4"> </el-collapse-item>
      </el-collapse>
    </div>
    <div class="footer">
      <el-button v-if="isApprover" type="primary" @click="handleApprove('pass')">通过</el-button>
      <el-button v-if="isApprover" type="danger" @click="handleApprove('reject')">拒绝</el-button>
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  .rightBox {
    height: 100%;
    .desc {
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .time {
      height: 100%;
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
</style>
