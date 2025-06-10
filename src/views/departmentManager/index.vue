<!-- 部门管理页面 -->
<script setup>
import Operate from '@/components/operate/index.vue'
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

import AddFrom from './components/addFrom.vue';
import DeleteForm from './components/deleteForm.vue';
import UpdateForm from './components/updateForm.vue';
import ChackInfo from './components/chackInfo.vue'

import { addDepartment, getDepartmentList, updateDepartment, deleteDepartment } from '@/api/department';

let tableLoading = ref(true)

let departmentList = ref([])
const getDepartement = async () => {
  departmentList.value = []
  await getDepartmentList().then(res => {
    departmentList.value = res.data
    tableLoading.value = false
  })
}
getDepartement()

let columns = [
  {
    prop: 'name',
    label: '部门名称',
  },
  {
    prop: 'leaderName',
    label: '部门负责人',
  },
  {
    prop: 'frimName',
    label: '所属分公司名称',
  }
]
let departmentInfo = ref({})
let dialogVisible = ref(false);
let View = ref(AddFrom)
let dialogTitle = ref('新增')
const openAdd = () => {
  dialogTitle.value = '新增'
  View.value = AddFrom
  departmentInfo.value = {
    name: '',
    leader: '',
    frim: '',
    msg: '',
  }
  dialogVisible.value = true;
}

const chackDepartment = (data) => {
  dialogTitle.value = '查看'
  View.value = ChackInfo
  dialogVisible.value = true;
  departmentInfo.value = data
}

const updateDepartmentDialog = (data) => {
  dialogTitle.value = '修改'
  View.value = UpdateForm
  departmentInfo.value = data
  dialogVisible.value = true;
}

const deleteDepartmentDialog = (data) => {
  dialogTitle.value = '删除'
  View.value = DeleteForm
  departmentInfo.value = data
  dialogVisible.value = true;
}
const submitClose = async (data, form, type) => {
  if(type === 'delete') {
    await deleteDepartment({ id: data.id }).then(res => {
      ElMessage({
        message: `删除${data.name}成功`,
        type:'success',
      })
      getDepartement()
      dialogVisible.value = false;
      departmentInfo.value = {
        name: '',
        leader: '',
        frim: '',
        msg: '',
      }
    })
    return
  }
  if(!form) {
    return
  }
  form.validate(async (valid) => {
    if(valid) {
      if(type === 'add') {
        await addDepartment(data).then(res => {
          ElMessage({
            message: '新增成功',
            type:'success',
          })
          getDepartement()
        })
      }
      if(type === 'update') {
        await updateDepartment(data).then(res => {
          ElMessage({
            message: '修改成功',
            type:'success',
          })
          getDepartement()
        })
      }
      dialogVisible.value = false;
      departmentInfo.value = {
        name: '',
        leader: '',
        frim: '',
        msg: '',
      }
      dialogTitle.value = '';
    }else{
      console.log('error submit!!');
    }
  })
}

const closeDialog = () => {
  dialogVisible.value = false;
  View.value = null;
  dialogTitle.value = '';
  departmentInfo.value = {
    name: '',
    leader: '',
    frim: '',
    msg: '',
  }
}
</script>
<template>
  <Operate @add="openAdd" :showDelete="false" />
  <el-table v-loading="tableLoading" :data="departmentList" :columns="columns" border style="width: 100%; margin-top: 10px;">
    <el-table-column type="index" align="center" label="序号" width="100"></el-table-column>
    <el-table-column v-for="item in columns" :prop="item.prop" :label="item.label">
      <template #default="scope">
        <span v-if="scope.row[item.prop]">{{ scope.row[item.prop] }}</span>
        <span style="color: red;" v-else>暂未分配</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作">
      <template #default="scope">
        <el-button type="primary" size="mini" link @click="chackDepartment(scope.row)">查看</el-button>
        <el-button type="primary" size="mini" link @click="updateDepartmentDialog(scope.row)">修改</el-button>
        <el-button type="primary" size="mini" link @click="deleteDepartmentDialog(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
   v-model="dialogVisible"
   :title="dialogTitle"
   width="60%"
   :before-close="closeDialog"
   >
   <component :is="View" @close="closeDialog" @submit="submitClose" :departmentInfo="departmentInfo"></component>
   </el-dialog>
</template>
<style lang="less" scoped></style>
