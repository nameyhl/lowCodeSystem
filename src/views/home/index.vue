<script setup>
import { ref } from 'vue'
// 获取所有路由列表

let openList = ref([])
// 将路由重新排序
const sortRoutesByLevel = (routes) => {
  // 先对子路由进行排序（如果有的话）
  routes.forEach((route) => {
    openList.value.push(route.path)
    if (route.children && route.children.length > 0) {
      route.children = sortRoutesByLevel(route.children)
    }
  })

  // 然后对当前层级的路由进行排序
  return routes.sort((a, b) => {
    // 将level转换为数字比较，因为有些是字符串有些是数字
    const levelA = typeof a.level === 'string' ? parseInt(a.level) : a.level
    const levelB = typeof b.level === 'string' ? parseInt(b.level) : b.level
    return levelB - levelA
  })
}


import { getRoutes } from '@/api/routes.js'


let routes = ref([])
const getShowRoutes = async () => {
  let data = {
    name: '系统管理'
  }
  await getRoutes(data).then(res => {
    let route = sortRoutesByLevel(res.data)
    routes.value = [
      ...route,
      {
        router: 'addRoute',
        name: '新增路由',
      }
    ]
  })

}

getShowRoutes()

console.log(routes);

// 路由跳转
import { useRouter, useRoute, RouterView } from 'vue-router'
const router = useRouter()
const route = useRoute()

let chackMenu = ref(route.router)

let tagList = ref([])
const routerTo = (item) => {
  chackMenu.value = item.router
  for (let i = 0; i < tagList.value.length; i++) {
    if (tagList.value[i].router == item.router) {
      tagList.value.splice(i, 1)
    }
  }
  tagList.value.push(item)
  router.push(item.router)
}

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
      <el-aside width="200px">
        <el-menu :default-openeds="openList">
          <template v-for="item in routes" :key="item.router">
            <el-sub-menu v-if="item.children" :index="item.router">
              <template #title>
                <span>{{ item.name }}</span>
              </template>
              <template v-for="el in item.children" :key="el.router">
                <el-sub-menu v-if="el.children" :index="el.router">
                  <template #title>
                    <span>{{ el.name }}</span>
                  </template>
                </el-sub-menu>
                <el-menu-item v-else @click="routerTo(el)" :class="chackMenu == el.router ? 'active' : ''">
                  {{ el.name }}
                </el-menu-item>
              </template>
            </el-sub-menu>
            <el-menu-item v-else @click="routerTo(item)" :class="chackMenu == item.router ? 'active' : ''">
              {{ item.name }}
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <div class="breandcrumb">
          <el-tag closable v-for="item in tagList" @click="routerTo(item)" :key="item.path"
            @close="tagList.splice(tagList.indexOf(item), 1)" type="danger">
            {{ item.name }}
          </el-tag>
        </div>
        <div :class="{ viewBody: tagList.length !== 0, viewBodyWithoutTag: tagList.length === 0 }">
          <RouterView style="height: 100%" />
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
    padding: 0;
    height: calc(100vh - 60px);

    .breandcrumb {
      display: flex;
      font-size: @font-size;
      font-weight: 600;
      align-items: center;

      .el-tag {
        margin-right: 10px;
        padding-left: 5px;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
      }
    }

    .viewBody {
      background-color: @white;
      padding: 10px;
      height: calc(100% - 50px);
    }

    .viewBodyWithoutTag {
      background-color: @white;
      padding: 10px;
      height: calc(100% - 20px);
    }
  }

  .header-bg {
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;

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

  .el-aside {
    height: calc(100vh - 60px);

    .el-menu {
      height: 100%;
      margin-right: 10px;
      padding-top: 10px;
      border-radius: 10px 10px 0 0;
      overflow: auto;

      .active {
        background-color: @light-red;
        color: @white;
        font-weight: 600;
      }

      .el-menu-item {
        font-size: @font-size;
      }
    }
  }
}

:deep(.el-dropdown-menu__item) {
  &:hover {
    background-color: @primary-red;
    color: @white;
  }
}
</style>
