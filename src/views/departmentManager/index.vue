<script setup>
import Operate from '@/components/operate/index.vue'
import { ref } from 'vue';

import AddFrom from './components/addFrom.vue';
import DeleteForm from './components/deleteForm.vue';
import UpdateForm from './components/updateForm.vue';

let dialogVisible = ref(false);
let View = ref(AddFrom)
let dialogTitle = ref('新增')
const addDepartment = () => {
  View.value = AddFrom
  dialogVisible.value = true;
}
</script>
<template>
  <Operate @add="addDepartment" />
  <el-dialog
   v-model="dialogVisible"
   :title="dialogTitle"
   width="60%"
   :before-close="addDialogBeforeClose"
   >
   <component :is="View"></component>
   </el-dialog>
</template>
<style lang="less" scoped></style>
