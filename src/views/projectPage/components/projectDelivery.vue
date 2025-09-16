<script setup>
import { ref, computed, onMounted } from 'vue'

const model = ref(sessionStorage.getItem('model') || 'PC')
import projectStore from '@/stores/modules/project'
const project = projectStore()
let projectInfo = computed(() => {
  return project.projectInfo
})
import userStore from '@/stores/modules/user'
const user = userStore().user

let demandByStatus = computed(() => {
  return project.demandByStatus
})

let file = computed(() => {
  return project.file[0]
})

// 开发驳回需求
let devRejectDemand = computed(() => {
  return demandByStatus.value.reject
})
// 测试未通过需求
let testRejectDemand = computed(() => {
  return demandByStatus.value.nopass
})
// 测试完成需求
let passDemand = computed(() => {
  return demandByStatus.value.pass
})
// 未开发需求
let noDevDemand = computed(() => {
  return demandByStatus.value.close.concat(demandByStatus.value.undeveloped)
})

import titleTag from '@/components/titleTag.vue'

let isShowCode = ref(false)
let showCode = () => {
  isShowCode.value = !isShowCode.value
}

import * as echart from 'echarts'
let demandeChart = ref(null)

const getStatus = (status) => {
  switch (status) {
    case 0:
      return '已关闭'
    case 1:
      return '未开发'
    case 2:
      return '开发中'
    case 3:
      return '已驳回'
    case 4:
      return '未测试'
    case 5:
      return '测试中'
    case 6:
      return '测试未通过'
    case 7:
      return '已完成'
    default:
      return '未知状态'
  }
}

const innitChart = () => {
  const myChart = echart.init(demandeChart.value)
  myChart.setOption({
    title: {
      text: '需求柱状图',
    },
    tooltip: {
      formatter: (params) => {
        let str = params.name + '<br>'
        params.data.data.forEach((item) => {
          str += item.name + '：' + getStatus(item.status) + '<br>'
        })
        return str
      },
    },
    legend: {},
    xAxis: {
      data: ['开发驳回', '测试未通过', '测试通过', '未开发'],
    },
    yAxis: {
      type: 'value',
      name: '完成度',
      position: 'left',
      axisLine: {
        show: true,
        lineStyle: {},
      },
    },
    series: [
      {
        name: '需求状态',
        type: 'bar',
        data: [
          { value: devRejectDemand.value.length, data: devRejectDemand.value },
          { value: testRejectDemand.value.length, data: testRejectDemand.value },
          { value: passDemand.value.length, data: passDemand.value },
          { value: noDevDemand.value.length, data: noDevDemand.value },
        ],
      },
    ],
  })
  myChart.resize()
}

import { getFileStream } from '@/api/file'
const chackFile = async (path) => {
  const res = await getFileStream(path)
  const blob = new Blob([res], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  window.open(url)
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

import { updateProjectStatus } from '@/api/project'
import { ElMessageBox } from 'element-plus'

const emits = defineEmits(['projectOver'])
const projectOver = async () => {
  ElMessageBox.confirm('确定项目交付吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await updateProjectStatus({
      id: projectInfo.value.id,
      status: projectInfo.value.status + 1,
    }).then((res) => {
      emits('projectOver')
    })
  })
}

onMounted(() => {
  innitChart()
})
</script>
<template>
  <div class="projectInfo">
    <titleTag>
      <div>项目信息</div>
    </titleTag>
    <div class="projectInfoBody">
      <el-row :gutters="20">
        <el-col :span="model == 'PC' ? 12 : 24">
          <div class="head">项目名称：</div>
          <div class="label">
            <span>{{ projectInfo.name }}</span>
          </div>
        </el-col>
        <el-col :span="model == 'PC' ? 12 : 24">
          <div class="head">项目领导：</div>
          <div class="label">
            <span>{{ projectInfo.leaderName }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutters="20">
        <el-col :span="model == 'PC' ? 12 : 24">
          <div class="head">项目编码：</div>
          <div class="label">
            <span
              >{{ isShowCode ? projectInfo.code : '****' }}
              <el-icon @click="showCode" v-if="isShowCode"><View /></el-icon>
              <el-icon @click="showCode" v-else><Hide /></el-icon
            ></span>
          </div>
        </el-col>
        <el-col :span="model == 'PC' ? 12 : 24">
          <div class="head">项目创建时间：</div>
          <div class="label">
            <span>{{ projectInfo.createTime }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutters="20">
        <el-col :span="model == 'PC' ? 12 : 24">
          <div class="head">项目前端地址：</div>

          <div class="label">
            <span>{{ projectInfo.frontCodeAddress }}</span>
          </div>
        </el-col>
        <el-col :span="model == 'PC' ? 12 : 24">
          <div class="head">项目后端地址：</div>
          <div class="label">
            <span>{{ projectInfo.backCodeAddress }}</span>
          </div>
        </el-col>
        <el-col :span="model == 'PC' ? 12 : 24"> </el-col>
      </el-row>
    </div>
    <div class="file">
      <titleTag>
        <div>文件信息</div>
      </titleTag>
      <div class="fileBody">
        <div class="list">
          <div class="listTitle">项目文件：</div>
          <div class="listBody">
            <span @click="chackFile(file.filePath)">{{ file.fileName }}</span>
          </div>
          <div class="exportButton">
            <el-button link type="primary" @click="exportFile(file.filePath, file.fileName)"
              >导出</el-button
            >
          </div>
        </div>
        <div class="list">
          <div class="listTitle">需求文档：</div>

          <div class="listBody">
            <span @click="chackFile(file.demandFilePath)">{{ file.demandFileName }}</span>
          </div>
          <div class="exportButton">
            <el-button link type="primary" @click="exportFile(file.filePath, file.fileName)"
              >导出</el-button
            >
          </div>
        </div>
        <div class="list">
          <div class="listTitle">开发文档：</div>
          <div class="listBody">
            <span @click="chackFile(file.devFilePath)">{{ file.devFileName }}</span>
          </div>
          <div class="exportButton">
            <el-button link type="primary" @click="exportFile(file.filePath, file.fileName)"
              >导出</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="chartBody">
      <titleTag>
        <div>需求图表</div>
      </titleTag>
      <div ref="demandeChart" class="chart"></div>
    </div>
  </div>
  <div class="footer" v-if="user.id == projectInfo.leaderId && projectInfo.status === 4">
    <el-button type="primary" @click="projectOver">完成交付</el-button>
  </div>
</template>
<style>
.projectInfoBody {
  margin: 10px 20px;
  text-align: center;
  .el-row {
    line-height: 30px;
    border-top: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
    .el-col {
      display: flex;
      div {
        border-left: 1px solid #e4e7ed;
        border-bottom: 1px solid #e4e7ed;
      }
      .head {
        width: 50%;
        font-weight: bold;
        font-size: 16px;
      }
      .label {
        width: 50%;
        font-size: 14px;
        /* 超出隐藏 */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.chart {
  width: 100%;
  height: 400px;
}
.file {
  margin: 10px 0;
  height: 100%;
  .fileBody {
    margin: 0 2rem;

    .list {
      height: 30px;
      line-height: 30px;
      display: flex;
      .listTitle {
        width: 100px;
        font-weight: bold;
        font-size: 16px;
      }
      .listBody {
        width: 40%;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span:hover {
          color: #ff0000;
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
  }
}
.footer {
  text-align: center;
}
</style>
