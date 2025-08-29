<script setup>
import { ref } from 'vue'

let isEdit = ref(false)
let demandeObj = ref({
  demandName: '需求名称',
  demandContent: '需求内容',
})

const editDemand = () => {
  console.log('修改')
  isEdit.value = true
}
const closeDemand = () => {
  console.log('关闭')
}
</script>
<template>
  <div class="chackBody" v-if="!isEdit">
    <div class="head">
      <div>{{ demandeObj.demandName }}</div>
    </div>
    <div class="content">
      <div>{{ demandeObj.demandContent }}</div>
    </div>
    <div class="footer">
      <div>
        <el-button type="primary" @click="editDemand">修改</el-button>
        <el-button type="danger" @click="closeDemand">关闭</el-button>
      </div>
    </div>
  </div>
  <div v-else>
    <el-input v-model="demandeObj.demandName" placeholder="请输入需求名称" />
    <el-input v-model="demandeObj.demandContent" type="textarea" placeholder="请输入需求内容" />
  </div>
</template>
<style lang="less" scoped></style>
