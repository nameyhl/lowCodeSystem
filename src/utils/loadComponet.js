// utils/loadComponent.js
import { defineAsyncComponent } from 'vue'

/**
 * 异步加载组件
 * @param {Object|Function} loader - 组件加载器
 * @param {Object} options - 额外配置选项
 * @returns {Component}
 */
export const loadComponent = (loader, options = {}) => {
  return defineAsyncComponent({
    loader,
    delay: 200,
    timeout: 30000,
    errorComponent: () => import('../components/errorComponet.vue'),
    loadingComponent: () => import('../components/loadingComponent.vue'),
    ...options,
  })
}
