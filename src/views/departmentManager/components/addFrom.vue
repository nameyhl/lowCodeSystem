<script setup>
import { ref } from 'vue'

let props = defineProps({
  departmentInfo: {
    type: Object,
    default: () => ({}),
  },
})

let form = ref(props.departmentInfo)

let rules = ref({
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  frimId: [{ required: true, message: '请选择部门所属公司', trigger: 'change' }],
})

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
  <el-form :model="form" ref="formRef" :rules="rules" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item prop="name" label="部门名称:">
          <el-input v-model="form.name" placeholder="请输入部门名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="frimId" label="部门所属公司:">
          <el-select v-model="form.frimId" placeholder="请选择部门所属公司">
            <template v-if="frimList.length === 0">
              <el-option label="暂无数据，请添加公司后创建部门" value="" disabled></el-option>
            </template>
            <el-option
              v-for="item in frimList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
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
