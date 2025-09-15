<!-- 用户管理页面 -->
<script setup>
import { ref } from 'vue'
import AddFrom from './components/addFrom.vue'
import DeleteForm from './components/deleteForm.vue'
import UpdateForm from './components/updateForm.vue'

import Operate from '@/components/operate/index.vue'

const addDialogVisible = ref(false)

let model = ref(sessionStorage.getItem('model'))

let View = ref(AddFrom)

let userInfo = ref({
  username: '',
  name: '',
  nikename: '',
  birth: '',
  phone: '',
  email: '',
  wechat: '',
  departmentId: null,
  frimId: null,
  positionId: null,
})

const addEmployee = async () => {
  View.value = AddFrom
  userInfo.value = {
    username: '',
    name: '',
    nikename: '',
    birth: '',
    phone: '',
    email: '',
    wechat: '',
    departmentId: null,
    frimId: null,
    positionId: null,
  }
  addDialogVisible.value = true
}

const deleteEmployee = async (row) => {
  View.value = DeleteForm
  userInfo.value = row
  addDialogVisible.value = true
}

const updateEmployee = async (row) => {
  userInfo.value = { ...row }
  View.value = UpdateForm
  addDialogVisible.value = true
}

const closeDialog = () => {
  addDialogVisible.value = false
  View.value = null
  userInfo.value = {
    username: '',
    name: '',
    nikename: '',
    birth: '',
    phone: '',
    email: '',
    wechat: '',
    departmentId: null,
    frimId: null,
    positionId: null,
  }
}

import { addUser, getUser, updateUser, deleteUser } from '@/api/user.js'

import { ElMessage } from 'element-plus'

let userList = ref([])

let columns = [
  {
    label: '姓名',
    prop: 'name',
  },
  {
    label: '公司',
    prop: 'frimName',
  },
  {
    label: '部门',
    prop: 'departmentName',
  },
  {
    label: '电话',
    prop: 'phone',
  },
  {
    label: '邮箱',
    prop: 'email',
  },
  {
    label: '微信',
    prop: 'wechat',
  },
  {
    label: '年龄',
    prop: 'age',
  },
  {
    label: '操作',
    prop: 'action',
  },
]
// 分页
let page = ref(1)
let size = ref(10)
let total = ref(100)

let searchForm = ref({
  username: '',
  name: '',
  departmentId: null,
})
// 获取所有用户
const getUserList = async () => {
  let params = {
    page: page.value,
    size: size.value,
    name: searchForm.value.name,
    username: searchForm.value.username,
    departmentId: searchForm.value.departmentId,
  }
  await getUser(params).then((res) => {
    userList.value = res.data.data
    total.value = res.data.total
  })
}
getUserList()

const handleSizeChange = (val) => {
  size.value = val
  if (searchForm.value.departmentId || searchForm.value.username || searchForm.value.name) {
    getUserList()
  }
}

const handleCurrentChange = (val) => {
  page.value = val
  getUserList()
}

const submitDialog = async (data, form, type) => {
  if (type === 'delete') {
    await deleteUser({ id: data.id }).then((res) => {
      ElMessage({
        message: `删除${data.name}成功`,
        type: 'success',
      })
      getUserList()
      addDialogVisible.value = false
      View.value = null
      userInfo.value = {
        username: '',
        name: '',
        nikename: '',
        birth: '',
        phone: '',
        email: '',
        wechat: '',
        departmentId: null,
        frimId: null,
        positionId: null,
      }
    })
  }
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      if (type === 'add') {
        let formData = {
          ...data,
          isEmp: 1,
        }
        await addUser(formData).then((res) => {
          ElMessage({
            message: '新增成功',
            type: 'success',
          })
          addDialogVisible.value = false
          userInfo.value = {
            username: '',
            name: '',
            nikename: '',
            birth: '',
            phone: '',
            email: '',
            wechat: '',
            departmentId: null,
            frimId: null,
            positionId: null,
          }
          View.value = null
        })
      } else if (type === 'update') {
        await updateUser(data).then((res) => {
          ElMessage({
            message: '修改成功',
            type: 'success',
          })
          addDialogVisible.value = false
          userInfo.value = {
            username: '',
            name: '',
            nikename: '',
            birth: '',
            phone: '',
            email: '',
            wechat: '',
            departmentId: null,
            frimId: null,
            positionId: null,
          }
          View.value = null
        })
      }
      getUserList()
    } else {
      console.log('error submit!!')
    }
  })
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

const search = async () => {
  page.value = 1
  size.value = 10
  getUserList()
}
</script>
<template>
  <Operate @add="addEmployee" :showDelete="false">
    <template #addName>添加用户</template>
    <template #searchFrom>
      <el-form :inline="model === 'PC'" :model="searchForm" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入姓名"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select
            v-model="searchForm.departmentId"
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
          <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </template>
  </Operate>
  <div class="tableBox">
    <el-table :data="userList" style="width: 100%" border>
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
      >
        <template #default="scoped">
          <div v-if="item.prop === 'age'" :style="{ color: scoped.row.age < 35 ? 'green' : 'red' }">
            {{ scoped.row.age }}
          </div>
          <div v-if="item.prop === 'action'">
            <el-button type="primary" link size="mini" @click="updateEmployee(scoped.row)"
              >修改</el-button
            >
            <el-button type="primary" link size="mini" @click="deleteEmployee(scoped.row)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div>
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="size"
      :page-sizes="[10, 20, 30, 40]"
      :size="model === 'PC' ? 'medium' : 'small'"
      layout="total,sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      :pager-count="5"
      @current-change="handleCurrentChange"
    />
  </div>

  <!-- 新增弹框 -->
  <el-dialog v-model="addDialogVisible" title="新增" width="60%" :before-close="closeDialog">
    <component
      :is="View"
      @close="closeDialog"
      @submit="submitDialog"
      :userInfo="userInfo"
    ></component>
  </el-dialog>
</template>
<style lang="less" scoped></style>
