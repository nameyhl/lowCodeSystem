<script setup>
import { ref, computed, onMounted } from 'vue'
import projectStore from '@/stores/modules/project'
const project = projectStore()
let projectInfo = project.projectInfo
import userStore from '@/stores/modules/user'
const user = userStore()

let demandByStatus = computed(() => {
  return project.demandByStatus
})

// 开发驳回需求
let devRejectDemand = computed(() => {
  return demandByStatus.value.reject.length
})
// 测试未通过需求
let testRejectDemand = computed(() => {
  return demandByStatus.value.nopass.length
})
// 测试完成需求
let passDemand = computed(() => {
  return demandByStatus.value.pass.length
})
// 关闭需求
let closeDemand = computed(() => {
  return demandByStatus.value.close.length
})

console.log(devRejectDemand.value, testRejectDemand.value, passDemand.value, closeDemand.value)

import titleTag from '@/components/titleTag.vue'

let isShowCode = ref(false)
let showCode = () => {
  isShowCode.value = !isShowCode.value
}

import * as echart from 'echarts'
let demandeChart = ref(null)

const innitChart = () => {
  const myChart = echart.init(demandeChart.value)
  myChart.setOption({
    title: {
      text: '需求柱状图',
    },
    tooltip: {},
    legend: {},
    xAxis: {
      data: ['开发驳回', '测试未通过', '测试通过', '关闭'],
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
        data: [devRejectDemand.value, testRejectDemand.value, passDemand.value, closeDemand.value],
      },
    ],
  })
  myChart.resize()
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
        <el-col :span="6">
          <div class="head">项目名称：</div>
        </el-col>
        <el-col :span="6">
          <div class="label">
            <span>{{ projectInfo.name }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="head">项目领导：</div>
        </el-col>
        <el-col :span="6">
          <div class="label">
            <span>{{ projectInfo.leaderName }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutters="20">
        <el-col :span="6">
          <div class="head">项目编码：</div>
        </el-col>
        <el-col :span="6">
          <div class="label">
            <span
              >{{ isShowCode ? projectInfo.code : '****' }}
              <el-icon @click="showCode" v-if="isShowCode"><View /></el-icon>
              <el-icon @click="showCode" v-else><Hide /></el-icon
            ></span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="head">项目创建时间：</div>
        </el-col>
        <el-col :span="6">
          <div class="label">
            <span>{{ projectInfo.createTime }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutters="20">
        <el-col :span="6">
          <div class="head">项目前端地址：</div>
        </el-col>
        <el-col :span="6">
          <div class="label">
            <span>{{ projectInfo.frontCodeAddress }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="head">项目后端地址：</div>
        </el-col>
        <el-col :span="6">
          <div class="label">
            <span>{{ projectInfo.backCodeAddress }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="chartBody">
      <titleTag>
        <div>需求图表</div>
      </titleTag>
      <div ref="demandeChart" class="chart"></div>
    </div>
  </div>
</template>
<style>
.projectInfoBody {
  margin: 10px 20px;
  border-top: 1px solid #e4e7ed;
  text-align: center;
  .el-row {
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
    .el-col {
      border-left: 1px solid #e4e7ed;
      .head {
        font-weight: bold;
        font-size: 16px;
      }
      .label {
        font-size: 14px;
      }
    }
  }
}
.chart {
  width: 100%;
  height: 400px;
}
</style>
