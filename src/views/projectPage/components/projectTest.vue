<script setup>
import { computed, ref, h } from 'vue'
import projectStore from '@/stores/modules/project'
let project = projectStore()
import userStore from '@/stores/modules/user'
import { ElMessageBox, ElMessage, ElInput } from 'element-plus'
import { updateDemandStatus } from '@/api/demand'
import { updateProjectStatus } from '@/api/project'
let user = userStore().user
let projectInfo = computed(() => {
  return project.projectInfo
})
let demandByStatus = computed(() => {
  return project.demandByStatus
})
// 获取剩余时间
const getRemainingTime = (endTime) => {
  let timer = new Date(endTime) - new Date()

  if (timer < 0) {
    return '已过期'
  }

  let day = Math.floor(timer / 1000 / 60 / 60 / 24)

  return day
}

let noTestDemand = ref([])
let testingDemand = ref([])
let nopassDemand = ref([])
let passDemand = ref([])

const getDemand = () => {
  noTestDemand.value = demandByStatus.value.noTest
  testingDemand.value = demandByStatus.value.testing
  nopassDemand.value = demandByStatus.value.nopass
  passDemand.value = demandByStatus.value.pass
}
getDemand()

let activeNames = ref(['1', '2', '3', '4'])

const startTest = (row) => {
  let data = {
    id: row.id,
    status: 5,
  }
  updateDemandStatus(data).then((res) => {
    project.fetchDemand(projectInfo.value.id).then(() => {
      getDemand()
    })
    ElMessage({
      message: '测试开始',
      type: 'success',
    })
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

const passTest = (row) => {
  let data = {
    id: row.id,
    status: 7,
  }
  updateDemandStatus(data).then((res) => {
    project.fetchDemand(projectInfo.value.id).then(() => {
      getDemand()
    })
    ElMessage({
      message: '测试通过',
      type: 'success',
    })
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

let rejectMsg = ref('')
const rejectTest = (row) => {
  ElMessageBox({
    customClass: 'custom-message-box',
    title: '驳回理由',
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
    let data = {
      id: row.id,
      status: 6,
      rejectMsg: rejectMsg.value,
    }
    console.log(data)

    await updateDemandStatus(data).then((res) => {
      project.fetchDemand(projectInfo.value.id).then(() => {
        getDemand()
      })
      ElMessage({
        message: '测试驳回',
        type: 'success',
      })
    })
  })
}

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
    label: '剩余时间(天)',
    aline: 'center',
    sortable: true,
  },
  {
    label: '操作',
    btnList: [
      {
        label: '测试',
        type: 'primary',
        click: startTest,
      },
      {
        label: '查看',
        type: 'success',
        click: chackDemand,
      },
    ],
  },
]

let testingColumns = [
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
    label: '剩余时间(天)',
  },
  {
    label: '操作',
    btnList: [
      {
        label: '查看',
        type: 'success',
        click: chackDemand,
      },
      {
        label: '通过',
        type: 'primary',
        click: passTest,
      },
      {
        label: '驳回',
        type: 'danger',
        click: rejectTest,
      },
    ],
  },
]

let passTestColumns = [
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
    label: '剩余时间(天)',
  },
  {
    label: '操作',
    btnList: [
      {
        label: '查看',
        type: 'success',
        click: chackDemand,
      },
    ],
  },
]

let rejectTestColumns = [
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
    label: '剩余时间(天)',
  },
  {
    label: '操作',
    btnList: [
      {
        label: '查看',
        type: 'success',
        click: chackTestReject,
      },
    ],
  },
]

const testOver = () => {
  updateProjectStatus({
    id: projectInfo.value.id,
    status: projectInfo.value.status + 1,
  }).then((res) => {
    project.fetchProjectInfo(projectInfo.value.id)
    ElMessage({
      message: '测试完成',
      type: 'success',
    })
  })
}
</script>
<template>
  <el-collapse v-model="activeNames" @change="handleChange">
    <el-collapse-item title="未测试需求" name="1">
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
            <el-button-group v-if="item.btnList">
              <el-button
                v-for="btn in item.btnList"
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
    <el-collapse-item title="测试中需求" name="2">
      <el-table :data="testingDemand" show-overflow-tooltip style="width: 100%">
        <el-table-column
          v-for="item in testingColumns"
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
            <el-button-group v-if="item.btnList">
              <el-button
                v-for="btn in item.btnList"
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
    <el-collapse-item title="驳回测试需求" name="4">
      <el-table :data="nopassDemand" show-overflow-tooltip style="width: 100%">
        <el-table-column
          v-for="item in rejectTestColumns"
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
            <el-button-group v-if="item.btnList">
              <el-button
                v-for="btn in item.btnList"
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
    <el-collapse-item title="测试通过需求" name="3">
      <el-table :data="passDemand" show-overflow-tooltip style="width: 100%">
        <el-table-column
          v-for="item in passTestColumns"
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
            <el-button-group v-if="item.btnList">
              <el-button
                v-for="btn in item.btnList"
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
    <el-button type="primary" @click="testOver">测试完成</el-button>
  </div>
</template>
<style lang="less" scoped>
.footer {
  margin-top: 10px;
  text-align: center;
}
:deep(.el-popper.is-dark) {
  display: none;
}
:deep(.el-collapse-item__header) {
  padding: 0 8px;
  background: @primary-red;
  color: #fff;
}
</style>
