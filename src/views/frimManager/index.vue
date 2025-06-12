<!-- 分公司管理页面 -->
<script setup>
import Operate from '@/components/operate/index.vue'
import { ref, nextTick } from 'vue'

// 引入新增，删除，修改组件
import AddFrom from './components/addFrom.vue'
import DeleteForm from './components/deleteForm.vue'
import UpdateForm from './components/updateForm.vue'
import ChackForm from './components/chackInfo.vue'

// 控制弹窗
let dialogVisible = ref(false)
let View = ref(AddFrom)
let dialogTitle = ref('')

let frimInfo = ref({
  name: '',
  leaderId: '',
  msg: '',
})

const addForm = () => {
  View.value = AddFrom
  dialogVisible.value = true
  dialogTitle.value = '新增'
  frimInfo.value = {
    name: '',
    leaderId: '',
    msg: '',
  }
}

const updateForm = (row) => {
  View.value = UpdateForm
  dialogVisible.value = true
  dialogTitle.value = '修改'
  frimInfo.value = row
}

const deleteForm = (row) => {
  View.value = DeleteForm
  dialogVisible.value = true
  dialogTitle.value = '删除'
  frimInfo.value = row
}

// 引入接口方法
import { addFrim, getFrimList, updateFrim, deleteFrim } from '@/api/frim.js'
import { ElMessage } from 'element-plus'

let frimList = ref([])
let tableLoading = ref(true)

const getFrim = async () => {
  await getFrimList().then((res) => {
    frimList.value = res.data
    tableLoading.value = false
  })
}
getFrim()

// 触发子组件提交事件，关闭弹窗，提交表单
const submitClose = async (formData, form, type) => {
  if (type === 'delete') {
    await deleteFrim({ id: formData.id }).then((res) => {
      ElMessage({
        message: `删除${formData.name}成功`,
        type: 'success',
      })
    })
    getFrim()
    dialogVisible.value = false
    frimInfo.value = {
      name: '',
      leaderId: '',
      msg: '',
    }
    return
  }
  if (!form) return
  form.validate(async (valid) => {
    if (valid) {
      if (type === 'update') {
        await updateFrim(formData).then((res) => {
          if (res.code === 200) {
            ElMessage({
              message: '修改成功',
              type: 'success',
            })
          }
          dialogVisible.value = false
          frimInfo.value = {
            name: '',
            leaderId: '',
            msg: '',
          }
        })
      }
      if (type === 'add') {
        await addFrim(formData).then((res) => {
          if (res.code === 200) {
            ElMessage({
              message: '新增成功',
              type: 'success',
            })
          }
          frimInfo.value = {
            name: '',
            leaderId: '',
            msg: '',
          }
          dialogVisible.value = false
        })
      }
      getFrim()
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

// 触发子组件close事件，关闭弹窗
const closeDialog = () => {
  dialogVisible.value = false
  View.value = null
  dialogTitle.value = ''
}

const ViewRef = ref(null)
// 查看分公司信息
const chackFrim = (row) => {
  View.value = ChackForm
  dialogTitle.value = '查看'
  dialogVisible.value = true
  // 确保组件已挂载后再调用方法
  nextTick(() => {
    ViewRef.value.init(row)
  })
}

// 分页
let page = ref(1)
let size = ref(10)
let totle = ref(0)

const handleSizeChange = (val) => {
  size.value = val
  console.log('sizeChange')
}

const handleCurrentChange = (val) => {
  page.value = val
  console.log('pageChange')
}
</script>
<template>
  <Operate @add="addForm" :showDelete="false" />
  <div class="tableBox">
    <el-table
      v-loading="tableLoading"
      :data="frimList"
      border
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column type="index" align="center" label="序号" width="100"></el-table-column>
      <el-table-column prop="name" align="center" label="分公司名称"></el-table-column>
      <el-table-column prop="leader" align="center" label="分公司负责人">
        <template #default="scope">
          <span v-if="scope.row.leaderName">{{ scope.row.leaderName }}</span>
          <span style="color: red" v-else>暂未分配</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button type="primary" size="mini" link @click="chackFrim(scope.row)">查看</el-button>
          <el-button type="primary" size="mini" link @click="updateForm(scope.row)">修改</el-button>
          <el-button type="primary" size="mini" link @click="deleteForm(scope.row)">删除</el-button>
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
      :total="totle"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="60%" :before-close="closeDialog">
    <component
      :is="View"
      ref="ViewRef"
      :frimInfo="frimInfo"
      @submit="submitClose"
      @close="closeDialog"
    ></component>
  </el-dialog>
</template>
<style lang="less" scoped></style>
