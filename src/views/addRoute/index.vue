<script setup>
import { ref } from 'vue';

import { getRoutes, addRoutes } from '@/api/routes';

let tableData = ref([])
let optionData = ref([])
const getRoutesList = async () => {
  let { data } = await getRoutes()
  let { list, tree } = data
  tableData.value = tree
  optionData.value = list
}
getRoutesList()
let tableColumns = ref([
  {prop:'name', label: '路由名称', align: 'left'},
  {prop:'path', label: '路由路径'},
  {prop:'view', label: '组件路径'},
  {prop:'parentId', label: '父路由'},
  {prop:'level', label: '排序'},
  {prop:'isShow', label: '是否显示'},
])
const chack = (row) => {
  console.log(row);
}

let dialogVisible = ref(false)
let dialogTitle = ref('')
let routeForm = ref({
  name: '',
  path: '',
  view: '',
  parentId: '',
  level: '',
  isShow: '',
})
const rules = ref({
  name: [
    { required: true, message: '请输入路由名称', trigger: 'blur' },
  ],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' },
  ],
  view: [
    { required: true, message: '请输入组件路径', trigger: 'blur' },
  ],
  level: [
    { required: true, message: '请输入排序', trigger: 'blur' },
  ],
  isShow: [
    { required: true, message: '请输入是否显示', trigger: 'blur' },
  ]
})
const openDialog = (openType) => {
  if(openType == 'add'){
    dialogTitle.value = '添加路由'
  }else if(openType == 'edit'){
    dialogTitle.value = '编辑路由'
  }
  console.log(openType);
  dialogVisible.value = true
}

const handleClose = () => {
  dialogVisible.value = false
  routeForm = {
    name: '',
    path: '',
    view: '',
    parentId: '',
    level: '',
    isShow: '',
  }
}

const ruleForm = ref(null)
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate( async (valid, fields) => {
    if (valid) {
      await addRoutes(routeForm.value)
      await getRoutesList()
      handleClose()
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>
<template>
  <div class="serchBox"></div>
  <div class="operateBox">
    <el-button class="addButton" @click="openDialog('add')"><el-icon><component is="Plus" /></el-icon>添加</el-button>
    <el-button class="deleteButton"><el-icon><component is="Delete" /></el-icon>删除</el-button>
  </div>
  <div class="tableBox">
    <el-table :data="tableData" border row-key="id">
      <el-table-column type="index" label="序号" align="center" width="80" />
      <el-table-column v-for="item in tableColumns" header-align="center" :align="item.align? item.align : 'center'" :prop="item.prop" :label="item.label"/>
      <el-table-column label="操作" width="160">
        <template #default="scoped">
          <el-button link type="primary" size="small" @click="chack(scoped.row)">
            查看
          </el-button>
          <el-button link type="primary" size="small">编辑</el-button>
          <el-button link type="primary" size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    show-close
    width="50%"
    custom-class="dialog"
  >
  <div class="formBody">
    <el-form :model="routeForm" label-width="100px" :rules="rules" ref="ruleForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="路由名称:" prop="name">
            <el-input v-model="routeForm.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路由路径:" prop="path">
            <el-input v-model="routeForm.path" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="组件路径:" prop="view">
            <el-input v-model="routeForm.view" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否显示:" prop="isShow">
            <el-input v-model="routeForm.isShow" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="排序:" prop="level">
            <el-input v-model="routeForm.level" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="父路由:" prop="parentId">
            <el-select v-model="routeForm.parentId" placeholder="请选择父路由">
              <el-option v-for="item in optionData" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleForm)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="less" scoped></style>
