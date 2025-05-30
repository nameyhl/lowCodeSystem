<script setup>
import { showRoutes } from '@/router';
import { ref } from 'vue';
console.log(showRoutes);
// 获取所有路由列表

// 将路由重新排序
const sortRoutesByLevel = (routes) => {
  // 先对子路由进行排序（如果有的话）
  routes.forEach(route => {
    if (route.children && route.children.length > 0) {
      route.children = sortRoutesByLevel(route.children)
    }
  })

  // 然后对当前层级的路由进行排序
  return routes.sort((a, b) => {
    // 将level转换为数字比较，因为有些是字符串有些是数字
    const levelA = typeof a.level === 'string' ? parseInt(a.level) : a.level
    const levelB = typeof b.level === 'string' ? parseInt(b.level) : b.level
    return  levelB - levelA
  })
}

let routes = sortRoutesByLevel(showRoutes)

// 路由跳转
import { useRouter, useRoute, RouterView } from 'vue-router';
const router = useRouter()
const route = useRoute()

let chackMenu = ref(route.path)

let tagList = ref([])
const routerTo = (item) => {
  chackMenu.value = item.path
  for(let i = 0; i < tagList.value.length; i++){
    if(tagList.value[i].path == item.path){
      tagList.value.splice(i, 1)
    }
  }
  tagList.value.push(item)
  router.push(item.path)
}

</script>
<template>
  <el-container class="container">
    <el-header class="header-bg">rouyiMineSystem</el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu>
          <template v-for="item in routes" :key="item.path">
            <el-sub-menu v-if="item.children.length != 0" :index="item.path">
              <template #title>
                <span>{{ item.name }}</span>
              </template>
              <template v-for="el in item.children" :key="item.path">
                <el-sub-menu v-if="el.children.length != 0" :index="el.path">
                  <template #title>
                    <span>{{ el.name }}</span>
                  </template>
                </el-sub-menu>
                <el-menu-item v-else @click="routerTo(el)" :class="chackMenu == el.path ? 'active' : ''">
                  {{ el.name }}
                </el-menu-item>
              </template>
            </el-sub-menu>
            <el-menu-item v-else @click="routerTo(item)" :class="chackMenu == item.path ? 'active' : ''">
              {{ item.name }}
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <div class="breandcrumb">
          <el-tag closable v-for="item in tagList" @click="routerTo(item)" :key="item.path" @close="tagList.splice(tagList.indexOf(item), 1)" type="danger">
            {{ item.name}}
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
      font-size: @font-size;
      font-weight: 600;
      align-items: center;
      .el-tag{
        margin-right: 10px;
        padding-left: 5px;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
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
