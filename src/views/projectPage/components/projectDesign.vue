<script>
import { ref } from 'vue'
import projectStore from '@/stores/modules/project'
const projectInfo = projectStore().projectInfo

let activeNames = ref(['1', '2', '3', '4'])

import { getDemandListGroupByStatus } from '@/api/demand'
// 获取项目需求列表
const getProjectDemandList = async () => {
  console.log(123)

  await getDemandListGroupByStatus({
    id: projectInfo.id,
  }).then((res) => {
    let demandList = res.data
    for (let key in demandList) {
      demandList[key].forEach((item) => {
        item.remainingTime = getRemainingTime(item.endTime)
      })
    }
    console.log(demandList)
  })
}
getProjectDemandList()

// 获取剩余时间
const getRemainingTime = (endTime) => {
  let timer = new Date(endTime) - new Date()

  if (timer < 0) {
    return '已过期'
  }

  let day = Math.floor(timer / 1000 / 60 / 60 / 24)

  return day + '天'
}
</script>
<template>
  <div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <!-- <el-collapse-item title="设计" name="1"> -->
      <!-- 设计地址 -->
      <!-- <div class="title">设计地址</div> -->
      <!-- <div class="content">{{ projectInfo.designAddress }}</div> -->
      <!-- 前端代码地址 -->
      <!-- <div class="title">前端代码地址</div> -->
      <!-- <div class="content">{{ projectInfo.frontCodeAddress }}</div> -->
      <!-- 后端代码地址 -->
      <!-- <div class="title">后端代码地址</div> -->
      <!-- <div class="content">{{ projectInfo.backCodeAddress }}</div> -->
      <!-- </el-collapse-item> -->
      <el-collapse-item title="未开发需求" name="2"></el-collapse-item>
      <el-collapse-item title="已开发需求" name="3"></el-collapse-item>
      <el-collapse-item title="已驳回需求" name="4"></el-collapse-item>
    </el-collapse>
  </div>
</template>
<style></style>
