<script setup>
import { ref } from 'vue'

let props = defineProps({
  departmetInfo: {
    type: Object,
    default: () => ({}),
  },
})

let form = ref(props.departmetInfo)
let rules = ref({
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
})

import { getUserByFrimId } from '@/api/user.js'
let emps = ref([])
const getEmps = async (frimId) => {
  emps.value = []
  await getUserByFrimId({ frimId }).then((res) => {
    form.value.leader = res.data[0].id
    emps.value = res.data
  })
}

const changeFrim = async () => {
  getEmps(form.value.frimId)
}

let frimList = ref([])
import { getFrimList } from '@/api/frim'
const getFrim = async () => {
  frimList.value = []
  await getFrimList().then((res) => {
    form.value.frimId = res.data[0].id
    getEmps(form.value.frimId)
    res.data.forEach((item) => {
      frimList.value.push({
        label: item.name,
        value: item.id,
      })
    })
  })
}

getFrim()

import { defineEmits } from 'vue'
const emit = defineEmits(['submit', 'close'])

const formRef = ref(null)
const submit = () => {
  emit('submit', form.value, formRef.value, 'add')
}

const close = () => {
  emit('close')
}
</script>
<template>
  <el-form :model="form" ref="formRef" :rules="rules" label-width="100px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="name" label="部门名称:">
          <el-input v-model="form.name" placeholder="请输入部门名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="leader" label="部门负责人:">
          <el-select v-model="form.leader" placeholder="请选择部门所属公司">
            <el-option
              v-for="item in emps"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item prop="frimId" label="部门所属公司:">
          <el-select v-model="form.frimId" placeholder="请选择部门所属公司" @change="changeFrim">
            <el-option
              v-for="item in frimList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="msg" label="部门描述:">
          <el-input
            v-model="form.msg"
            maxlength="500"
            placeholder="请简述部门信息"
            :row="3"
            show-word-limit
            type="textarea"
          />
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
