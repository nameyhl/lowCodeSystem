<script setup>
import { showRoutes } from '@/router';
console.log(showRoutes);
// 获取所有路由列表

// 路由跳转
import { useRouter, RouterView } from 'vue-router';
const router = useRouter()

const routerTo = (path) => {
  console.log(path);
  router.push(path)
}

</script>
<template>
  <el-container class="container">
    <el-header>rouyiMineSystem</el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu>
          <template v-for="item in showRoutes" :key="item.path">
            <el-sub-menu v-if="item.children.length != 0">
              {{ item.name }}
            </el-sub-menu>
            <el-menu-item v-else @click="routerTo(item.path)">
              {{ item.name }}
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>
<style lang="less" scoped>
.container {
  width: calc(100vw);
  height: calc(100vh);

  .el-main {
    margin: 0;
    padding: 0;
  }

  .el-header {
    margin: 0;
    padding: 0;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: red;
    font-size: 20px;
    font-weight: 900;
  }

  .el-aside {
    margin: 0;
    padding: 0;

    .el-menu {
      height: 100%;
    }
  }
}
</style>
