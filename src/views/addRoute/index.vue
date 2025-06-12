<script setup>
import { ref } from 'vue'

import { getRoutes, addRoutes } from '@/api/routes'

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
  { prop: 'name', label: '路由名称', align: 'left' },
  { prop: 'router', label: '路由路径' },
  { prop: 'view', label: '组件路径' },
  { prop: 'parentRouter', label: '父路由' },
  { prop: 'level', label: '排序' },
  { prop: 'isShow', label: '是否显示' },
])
const chack = (row) => {
  console.log(row)
}

import Operate from '@/components/operate/index.vue'

// 选中的行数据
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

import { deleteRoutes } from '@/api/routes'
const deleteSelect = async () => {
  console.log(multipleSelection.value)
  await deleteRoutes({ ids: multipleSelection.value.map((item) => item.id) }).then((res) => {
    getRoutesList()
  })
}

const deleteOne = async (row) => {
  console.log(row)
  await deleteRoutes({ ids: row.id }).then((res) => {
    getRoutesList()
  })
}

let dialogVisible = ref(false)
let dialogTitle = ref('')
let routeForm = ref({
  name: '',
  router: '',
  view: '',
  parentId: '',
  level: '',
  isShow: '',
})
const rules = ref({
  name: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
  router: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
  view: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
  level: [{ required: true, message: '请输入排序', trigger: 'blur' }],
  isShow: [{ required: true, message: '请输入是否显示', trigger: 'blur' }],
})
const openDialog = (openType) => {
  if (openType == 'add') {
    dialogTitle.value = '添加路由'
  } else if (openType == 'edit') {
    dialogTitle.value = '编辑路由'
  }
  console.log(openType)
  dialogVisible.value = true
}

const handleClose = () => {
  dialogVisible.value = false
  // 修正：应该修改 routeForm 的值，而不是重新赋值一个新对象
  routeForm.value = {
    name: '',
    router: '',
    view: '',
    parentId: '',
    level: '',
    isShow: '',
  }
}

const ruleForm = ref(null)
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await addRoutes(routeForm.value)
      await getRoutesList()
      handleClose()
    } else {
      console.log('error submit!', fields)
    }
  })
}

let searchForm = ref({
  name: '',
})

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
  <div class="operateBox">
    <Operate @add="openDialog('add')" @delete="deleteSelect">
      <template #searchFrom>
        <el-form :model="searchForm">
          <el-row :gutter="20">
            <el-col>
              <el-form-item label="路由名称:" prop="name">
                <el-input v-model="searchForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </Operate>
  </div>
  <div class="tableBox">
    <el-table
      :data="tableData"
      border
      default-expand-all
      row-key="id"
      @selection-change="handleSelectionChange"
      style="margin-top: 10px"
    >
      <el-table-column type="selection" :selectable="selectable" width="55" />
      <el-table-column type="index" label="序号" align="center" width="80" />
      <el-table-column
        v-for="item in tableColumns"
        header-align="center"
        :align="item.align ? item.align : 'center'"
        :prop="item.prop"
        :label="item.label"
      >
        <template v-if="item.prop === 'isShow'" #default="scoped">
          {{ scoped.row.isShow == '1' ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="scoped">
          <el-button link type="primary" size="small" @click="chack(scoped.row)"> 查看 </el-button>
          <el-button link type="primary" size="small">编辑</el-button>
          <el-button link type="primary" size="small" @click="deleteOne(scoped.row)">
            删除
          </el-button>
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
            <el-form-item label="路由路径:" prop="router">
              <el-input v-model="routeForm.router" />
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
                <el-option
                  v-for="item in optionData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleForm)"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="less" scoped></style>
