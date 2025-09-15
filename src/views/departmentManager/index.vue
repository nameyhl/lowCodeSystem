<!-- 部门管理页面 -->
<script setup>
import Operate from '@/components/operate/index.vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

import AddFrom from './components/addFrom.vue'
import DeleteForm from './components/deleteForm.vue'
import UpdateForm from './components/updateForm.vue'
import ChackInfo from './components/chackInfo.vue'

import {
  addDepartment,
  getDepartmentList,
  updateDepartment,
  deleteDepartment,
} from '@/api/department'

let tableLoading = ref(true)

let model = ref(sessionStorage.getItem('model'))

// 分页
let page = ref(1)
let size = ref(10)
let total = ref(0)

let searchForm = ref({
  name: '',
  frimId: '',
})
let departmentList = ref([])
const getDepartement = async () => {
  departmentList.value = []
  let params = {
    page: page.value,
    size: size.value,
    name: searchForm.value.name,
    frimId: searchForm.value.frimId,
  }
  await getDepartmentList(params).then((res) => {
    departmentList.value = res.data.data
    tableLoading.value = false
    total.value = res.data.total
  })
}
getDepartement()

const handleSizeChange = (val) => {
  size.value = val
  getDepartement()
}

const handleCurrentChange = (val) => {
  page.value = val
  getDepartement()
}

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
  },
]
let departmentInfo = ref({})
let dialogVisible = ref(false)
let View = ref(AddFrom)
let dialogTitle = ref('新增')
const openAdd = () => {
  dialogTitle.value = '新增'
  View.value = AddFrom
  dialogVisible.value = true
}

const chackDepartment = (data) => {
  dialogTitle.value = '查看'
  View.value = ChackInfo
  dialogVisible.value = true
  departmentInfo.value = data
}

const updateDepartmentDialog = (data) => {
  dialogTitle.value = '修改'
  View.value = UpdateForm
  departmentInfo.value = { ...data }
  dialogVisible.value = true
}

const deleteDepartmentDialog = (data) => {
  dialogTitle.value = '删除'
  View.value = DeleteForm
  departmentInfo.value = data
  dialogVisible.value = true
}
const submitClose = async (data, form, type) => {
  if (type === 'delete') {
    await deleteDepartment({ id: data.id }).then((res) => {
      ElMessage({
        message: `删除${data.name}成功`,
        type: 'success',
      })
      getDepartement()
      dialogVisible.value = false
      departmentInfo.value = {
        name: '',
        leaderId: '',
        frimId: '',
        msg: '',
      }
    })
    return
  }
  if (!form) {
    return
  }
  form.validate(async (valid) => {
    if (valid) {
      if (type === 'add') {
        await addDepartment(data).then((res) => {
          ElMessage({
            message: '新增成功',
            type: 'success',
          })
          getDepartement()
        })
      }
      if (type === 'update') {
        await updateDepartment(data).then((res) => {
          ElMessage({
            message: '修改成功',
            type: 'success',
          })
          getDepartement()
        })
      }
      dialogVisible.value = false
      departmentInfo.value = {
        name: '',
        leaderId: '',
        frimId: '',
        msg: '',
      }
      dialogTitle.value = ''
    } else {
      console.log('error submit!!')
    }
  })
}

const closeDialog = () => {
  dialogVisible.value = false
  View.value = null
  dialogTitle.value = ''
  departmentInfo.value = {
    name: '',
    leaderId: '',
    frimId: '',
    msg: '',
  }
}

let frimList = ref([])
import { getFrimList } from '@/api/frim'
const getFrim = async () => {
  frimList.value = []
  await getFrimList().then((res) => {
    res.data.forEach((item) => {
      frimList.value.push({
        label: item.name,
        value: item.id,
      })
    })
  })
}

getFrim()
</script>
<template>
  <Operate @add="openAdd" :showDelete="false">
    <template #addName>添加部门</template>
    <template #searchFrom>
      <el-form :inline="model === 'PC'" :model="searchForm" class="demo-form-inline">
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入部门名称"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="分公司名称" prop="frimId">
          <el-select
            v-model="searchForm.frimId"
            placeholder="请选择分公司名称"
            style="width: 200px"
          >
            <el-option v-for="item in frimList" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getDepartement">查询</el-button>
        </el-form-item>
      </el-form>
    </template>
  </Operate>
  <div class="tableBox">
    <el-table
      v-loading="tableLoading"
      :data="departmentList"
      :columns="columns"
      border
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column type="index" align="center" label="序号" width="100"></el-table-column>
      <el-table-column v-for="item in columns" :prop="item.prop" :label="item.label">
        <template #default="scope">
          <span v-if="scope.row[item.prop]">{{ scope.row[item.prop] }}</span>
          <span style="color: red" v-else>暂未分配</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button type="primary" size="mini" link @click="chackDepartment(scope.row)"
            >查看</el-button
          >
          <el-button type="primary" size="mini" link @click="updateDepartmentDialog(scope.row)"
            >修改</el-button
          >
          <el-button type="primary" size="mini" link @click="deleteDepartmentDialog(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div>
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="size"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next"
      :total="total"
      :pager-count="5"
      :size="model === 'PC' ? 'medium' : 'small'"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="60%" :before-close="closeDialog">
    <component
      :is="View"
      @close="closeDialog"
      @submit="submitClose"
      :departmentInfo="departmentInfo"
    ></component>
  </el-dialog>
</template>
<style lang="less" scoped>
@import './less/mobile.less';
@media (min-width: 1024px) {
  @import './less/desktop.less';
}
@media (min-width: 768px) {
  @import './less/tablet.less';
}
</style>
