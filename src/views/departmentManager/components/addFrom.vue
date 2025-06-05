<script setup>
import { ref } from 'vue';

let form = ref({
  name: '',
  leader: '',
})
</script>
<template>
  <el-form :model="form" label-width="100px">
    <el-row>
      <el-col :span="12">
        <el-from-item prop="name" label="分公司名称">
          <el-input v-model="form.name" placeholder="请输入分公司名称"></el-input>
        </el-from-item>
      </el-col>
      <el-col :span="12">
        <el-from-item prop="leader" label="分公司负责人">
          <el-input v-model="form.leader" placeholder="请输入分公司负责人"></el-input>
        </el-from-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<style lang="less" scoped></style>
