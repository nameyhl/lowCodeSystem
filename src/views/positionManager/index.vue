<!-- 职位管理页面 -->
<script setup>
import Operate from '@/components/operate/index.vue'
import { ref } from 'vue'

import AddFrom from './components/addFrom.vue'
import EditeForm from './components/editeForm.vue'
import Chack from './components/chack.vue'

let dialogVisible = ref(false)
let dialogTitle = ref('')

let searchFrom = ref({
  name: '',
  departmentId: '',
})

let columns = ref([
  {
    prop: 'name',
    label: '职位名称',
  },
  {
    prop: 'departmentName',
    label: '部门名称',
  },
  {
    prop: 'frimName',
    label: '公司名称',
  },
  {
    prop: 'leaderName',
    label: '负责人',
  },
])

let page = ref(1)
let size = ref(10)
let total = ref(0)
import { getPositionList } from '@/api/position.js'
let jobList = ref([])
const getJob = async () => {
  let data = {
    page: page.value,
    size: size.value,
    name: searchFrom.value.name,
    departmentId: searchFrom.value.departmentId,
  }
  await getPositionList(data).then((res) => {
    jobList.value = res.data.data
    total.value = res.data.total
  })
}

getJob()

const handleSizeChange = (val) => {
  size.value = val
  getJob()
}

const handleCurrentChange = (val) => {
  page.value = val
  getJob()
}
let positionInfo = ref({
  name: '',
  departmentId: '',
  frimId: '',
  msg: '',
})

let View = ref(null)
let disabled = ref(false)
const openAdd = (type, data) => {
  dialogVisible.value = true
  if (type === 'edit') {
    positionInfo.value = { ...data }
    dialogTitle.value = '编辑职位'
    View.value = EditeForm
  }
  if (type === 'add') {
    dialogTitle.value = '添加职位'
    View.value = AddFrom
    positionInfo.value = {
      name: '',
      departmentId: '',
      frimId: '',
      msg: '',
    }
  }
  if (type === 'chack') {
    positionInfo.value = data
    dialogTitle.value = '查看职位'
    View.value = Chack
  }
}

import { ElMessage, ElMessageBox } from 'element-plus'

import { addPosition, updatePosition } from '@/api/position.js'
const submitForm = (data, formRef, type) => {
  if (!formRef) return
  formRef.validate(async (valid) => {
    if (valid) {
      if (type === 'edit') {
        await updatePosition(data).then((res) => {
          if (res.code === 200) {
            ElMessage({
              message: '修改成功',
              type: 'success',
            })
          }
          dialogVisible.value = false
          positionInfo.value = {
            name: '',
            departmentId: '',
            leaderId: '',
          }
        })
      }
      if (type === 'add') {
        await addPosition(data).then((res) => {
          if (res.code === 200) {
            ElMessage({
              message: '新增成功',
              type: 'success',
            })
          }
          positionInfo.value = {
            name: '',
            departmentId: '',
            leaderId: '',
          }
          dialogVisible.value = false
        })
      }
      getJob()
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

const closeDialog = () => {
  dialogVisible.value = false
  View.value = null
  positionInfo.value = {
    name: '',
    departmentId: '',
    leaderId: '',
    msg: '',
  }
}
import { getDepartmentList } from '@/api/department'

let departmentList = ref([{ label: '全部', value: '' }])
const getDepartments = async () => {
  await getDepartmentList().then((res) => {
    res.data.forEach((item) => {
      departmentList.value.push({
        label: `${item.name}(${item.frimName})`,
        value: item.id,
      })
    })
  })
}
getDepartments()

import { deletePosition } from '@/api/position.js'
const deleteOne = (data) => {
  ElMessageBox.confirm('此操作将永久删除职位' + data.name + ', 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await deletePosition(data.id).then((res) => {
        ElMessage({
          type: 'success',
          message: '删除成功!',
        })
        getJob()
      })
    })
    .catch(() => {})
}
</script>
<template>
  <Operate @add="openAdd('add')" :showDelete="false">
    <template #addName> 添加职位 </template>
    <template #searchFrom>
      <el-form :inline="true" :model="searchFrom">
        <el-form-item label="职位名称">
          <el-input
            v-model="searchFrom.name"
            placeholder="请输入职位名称"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select
            v-model="searchFrom.departmentId"
            placeholder="请选择部门"
            style="width: 200px"
          >
            <el-option
              v-for="item in departmentList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getJob">查询</el-button>
        </el-form-item>
      </el-form>
    </template>
  </Operate>
  <div class="tableBox">
    <el-table :data="jobList" style="width: 100%" border>
      <el-table-column type="index" label="序号" align="center" width="80" />
      <el-table-column
        v-for="item in columns"
        :prop="item.prop"
        :label="item.label"
        :key="item.prop"
      ></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="mini" link @click="openAdd('chack', scope.row)"
            >查看</el-button
          >
          <el-button type="primary" size="mini" link @click="openAdd('edit', scope.row)"
            >编辑</el-button
          >
          <el-button type="primary" size="mini" link @click="deleteOne(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div>
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="size"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="50%" :before-close="closeDialog">
    <component
      :is="View"
      :positionInfo="positionInfo"
      @close="closeDialog"
      @submit="submitForm"
      :disabled="disabled"
    >
    </component>
  </el-dialog>
</template>
<style lang="less" scoped></style>
