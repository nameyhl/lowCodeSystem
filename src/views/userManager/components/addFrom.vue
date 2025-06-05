<script setup>
import { ref } from 'vue';

let form = ref({
  username: '',
  name:'',
  nikename:'',
  age:'',
  birth:'',
  pthone: '',
  email:'',
  wechat:'',
})
</script>
<template>
  <el-form :model="form" label-width="100px">
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
        <el-form-item prop="age" label="年龄">
          <el-input v-model="form.age" placeholder="请输入年龄"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item prop="birth" label="生日">
          <el-date-picker v-model="form.birth" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="pthone" label="电话">
          <el-input v-model="form.pthone" placeholder="请输入电话"></el-input>
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
        <el-form-item prop="wechat" label="微信">
          <el-input v-model="form.wechat" placeholder="请输入微信"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<style lang="less" scoped></style>
