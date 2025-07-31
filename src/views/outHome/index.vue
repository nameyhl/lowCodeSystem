<script setup>
import { ref } from 'vue'

const routeName = '系统页面'
// 路由跳转
import { useRouter, useRoute, RouterView } from 'vue-router'
const router = useRouter()
const route = useRoute()

import userStore from '@/stores/modules/user'
const user = userStore().user

const logout = () => {
  userStore().logout()
  router.push('/login')
}
</script>
<template>
  <el-container class="container">
    <el-header class="header-bg">
      <div class="headerTitle">貔貅与金蟾公司OA系统</div>
      <el-dropdown>
        <div class="userInfo">
          <span class="el-dropdown-link">
            {{ user.name }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            <el-dropdown-item>个人主页</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
    <el-container style="height: calc(100vh - 60px)">
      <el-main>
        <RouterView style="height: 100%" />
      </el-main>
    </el-container>
  </el-container>
</template>
<style lang="less" scoped>
.container {
  width: calc(100vw);
  height: calc(100vh);

  .el-main {
    padding: 0;
  }

  .header-bg {
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
    margin-bottom: 0px;

    .headerTitle {
      font-size: 20px;
      font-weight: 900;
    }

    .userInfo {
      height: 50px;
      line-height: 50px;
      color: @white;
      cursor: pointer;
    }

  }
}
</style>
