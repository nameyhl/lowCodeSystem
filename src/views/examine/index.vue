<script setup>
import { addExamine, deleteExamine, updateExamine, getExamine } from '@/api/examine';
import { ref, watch } from 'vue';
let page = ref(1)
let size = ref(10)
let examineType = ref(1)

const getExamineList = async () => {
  let data = {
    page: page.value,
    size: size.value,
    examineType: examineType.value
  }
  let res = await getExamine(data)
}

getExamineList()

const handleClick = (tab) => {
  examineType.value = tab.props.name
  getExamineList()
}

let dialogVisible = ref(false)

const openAdd = () => {
  dialogVisible.value = true
}

let formData = ref({
  startTime: '',
  endTime: '',
  msg: '',
  examineType: 1
})

import userStore from '@/stores/modules/user'
import { formatter } from 'element-plus';
const user = userStore().user


const handleSubmit = async () => {

  let data = {
    userId: user.id,
    startTime: formData.value.startTime,
    endTime: formData.value.endTime,
    msg: formData.value.msg,
    examineType: formData.value.examineType
  }

  console.log(data);

  await addExamine(data)
}

const formLable = ref({
  startTime: '开始时间',
  endTime: '结束时间',
  msg: '请假原因'
})
watch(formData, (newVal, oldVal) => {
  if (newVal.examineType === 1) {
    formLable.value = {
      startTime: '开始时间',
      endTime: '结束时间',
      msg: '请假原因'
    }
  } else if (newVal.examineType === 2) {
    formLable.value = {
      startTime: '开始时间',
      endTime: '结束时间',
      msg: '加班原因'
    }
  } else if (newVal.examineType === 3) {
    formLable.value = {
      startTime: '开始时间',
      endTime: '结束时间',
    }
  } else if (newVal.examineType === 4) {
    formLable.value = {
      startTime: '开始时间',
      endTime: '结束时间',
      msg: '出差原因'
    }
  } else if (newVal.examineType === 5) {
    // formLable.value = {
    //   startTime: '开始时间',
    //   endTime: '结束时间',
    //   msg: '报销金额'
    // }
  }
}, {
  deep: true
})

const handleClose = () => {
  dialogVisible.value = false
}

</script>
<template>
  <div class="operation">
    <el-button type="primary" @click="openAdd">新增</el-button>
  </div>
  <div class="headBar">
    <el-tabs v-model="examineType" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="请假申请" :name="1">请假申请</el-tab-pane>
      <el-tab-pane label="加班申请" :name="2">加班申请</el-tab-pane>
      <el-tab-pane label="调休申请" :name="3">调休申请</el-tab-pane>
      <el-tab-pane label="出差申请" :name="4">出差申请</el-tab-pane>
      <!-- <el-tab-pane label="报销申请" :name="5">报销申请</el-tab-pane> -->
    </el-tabs>
  </div>
  <el-dialog title="提交申请" v-model="dialogVisible" show-close width="50%" custom-class="dialog"
    :before-close="handleClose">
    <el-form :model="formData">
      <el-form-item label="申请类型:" prop="examineType">
        <el-radio-group v-model="formData.examineType">
          <el-radio :value="1">请假申请</el-radio>
          <el-radio :value="2">加班申请</el-radio>
          <el-radio :value="3">调休申请</el-radio>
          <el-radio :value="4">出差申请</el-radio>
          <!-- <el-radio :value="5">报销申请</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="formLable.startTime" prop="startTime">
        <el-date-picker v-model="formData.startTime" type="date" placeholder="选择时间" :disabled-date="disabledDate"
          :shortcuts="shortcuts" value-format="YYYY-MM-DD" :size="size" />
      </el-form-item>
      <el-form-item :label="formLable.endTime" prop="endTime">
        <el-date-picker v-model="formData.endTime" type="date" placeholder="选择时间" :disabled-date="disabledDate"
          :shortcuts="shortcuts" value-format="YYYY-MM-DD" :size="size" />
      </el-form-item>
      <el-form-item v-if="formLable.msg" :label="formLable.msg" prop="msg">
        <el-input v-model="formData.msg" placeholder="请输入审批消息"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>
<style lang="less" scoped></style>
