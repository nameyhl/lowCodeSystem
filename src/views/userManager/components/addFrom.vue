<script setup>
import { ref } from 'vue'

import { getDepartmentList } from '@/api/department'

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

let form = ref(props.userInfo)

console.log(form)

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

const rules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  birth: [{ required: true, message: '请选择生日', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  wechat: [{ required: true, message: '请输入微信', trigger: 'blur' }],
  departmentId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
})

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
        <el-form-item prop="username" label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="name" label="姓名">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item prop="nikename" label="昵称">
          <el-input v-model="form.nikename" placeholder="请输入昵称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="birth" label="生日">
          <el-date-picker
            v-model="form.birth"
            type="datetime"
            format="YYYY-MM-DD"
            placeholder="选择日期"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item prop="wechat" label="微信">
          <el-input v-model="form.wechat" placeholder="请输入微信"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="phone" label="电话">
          <el-input v-model="form.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="departmentId" label="部门">
          <el-select v-model="form.departmentId" placeholder="请选择部门">
            <el-option
              v-for="item in deprotments"
              :key="item.id"
              :value="item.value"
              :label="item.label"
            ></el-option>
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
