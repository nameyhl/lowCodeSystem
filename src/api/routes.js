import request from '@/utils/requset'

let className = 'manager/routes'

export const getRoutes = (data) => {
  return request({
    url: `${className}/getRoutes`,
    method: 'get',
    params: data,
  })
}

export const addRoutes = (data) => {
  return request({
    url: `${className}/addRoute`,
    method: 'post',
    data,
  })
}

export const deleteRoutes = (data) => {
  return request({
    url: `${className}/deleteRoutes`,
    method: 'post',
    data,
  })
}

// 修改路由
export const updateRoutes = (data) => {
  return request({
    url: `${className}/updateRoute`,
    method: 'post',
    data,
  })
}

// 查询路由
export const searchRoutes = (data) => {
  return request({
    url: `${className}/searchRoutes`,
    method: 'post',
    data,
  })
}
