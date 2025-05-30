// router/index.js
import { createRouter, createWebHistory } from "vue-router"
// import Layout from "@/views/Layout.vue"
// import { getRouteList } from '@/api/route'

// 菜单展示的路由
const showRoutes = [
  {
    path: '/addRoute',
    name: '路由管理',
    level: -1,
    component: () => import('@/views/addRoute/index.vue'),
    children: []
  }
]

// 基础路由
const constantRoutes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/notFound/index.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    children: showRoutes
  }
  // 注意：这里不包含通配符404路由，将在动态路由加载后添加
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

// 获取路由列表
import { getRoutes } from '@/api/routes.js'
import useRoutesStore from '@/stores/modules/routes.js'
const routes = useRoutesStore()

// 动态加载路由并添加到router实例
const initializeRouter = async () => {
  try {
    const res = await routes.fetchRoutes()
    const dynamicRoutes = formatRoutes(res || [])
    // 添加动态路由
    dynamicRoutes.forEach(route => {
      router.addRoute('home',route)
      showRoutes.push(route)
    })

    // 最后添加404路由
    router.addRoute({
      path: '/:pathMatch(.*)',
      redirect: '/404'
    })

    return true
  } catch (error) {
    console.error('路由加载失败:', error)
    // 确保至少有404路由
    router.addRoute({
      path: '/:pathMatch(.*)',
      redirect: '/404'
    })
    return false
  }
}

// 格式化路由
const formatRoutes = (routes) => {
  return routes.map(route => ({
    path: route.router,
    name: route.name,
    level: route.level,
    component: loadView(route.view),
    meta: route.meta || {},
    children: route.children ? formatRoutes(route.children) : []
  }))
}

// 动态加载组件
const loadView = (view) => {
  if (view === 'Layout') return Layout
  return () => import(`@/views/${view}/index.vue`)
}

// 立即执行异步路由初始化
initializeRouter()
export { showRoutes }
export default router
