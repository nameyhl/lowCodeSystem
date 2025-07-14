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

console.log(formData.value);


let rules = {
  name: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
  frimId: [{ required: true, message: '请选择所属公司', trigger: 'blur' }],
  departmentId: [{ required: true, message: '请选择所属部门', trigger: 'blur' }],
  msg: [{ required: true, message: '请输入备注', trigger: 'blur' }],
}

import { getDepartmentList } from '@/api/department'
import { getFrimList } from '@/api/frim'
let frimList = ref([])
const getFrims = async () => {
  await getFrimList().then((res) => {
    frimList.value = res.data
  })
}
getFrims()

const frimChange = (val) => {
  getDepartments(val)
}

let deprotments = ref([])
const getDepartments = async (frimId) => {
  deprotments.value = []
  await getDepartmentList({ frimId }).then((res) => {
    res.data.forEach((item) => {
      deprotments.value.push({
        label: `${item.name}`,
        value: item.id,
      })
    })
  })
}

if (formData.value.frimId) {
  getDepartments(formData.value.frimId)
}

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
        <!-- frimId -->
        <el-form-item prop="frimId" label="所属分公司">
          <el-select v-model="formData.frimId" placeholder="请选择所属分公司" :disabled="disabled" @change="frimChange">
            <el-option v-for="item in frimList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="12">
        <!-- departmentId -->
        <el-form-item prop="departmentId" label="所属部门">
          <el-select v-model="formData.departmentId" placeholder="请选择所属部门" :disabled="disabled || !formData.frimId">
            <el-option v-for="item in deprotments" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <!-- msg -->
        <el-form-item prop="msg" label="备注">
          <el-input v-model="formData.msg" type="textarea" maxlength="500" :row="3" show-word-limit placeholder="请输入备注"
            :disabled="disabled"></el-input>
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
