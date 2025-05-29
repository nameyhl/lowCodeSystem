<script setup>
import { showRoutes } from '@/router';
import { ref } from 'vue';
console.log(showRoutes);
// 获取所有路由列表

// 路由跳转
import { useRouter, useRoute, RouterView } from 'vue-router';
const router = useRouter()
const route = useRoute()

let chackMenu = ref(route.path)

const routerTo = (path) => {
  console.log(path);
  chackMenu.value = path
  router.push(path)
}

</script>
<template>
  <el-container class="container">
    <el-header class="header-bg">rouyiMineSystem</el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu>
          <template v-for="item in showRoutes" :key="item.path">
            <el-sub-menu v-if="item.children.length != 0">
              {{ item.name }}
            </el-sub-menu>
            <el-menu-item v-else @click="routerTo(item.path)" :class="chackMenu == item.path ? 'active' : ''">
              {{ item.name }}
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <div class="breandcrumb">
          <el-tag closable type="danger">
            路由管理
          </el-tag>
        </div>
        <div class="viewBody">
          <RouterView />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<style lang="less" scoped>
.container {
  width: calc(100vw);
  height: calc(100vh);

  .el-main {
    .breandcrumb{
      display: flex;
      height: 30px;
      line-height: 30px;
      font-size: @font-size;
      font-weight: 600;
      align-items: center;
      .el-tag{
        margin-right: 10px;
        padding-left: 5px;
        height: 30px;
      }
    }
    .viewBody{
      background-color: @white;
      padding: 10px;
      height: calc(100% - 50px);
    }
  }

  .el-header {
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    font-weight: 900;
  }

  .el-aside {
    .el-menu {
      height: 100%;
      margin-right: 10px;
      padding-top: 10px;
      border-radius: 10px 10px 0 0;

      .active{
        background-color: @light-red;
        color: @white;
        font-weight: 600;
      }
      .el-menu-item{
        font-size: @font-size;
      }
    }
  }
}
</style>
