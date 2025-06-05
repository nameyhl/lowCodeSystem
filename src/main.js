import { createApp } from 'vue'
import pinia from './stores/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router/index.js'
import './assets/base.less'

import App from './App.vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus,{
  locale: zhCn,
})
app.use(pinia)
app.use(router)

app.mount('#app')
