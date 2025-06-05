<script setup>
import { ref } from 'vue';
import { addUser } from '@/api/user.js';

import Operate from '@/components/operate/index.vue'

import AddFrom from './components/addFrom.vue';
import DeleteForm from './components/deleteForm.vue';
import UpdateForm from './components/updateForm.vue';
const addDialogVisible = ref(false);

let View = ref(AddFrom)

const addEmployee = async () => {
  View.value = AddFrom
  addDialogVisible.value = true;
}

const deleteEmployee = async () => {
  View.value = DeleteForm
  addDialogVisible.value = true;
}

const closeDialog = () => {
  addDialogVisible.value = false;
  View.value = null
}

const submitDialog = async (data, form, type) => {
  console.log(data)
  if(!form) return
  form.validate(async (valid) => {
    if (valid) {
      if(type === 'add') {
        await addUser(data).then(res => {
          ElMessage({
            message: '新增成功',
            type: 'success',
          })
          addDialogVisible.value = false;
          View.value = null
        })
      }
    }else{
      console.log('error submit!!');
    }
  })


}

</script>
<template>
  <Operate @add="addEmployee" @delete="deleteEmployee"></Operate>
  <!-- 新增弹框 -->
   <el-dialog
   v-model="addDialogVisible"
   title="新增"
   width="60%"
   :before-close="addDialogBeforeClose"
   >
   <component :is="View" @close="closeDialog" @submit="submitDialog"></component>
   </el-dialog>
</template>
<style lang="less" scoped></style>
