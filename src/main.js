import { createApp } from 'vue'
import pinia from './stores/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { setupRouter } from './router/index.js'
import './assets/base.less'

import App from './App.vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 获取当前窗口大小，判断是pc机还是平板，还是手机
let width = window.innerWidth
let model = 'PC'
if (width < 768) {
  model = 'mobile'
} else if (width < 1024) {
  model = 'tablet'
}

sessionStorage.setItem('model', model)

// 注册全局方法
import utils from './utils/index.js'
app.config.globalProperties.$utils = utils

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(pinia)
await setupRouter(app).then(() => {
  app.mount('#app')
})
