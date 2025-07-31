import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
// 创建可一个新的axios对象
const request = axios.create({
  baseURL: '/api/manager', // 后端的接口地址  ip:port
  timeout: 30000,
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem("token")
    return config
  },
  (error) => {
    console.error('request error: ' + error) // for debug
    return Promise.reject(error)
  },
)

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
  (response) => {
    let res = response.data

    // 兼容服务端返回的字符串数据
    if (typeof res === 'string') {
      res = res ? JSON.parse(res) : res
    }
    return res
  },
  (error) => {
    let data = error.response.data
    if (data.status === 400) {
      ElMessage.error(data.msg)
    } else if (data.code === 401) {
      ElMessage.error('请先登录')
      router.push('/login')
    }
    console.error('response error: ' + error) // for debug
    return Promise.reject(error)
  },
)

export default request
