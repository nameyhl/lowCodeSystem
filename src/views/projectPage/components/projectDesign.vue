<script setup>
import { computed, ref, h, watch } from 'vue'
import { ElMessage, ElMessageBox, ElInput } from 'element-plus'
import projectStore from '@/stores/modules/project'
let project = projectStore()

let projectInfo = computed(() => {
  return project.projectInfo
})
let projectDemandList = computed(() => {
  return project.demandByStatus
})

let activeNames = ref(['1', '2', '3', '4', '5', '6'])

watch(
  () => projectDemandList,
  (newVal, oldVal) => {
    console.log(123)
  },
)
let undevelopedDemand = ref([]) // 未开发
let developingDemand = ref([]) // 开发中
let rejectDemand = ref([]) // 已驳回
let noTestDemand = ref([]) // 未测试
let nopassDemand = ref([]) // 测试未通过

let getDemand = () => {
  undevelopedDemand.value = projectDemandList.value.undeveloped
  developingDemand.value = projectDemandList.value.developing
  rejectDemand.value = projectDemandList.value.reject
  noTestDemand.value = projectDemandList.value.noTest
  nopassDemand.value = projectDemandList.value.nopass
}
getDemand()

import { updateDemandStatus } from '@/api/demand'

let rejectMsg = ref('')

const startDev = async (row) => {
  let data = {
    id: row.id,
    status: 2,
  }
  await updateDemandStatus(data).then(async (res) => {
    ElMessage.success('需求开始开发')
    await project.fetchDemand(projectInfo.value.id).then(() => {
      console.log(projectDemandList.value)
      getDemand()
    })
  })
}

const rejectDev = async (row) => {
  ElMessageBox({
    customClass: 'custom-message-box',
    title: '驳回理由',
    // Should pass a function if VNode contains dynamic props
    message: () =>
      h(ElInput, {
        modelValue: rejectMsg.value,
        'onUpdate:modelValue': (val) => {
          rejectMsg.value = val
        },
        placeholder: `请输入驳回理由`,
        type: 'textarea',
        minlength: 10,
        maxlength: 200,
        showWordLimit: true,
        style: { width: '400px' },
      }),
  }).then(async () => {
    if (!rejectMsg.value) {
      ElMessage.error('请输入驳回理由')
    } else {
      let data = {
        id: row.id,
        status: 3,
        rejectMsg: rejectMsg.value,
      }
      await updateDemandStatus(data).then(async (res) => {
        ElMessage.success('需求已驳回')
        await project.fetchDemand(projectInfo.value.id).then(() => {
          console.log(projectDemandList.value)
          getDemand()
        })
      })
      return
    }
  })
}

const chackDemand = (row) => {
  ElMessageBox({
    customClass: 'custom-message-box',
    title: '需求详情',
    message: () =>
      h('div', {}, [h('p', {}, `需求名称：${row.name}`), h('p', {}, `需求设计：${row.design}`)]),
  }).then(() => {
    console.log('查看需求详情')
  })
}

const chackReject = (row) => {
  ElMessageBox({
    customClass: 'custom-message-box',
    title: '驳回理由',
    message: () => h('div', {}, `驳回理由：${row.devReject}`),
  }).then(() => {
    console.log('查看驳回理由')
  })
}

const chackTestReject = (row) => {
  ElMessageBox({
    customClass: 'custom-message-box',
    title: '测试驳回理由',
    message: () => h('div', {}, `测试驳回理由：${row.testReject}`),
  }).then(() => {
    console.log('查看测试驳回理由')
  })
}
const overDev = async (row) => {
  let data = {
    id: row.id,
    status: 4,
  }
  await updateDemandStatus(data).then(async (res) => {
    ElMessage.success('需求已完成')
    await project.fetchDemand(projectInfo.value.id).then(() => {
      getDemand()
    })
  })
}

const restartDev = async (row) => {
  let data = {
    id: row.id,
    status: 1,
  }
  await updateDemandStatus(data).then(async (res) => {
    ElMessage.success('需求已重启')
    await project.fetchDemand(projectInfo.value.id).then(() => {
      getDemand()
    })
  })
}

let undevelopedColumns = [
  {
    type: 'index',
    width: '80px',
    label: '序号',
  },
  {
    prop: 'name',
    label: '需求名称',
  },
  {
    prop: 'design',
    label: '需求设计',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
  {
    prop: 'endTime',
    label: '剩余时间',
    aline: 'center',
    sortable: true,
  },
  {
    label: '操作',
    btnlist: [
      {
        label: '查看',
        type: 'success',
        click: chackDemand,
      },
      {
        label: '开发',
        type: 'primary',
        click: startDev,
      },
      {
        label: '驳回',
        type: 'danger',
        click: rejectDev,
      },
    ],
  },
]

let developingColumns = [
  {
    type: 'index',
    width: '80px',
    label: '序号',
  },
  {
    prop: 'name',
    label: '需求名称',
  },
  {
    prop: 'design',
    label: '需求设计',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
  {
    prop: 'endTime',
    label: '剩余时间',
    aline: 'center',
    sortable: true,
  },
  {
    label: '操作',
    btnlist: [
      {
        label: '查看',
        type: 'success',
        click: chackDemand,
      },
      {
        label: '完成',
        type: 'warning',
        click: overDev,
      },
    ],
  },
]

let rejectColumns = [
  {
    type: 'index',
    width: '80px',
    label: '序号',
  },
  {
    prop: 'name',
    label: '需求名称',
  },
  {
    prop: 'design',
    label: '需求设计',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
  {
    prop: 'endTime',
    label: '剩余时间',
    aline: 'center',
    sortable: true,
  },
  {
    label: '操作',
    btnlist: [
      {
        label: '查看',
        type: 'success',
        click: chackReject,
      },
      {
        label: '重启',
        type: 'primary',
        click: restartDev,
      },
    ],
  },
]

let noTestColumns = [
  {
    type: 'index',
    width: '80px',
    label: '序号',
  },
  {
    prop: 'name',
    label: '需求名称',
  },
  {
    prop: 'design',
    label: '需求设计',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
  {
    prop: 'endTime',
    label: '剩余时间',
    aline: 'center',
    sortable: true,
  },
  {
    label: '操作',
    btnlist: [
      {
        label: '查看',
        type: 'success',
        click: chackDemand,
      },
    ],
  },
]

let nopassColumns = [
  {
    type: 'index',
    width: '80px',
    label: '序号',
  },
  {
    prop: 'name',
    label: '需求名称',
  },
  {
    prop: 'design',
    label: '需求设计',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
  {
    prop: 'endTime',
    label: '剩余时间',
    aline: 'center',
    sortable: true,
  },
  {
    label: '操作',
    btnlist: [
      {
        label: '查看',
        type: 'success',
        click: chackTestReject,
      },
    ],
  },
]

// 获取剩余时间
const getRemainingTime = (endTime) => {
  let timer = new Date(endTime) - new Date()

  if (timer < 0) {
    return '已过期'
  }

  let day = Math.floor(timer / 1000 / 60 / 60 / 24)

  return day
}

let showInput1 = ref(false)
let designAddress = ref('')
let showInput2 = ref(false)
let frontCodeAddress = ref('')
let showInput3 = ref(false)
let backCodeAddress = ref('')

import { updateProjectAdress } from '@/api/project'

const handleAddAddress = async (type, status) => {
  if (status === 'input') {
    type === 1 ? (showInput1.value = true) : ''
    type === 2 ? (showInput2.value = true) : ''
    type === 3 ? (showInput3.value = true) : ''
  }
  if (status === 'submit') {
    type === 1 ? (showInput1.value = false) : ''
    type === 2 ? (showInput2.value = false) : ''
    type === 3 ? (showInput3.value = false) : ''
    let data = {
      id: projectInfo.value.id,
      designAddress: designAddress.value,
      frontCodeAddress: frontCodeAddress.value,
      backCodeAddress: backCodeAddress.value,
    }
    await updateProjectAdress(data).then(() => {
      project.fetchProjectInfo(projectInfo.value.id)
    })
  }
}

import { updateProjectStatus } from '@/api/project'
const startTest = async () => {
  let data = {
    id: projectInfo.value.id,
    status: projectInfo.value.status + 1,
  }
  await updateProjectStatus(data).then(() => {
    project.fetchProjectInfo(projectInfo.value.id)
  })
}
</script>
<template>
  <div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="开发/设计地址" name="1">
        <div class="designAndDevAddress">
          <div class="title">设计地址</div>
          <div class="content" v-if="projectInfo.designAddress">
            {{ projectInfo.designAddress }}
          </div>
          <div class="content" v-else>
            <div style="margin-right: 10px" v-if="!showInput1">暂无设计地址</div>
            <el-input v-model="designAddress" placeholder="请输入设计地址" v-else></el-input>
            <div v-if="!showInput1">
              <el-button type="primary" link @click="handleAddAddress(1, 'input')">
                <el-icon><Plus /></el-icon>
              </el-button>
            </div>
            <div v-else>
              <el-button type="primary" link @click="handleAddAddress(1, 'submit')">
                <el-icon><Check /></el-icon>
              </el-button>
            </div>
          </div>
          <!-- 前端代码地址 -->
          <div class="title">前端代码地址</div>
          <div class="content" v-if="projectInfo.frontCodeAddress">
            {{ projectInfo.frontCodeAddress }}
          </div>
          <div class="content" v-else>
            <div style="margin-right: 10px" v-if="!showInput2">暂无前端代码地址</div>
            <el-input v-model="frontCodeAddress" placeholder="请输入前端代码地址" v-else></el-input>
            <div v-if="!showInput2">
              <el-button type="primary" link @click="handleAddAddress(2, 'input')">
                <el-icon><Plus /></el-icon>
              </el-button>
            </div>
            <div v-else>
              <el-button type="primary" link @click="handleAddAddress(2, 'submit')">
                <el-icon><Check /></el-icon>
              </el-button>
            </div>
          </div>
          <!-- 后端代码地址 -->
          <div class="title">后端代码地址</div>
          <div class="content" v-if="projectInfo.backCodeAddress">
            {{ projectInfo.backCodeAddress }}
          </div>
          <div class="content" v-else>
            <div style="margin-right: 10px" v-if="!showInput3">暂无后端代码地址</div>
            <el-input v-model="backCodeAddress" placeholder="请输入后端代码地址" v-else></el-input>

            <div v-if="!showInput3">
              <el-button type="primary" link @click="handleAddAddress(3, 'input')">
                <el-icon><Plus /></el-icon>
              </el-button>
            </div>
            <div v-else>
              <el-button type="primary" link @click="handleAddAddress(3, 'submit')">
                <el-icon><Check /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="未开发需求" name="2">
        <el-table :data="undevelopedDemand" show-overflow-tooltip style="width: 100%">
          <el-table-column
            v-for="item in undevelopedColumns"
            :key="item.prop"
            :width="item?.width"
            align="center"
            :sortable="item?.sortable"
            :type="item?.type"
            :prop="item.prop"
            :label="item.label"
          >
            <template #default="scope">
              <template v-if="item.prop === 'endTime'">
                <div :class="getRemainingTime(scope.row.endTime) < 7 ? 'error' : ''">
                  {{ getRemainingTime(scope.row.endTime) }}
                </div>
              </template>
              <el-button-group v-if="item.btnlist">
                <el-button
                  v-for="btn in item.btnlist"
                  :key="btn.label"
                  :type="btn.type"
                  link
                  @click="btn.click(scope.row)"
                >
                  {{ btn.label }}
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="开发中需求" name="3">
        <el-table :data="developingDemand" show-overflow-tooltip style="width: 100%">
          <el-table-column
            v-for="item in developingColumns"
            :key="item.prop"
            :width="item?.width"
            align="center"
            :sortable="item?.sortable"
            :type="item?.type"
            :prop="item.prop"
            :label="item.label"
          >
            <template #default="scope">
              <template v-if="item.prop === 'endTime'">
                <div :class="getRemainingTime(scope.row.endTime) < 7 ? 'error' : ''">
                  {{ getRemainingTime(scope.row.endTime) }}
                </div>
              </template>
              <el-button-group v-if="item.btnlist">
                <el-button
                  v-for="btn in item.btnlist"
                  :key="btn.label"
                  :type="btn.type"
                  link
                  @click="btn.click(scope.row)"
                >
                  {{ btn.label }}
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="已驳回需求" name="4">
        <el-table :data="rejectDemand" show-overflow-tooltip style="width: 100%">
          <el-table-column
            v-for="item in rejectColumns"
            :key="item.prop"
            :width="item?.width"
            align="center"
            :sortable="item?.sortable"
            :type="item?.type"
            :prop="item.prop"
            :label="item.label"
          >
            <template #default="scope">
              <template v-if="item.prop === 'endTime'">
                <div :class="getRemainingTime(scope.row.endTime) < 7 ? 'error' : ''">
                  {{ getRemainingTime(scope.row.endTime) }}
                </div>
              </template>
              <el-button-group v-if="item.btnlist">
                <el-button
                  v-for="btn in item.btnlist"
                  :key="btn.label"
                  :type="btn.type"
                  link
                  @click="btn.click(scope.row)"
                >
                  {{ btn.label }}
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="已完成需求" name="5">
        <el-table :data="noTestDemand" show-overflow-tooltip style="width: 100%">
          <el-table-column
            v-for="item in noTestColumns"
            :key="item.prop"
            :width="item?.width"
            align="center"
            :sortable="item?.sortable"
            :type="item?.type"
            :prop="item.prop"
            :label="item.label"
          >
            <template #default="scope">
              <template v-if="item.prop === 'endTime'">
                <div :class="getRemainingTime(scope.row.endTime) < 7 ? 'error' : ''">
                  {{ getRemainingTime(scope.row.endTime) }}
                </div>
              </template>
              <el-button-group v-if="item.btnlist">
                <el-button
                  v-for="btn in item.btnlist"
                  :key="btn.label"
                  :type="btn.type"
                  link
                  @click="btn.click(scope.row)"
                >
                  {{ btn.label }}
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="未通过需求" name="6">
        <el-table :data="nopassDemand" show-overflow-tooltip style="width: 100%">
          <el-table-column
            v-for="item in nopassColumns"
            :key="item.prop"
            :width="item?.width"
            align="center"
            :sortable="item?.sortable"
            :type="item?.type"
            :prop="item.prop"
            :label="item.label"
          >
            <template #default="scope">
              <template v-if="item.prop === 'endTime'">
                <div :class="getRemainingTime(scope.row.endTime) < 7 ? 'error' : ''">
                  {{ getRemainingTime(scope.row.endTime) }}
                </div>
              </template>
              <el-button-group v-if="item.btnlist">
                <el-button
                  v-for="btn in item.btnlist"
                  :key="btn.label"
                  :type="btn.type"
                  link
                  @click="btn.click(scope.row)"
                >
                  {{ btn.label }}
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <div class="footer">
      <el-button type="primary" @click="startTest">开始测试</el-button>
    </div>
  </div>
</template>
<style lang="less" scoped>
.designAndDevAddress {
  .title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
  .content {
    font-size: 14px;
    color: #666;
    display: flex;
    height: 30px;
    line-height: 30px;
    align-items: center;

    button {
      padding: 0;
    }
  }
}
.error {
  color: red;
}

:deep(.el-collapse-icon-position-right .el-collapse-item__header) {
  padding: 0 8px;
  background: @primary-red;
  color: #fff;
}
.footer {
  padding-top: 10px;
  text-align: center;
}
:deep(.el-popper.is-dark) {
  display: none;
}
</style>
