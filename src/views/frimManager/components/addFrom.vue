<script setup>
import { ref } from 'vue';

let form = ref({
  name: '',
  leader: '',
  msg: '',
})
let emp = ref([
  { id: '1', name: '张三' },
  { id: '2', name: '李四' },
  { id: '3', name: '王五' },
])

let rules = ref({
  name: [
    { required: true, message: '请输入分公司名称', trigger: 'blur' },
  ],
})

import { defineEmits } from 'vue';
const emit = defineEmits(['submit', 'close'])

const close = () => {
  form.value = {
    name: '',
    leader: '',
    msg: '',
  }
  emit('close')
}

const formRef = ref(null)

const submit = () => {
  emit('submit', form.value , formRef.value, 'add')
  form.value = {
    name: '',
    leader: '',
    msg: '',
  }
}
</script>
<template>
  <el-form :model="form" ref="formRef" :rules="rules" label-width="120px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="name" label="分公司名称:">
          <el-input v-model="form.name" placeholder="请输入分公司名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="leader" label="分公司负责人:">
          <el-select v-model="form.leader" placeholder="请选择分公司负责人">
            <el-option v-for="item in emp" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item prop="msg" label="分公司简介:">
          <el-input
            v-model="form.msg"
            maxlength="500"
            placeholder="请简述分公司信息"
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
.foot{
  text-align: center;
  margin-top: 20px;
}
.el-row{
  margin-bottom: 20px;
}
</style>
