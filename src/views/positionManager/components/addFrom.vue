<script setup>
import { ref } from 'vue'

const prop = defineProps({
  positionInfo: {
    type: Object,
    default: () => { },
  },
  disabled: {
    type: Boolean,
    default: false,
  }
})

let formData = ref(prop.positionInfo)
let disabled = ref(prop.disabled)

let rules = {
  name: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
  departmentId: [{ required: true, message: '请选择所属部门', trigger: 'blur' }],
  leaderId: [{ required: true, message: '请选择负责人', trigger: 'blur' }],
}

import { getDepartmentList } from '@/api/department'

let deprotments = ref([])
const getDepartments = async () => {
  deprotments.value = []
  await getDepartmentList().then((res) => {
    res.data.forEach((item) => {
      deprotments.value.push({
        label: `${item.name}(${item.frimName})`,
        value: item.id,
      })
    })
  })
}
getDepartments()

import { getUserByDepartmentId } from '@/api/user.js'
let emps = ref([])
const getEmp = async (id) => {
  emps.value = []
  await getUserByDepartmentId({ departmentId: id }).then((res) => {
    emps.value = res.data
    if (res.data.length == 0) {
      emps.value.push({
        id: null,
        name: '暂无人员',
      })
    } else {
      formData.value.leaderId = res.data[0].id
    }
  })
}

const departmentChange = async (val) => {
  formData.value.leaderId = null
  emps.value = []
  getEmp(val)
}

const emit = defineEmits(['submit', 'close'])

let formRef = ref(null)

const submit = () => {
  emit('submit', formData.value, formRef.value, 'add')
}

const close = () => {
  emit('close')
}
</script>
<template>
  <el-form :model="formData" ref="formRef" :rules="rules" label-width="100px">
    <el-row>
      <el-col :span="12">
        <!-- name -->
        <el-form-item prop="name" label="职位名称">
          <el-input v-model="formData.name" placeholder="请输入职位名称" :disabled="disabled"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <!-- departmentId -->
        <el-form-item prop="departmentId" label="所属部门">
          <el-select v-model="formData.departmentId" placeholder="请选择所属部门" :disabled="disabled"
            @change="departmentChange">
            <el-option v-for="item in deprotments" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <!-- ledaerId -->
        <el-form-item prop="leaderId" label="负责人">
          <el-select v-model="formData.leaderId" placeholder="请选择负责人" :disabled="disabled">
            <el-option v-for="item in emps" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <div class="foot">
    <el-button style="padding: 8px 15px" type="primary" @click="submit">提交</el-button>
    <el-button style="padding: 8px 15px" @click="close">取消</el-button>
  </div>
</template>
<style lang="less" scoped>
.foot {
  text-align: center;
  margin-top: 20px;
}

.el-row {
  margin-bottom: 20px;
}
</style>
