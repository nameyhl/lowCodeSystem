<script setup>
import { ref } from 'vue'

const props = defineProps({
  departmentInfo: {
    type: Object,
    default: () => ({}),
  },
})

import { getAllUser } from '@/api/user.js'

let emps = ref([])
const getEmp = async (id) => {
  emps.value = []
  await getAllUser(id).then((res) => {
    emps.value = res.data
  })
}
getEmp({ departmentId: props.departmentInfo.id })

let frimList = ref([])
import { getFrimList } from '@/api/frim'
const getFrim = async () => {
  frimList.value = []
  await getFrimList().then((res) => {
    res.data.forEach((item) => {
      frimList.value.push({
        label: item.name,
        value: item.id,
      })
    })
  })
}

getFrim()

let form = ref(props.departmentInfo)

const emit = defineEmits(['submit', 'close'])

const formRef = ref(null)
const submit = () => {
  emit('submit', form.value, formRef.value, 'update')
}

const close = () => {
  emit('close')
}
</script>
<template>
  <el-form :model="form" ref="formRef" :rules="rules" label-width="120px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="name" label="部门名称:">
          <el-input v-model="form.name" placeholder="请输入部门名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="frimId" label="部门所属公司:">
          <el-select v-model="form.frimId" placeholder="请选择部门所属公司" disabled>
            <el-option v-for="item in frimList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item prop="leaderId" label="部门负责人:">
          <el-select v-model="form.leaderId" placeholder="请选择部门负责人" @change="changeFrim">
            <template v-if="emps.length === 0">
              <el-option label="暂无数据，请添加用户后修改" value="" disabled></el-option>
            </template>
            <el-option v-for="item in emps" :key="item.value" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="msg" label="部门描述:">
          <el-input v-model="form.msg" maxlength="500" placeholder="请简述部门信息" :row="3" show-word-limit type="textarea" />
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
