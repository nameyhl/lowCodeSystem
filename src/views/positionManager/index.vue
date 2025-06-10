<!-- 职位管理页面 -->
<script setup>
import Operate from '@/components/operate/index.vue'
import { ref } from 'vue';

import AddFrom from './components/addFrom.vue'

let dialogVisible = ref(false)
let dialogTitle = ref('')

let positionInfo = ref( {
  name: '',
  departmentId: '',
  leaderId: '',
})

let View = ref(null)

const openAdd = () => {
  dialogTitle.value = '添加职位'
  dialogVisible.value = true
  View.value = AddFrom
}

import { ElMessage } from 'element-plus';

import { addPosition } from '@/api/position.js';
const submitForm = (data, formRef, type) => {
  console.log(data, type);
  if (!formRef) return
  formRef.validate(async (valid) => {
    if (valid) {
      if (type == 'add') {
        await addPosition(data).then(res => {
          if (res.code == 200) {
            ElMessage.success('添加成功')
            closeDialog()
          }
        })
      }
    }
  })
  closeDialog()
}

const closeDialog = () => {
  dialogVisible.value = false
  View.value = null
  positionInfo.value = {
    name: '',
    departmentId: '',
    leaderId: '',
  }
}

</script>
<template>
  <Operate @add="openAdd" :showDelete="false"></Operate>

  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="30%"
    :before-close="closeDialog"
  >
    <component :is="View" :positionInfo="positionInfo" @close="closeDialog" @submit="submitForm"></component>
  </el-dialog>
</template>
<style lang="less" scoped></style>
