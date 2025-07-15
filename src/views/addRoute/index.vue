<script setup>
import { ref } from 'vue'

import { getRoutes, addRoutes } from '@/api/routes'

let tableData = ref([])
let optionData = ref([])
let tableLoading = ref(true)

const getRoutesList = async () => {
  let { data } = await getRoutes()
  let { list, tree } = data
  tableData.value = tree
  optionData.value = list
  tableLoading = false
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

import Operate from '@/components/operate/index.vue'

// 选中的行数据
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

import { deleteRoutes } from '@/api/routes'
const deleteSelect = async () => {
  await deleteRoutes({ ids: multipleSelection.value.map((item) => item.id) }).then((res) => {
    getRoutesList()
  })
}

import { ElMessage, ElMessageBox } from 'element-plus'
const deleteOne = async (row) => {
  ElMessageBox({
    title: '警告',
    message: `是否确认删除路由${row.name}`,
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await deleteRoutes({ ids: row.id }).then((res) => {
        ElMessage.success('删除成功')
        getRoutesList()
      })
    })
    .catch(() => {
      console.log('取消')
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

let isChack = ref(false)
let isEdit = ref(false)

const chack = (row) => {
  routeForm.value = row
  dialogVisible.value = true
  dialogTitle.value = '查看路由'
  isChack.value = true
}
const editRoute = (row) => {
  routeForm.value = { ...row }
  dialogVisible.value = true
  dialogTitle.value = '编辑路由'
  isEdit.value = true
}
const openDialog = (openType) => {
  if (openType == 'add') {
    dialogTitle.value = '添加路由'
  } else if (openType == 'edit') {
    dialogTitle.value = '编辑路由'
  }
  dialogVisible.value = true
}

const handleClose = () => {
  isChack.value = false
  isEdit.value = false
  dialogVisible.value = false
  routeForm.value = {
    name: '',
    router: '',
    view: '',
    parentId: '',
    level: '',
    isShow: '',
  }
}

import { updateRoutes } from '@/api/routes'
const ruleForm = ref(null)
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (isChack.value) {
      } else if (isEdit.value) {
        await updateRoutes(routeForm.value)
        await getRoutesList()
      } else {
        await addRoutes(routeForm.value)
        await getRoutesList()
      }
      handleClose()
    } else {
      console.log('error submit!', fields)
    }
  })
}

let searchForm = ref({
  name: '',
  parentId: '',
  router: '',
})

import { searchRoutes } from '@/api/routes'

let searchButtonLoading = ref(false)
const search = async () => {
  searchButtonLoading.value = true
  setTimeout(() => {
    searchButtonLoading.value = false
  }, 1000)
  if (!searchForm.value.name && !searchForm.value.parentId && !searchForm.value.router) {
    getRoutesList()
    return
  }
  await searchRoutes(searchForm.value).then((res) => {
    tableData.value = res.data
    searchForm.value = {
      name: '',
      parentId: '',
      router: '',
    }
    tableLoading = false
  })
}
</script>
<template>
  <div class="operateBox">
    <Operate @add="openDialog('add')" @delete="deleteSelect">
      <template #addName>添加路由</template>
      <template #searchFrom>
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="路由名称:" prop="name">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入路由名称"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="父路由:" prop="parentId">
            <el-select
              v-model="searchForm.parentId"
              placeholder="请选择父路由"
              style="width: 200px"
            >
              <el-option
                v-for="item in optionData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="路由地址:" prop="router">
            <el-input
              v-model="searchForm.router"
              placeholder="请输入路由地址"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="search" :loading="searchButtonLoading" type="primary">
              查询
            </el-button>
          </el-form-item>
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
      v-loading="tableLoading"
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
          <el-button link type="primary" size="small" @click="editRoute(scoped.row)"
            >编辑</el-button
          >
          <el-button link type="primary" size="small" @click="deleteOne(scoped.row)">
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
    @close="handleClose"
  >
    <div class="formBody">
      <el-form :model="routeForm" label-width="100px" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="路由名称:" prop="name">
              <el-input v-model="routeForm.name" :disabled="isChack" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由路径:" prop="router">
              <el-input v-model="routeForm.router" :disabled="isChack" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组件路径:" prop="view">
              <el-input v-model="routeForm.view" :disabled="isChack" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否显示:" prop="isShow">
              <el-input v-model="routeForm.isShow" :disabled="isChack" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序:" prop="level">
              <el-input v-model="routeForm.level" :disabled="isChack" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父路由:" prop="parentId">
              <el-select
                v-model="routeForm.parentId"
                placeholder="请选择父路由"
                :disabled="isChack"
              >
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
