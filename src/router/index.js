// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'

// import Layout from "@/views/Layout.vue"
// import { getRouteList } from '@/api/route'

let model = ref(sessionStorage.getItem('model'))

let showRoutes = []
// 菜单展示的路由
if (model.value !== 'mobile') {
  showRoutes.push({
    path: '/addRoute',
    name: '路由管理',
    level: -1,
    component: () => import('@/views/addRoute/index.vue'),
    children: [],
  })
}
const outeRoutes = []

// 基础路由
const constantRoutes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/notFound/index.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
  {
    path: '/outHome',
    name: 'outHome',
    component: () => import('@/views/outHome/index.vue'),
    children: outeRoutes,
  },
  {
    path: '/systemHome',
    name: 'systemHome',
    component: () => import('@/views/systemHome/index.vue'),
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    redirect: '/frimManager',
    children: showRoutes,
  },
  // 注意：这里不包含通配符404路由，将在动态路由加载后添加
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
})

const sortRoutesByLevel = (routes) => {
  // 先对子路由进行排序（如果有的话）
  routes.forEach((route) => {
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

// 获取路由列表
import { getRoutes } from '@/api/routes.js'

const initializeRouter = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await getRoutes()
      // 对子路由排序
      let routes = sortRoutesByLevel(res.data.tree)
      const dynamicRoutes = formatRoutes(routes || [])
      dynamicRoutes.forEach((route) => {
        if (route.name === '系统管理') {
          router.addRoute('home', route)
        } else if (route.name === '系统页面') {
          router.addRoute('outHome', route)
        } else if (route.name === '系统首页') {
          router.addRoute('systemHome', route)
        }
      })
      dynamicRoutes.forEach((route) => {
        showRoutes.push(route)
      })
      resolve(showRoutes)
    } catch (error) {
      console.error('路由加载失败:', error)
      reject(error)
    }
  })
}

// 格式化路由
const formatRoutes = (routes) => {
  return routes.map((route) => ({
    path: route.router,
    name: route.name,
    level: route.level,
    component: loadView(route.view),
    meta: route.meta || {},
    children: route.children ? formatRoutes(route.children) : [],
    showChildren: route.showChildren,
  }))
}

// 动态加载组件
const loadView = (view) => {
  if (view === 'Layout') return Layout
  return () => import(`@/views/${view}/index.vue`)
}

// 立即执行异步路由初始化
export const setupRouter = async (app) => {
  await initializeRouter().then((res) => {
    console.log(res);
    app.use(router)
  })
}



// 路由拦截器
router.beforeEach((to, from, next) => {
  console.log(constantRoutes);

  if (localStorage.getItem('token') || to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})
