<script setup>
import { ref } from 'vue'
import { PhoneFilled, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()

let loginForm = ref({
  phone: '',
  password: '',
})

let rules = {
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
    { min: 11, max: 11, message: '长度为11个字符', trigger: 'blur' },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

let loginFormRef = ref(null)

import { login } from '@/api/user'
const submit = async () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      await login(loginForm.value).then((res) => {
        let user = res.data
        if (user.isEmp === 1) {
          router.push('/home')
        }
      })
      ElMessage({
        message: '登录成功',
        type: 'success',
      })
    } else {
      return false
    }
  })
}
</script>
<template>
  <div class="loginBody">
    <div class="loginBox">
      <div class="loginFont">
        <div class="loginTitle">低代码OA系统</div>
        <div class="loginMsg">欢迎登录低代码OA系统</div>
        <div class="loginMsg">--后端: node.js</div>
        <div class="loginMsg">--前端: vue3+vite</div>
        <div class="loginMsg">--UI框架: ElementPlus</div>
        <div class="loginMsg">--数据库: MySQL</div>
      </div>
      <div class="loginForm">
        <div class="formTitle">登录：</div>
        <div class="formBox">
          <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
            <el-form-item prop="phone">
              <el-input
                v-model="loginForm.phone"
                placeholder="请输入电话"
                autocomplete="off"
                :suffix-icon="PhoneFilled"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                autocomplete="new-password"
                :suffix-icon="Lock"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="formFooter">
          <el-button type="primary" @click="submit">登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
:deep(.el-form-item__error) {
  color: #00ff00;
  animation: blink 1s linear infinite;
}
.loginBody {
  background-image: url('@/assets/imgs/loginBg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;

  .loginBox {
    width: 590px;
    height: 250px;
    display: flex;
    .loginFont {
      width: 350px;
      height: 250px;
      margin-right: 10px;
      border-right: 1px solid #ccc;
      .loginTitle {
        font-size: 20px;
        margin-bottom: 10px;
        font-weight: bolder;
      }
      .loginMsg {
        font-size: 14px;
        margin-bottom: 5px;
      }
    }
    .loginForm {
      width: 340px;
      height: 210px;
      padding: 20px;
      background-color: rgba(255, 255, 255, 0.4);
      .formTitle {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 50px;
      }
      .formBox {
        margin-bottom: 20px;
      }
      .formFooter {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
