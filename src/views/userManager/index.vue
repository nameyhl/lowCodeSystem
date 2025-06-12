<!-- 用户管理页面 -->
<script setup>
import { ref } from 'vue'
import AddFrom from './components/addFrom.vue'
import DeleteForm from './components/deleteForm.vue'
import UpdateForm from './components/updateForm.vue'

import Operate from '@/components/operate/index.vue'

const addDialogVisible = ref(false)

let View = ref(AddFrom)

let userInfo = ref({
  username: '',
  name: '',
  nikename: '',
  birth: '',
  pthone: '',
  email: '',
  wechat: '',
  departmentId: '',
})

const addEmployee = async () => {
  View.value = AddFrom
  userInfo.value = {
    username: '',
    name: '',
    nikename: '',
    birth: '',
    pthone: '',
    email: '',
    wechat: '',
    departmentId: '',
  }
  addDialogVisible.value = true
}

const deleteEmployee = async (row) => {
  View.value = DeleteForm
  userInfo.value = row
  addDialogVisible.value = true
}

const updateEmployee = async (row) => {
  userInfo.value = row
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
    pthone: '',
    email: '',
    wechat: '',
    departmentId: '',
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

// 获取所有用户
const getUserList = async () => {
  let params = {
    page: page.value,
    size: size.value,
  }
  await getUser(params).then((res) => {
    userList.value = res.data.data
    total.value = res.data.total
  })
}
getUserList()

const handleSizeChange = (val) => {
  size.value = val
  getUserList()
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
        pthone: '',
        email: '',
        wechat: '',
        departmentId: '',
      }
    })
  }
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      if (type === 'add') {
        await addUser(data).then((res) => {
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
            pthone: '',
            email: '',
            wechat: '',
            departmentId: '',
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
            pthone: '',
            email: '',
            wechat: '',
            departmentId: '',
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
</script>
<template>
  <Operate @add="addEmployee" :showDelete="false"></Operate>
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
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <!-- 新增弹框 -->
  <el-dialog
    v-model="addDialogVisible"
    title="新增"
    width="60%"
    :before-close="addDialogBeforeClose"
  >
    <component
      :is="View"
      @close="closeDialog"
      @submit="submitDialog"
      :userInfo="userInfo"
    ></component>
  </el-dialog>
</template>
<style lang="less" scoped></style>
