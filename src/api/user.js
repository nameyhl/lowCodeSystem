import request from '@/utils/requset'
let className = '/user'

// 新增用户
export function addUser(data) {
  return request({
    url: `${className}/addUser`,
    method: 'post',
    data: data,
  })
}

// 获取用户
export function getUser(params) {
  return request({
    url: `${className}/getUser`,
    method: 'get',
    params: params,
  })
}

// 修改用户信息
export function updateUser(data) {
  return request({
    url: `${className}/updateUser`,
    method: 'post',
    data: data,
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `${className}/deleteUser`,
    method: 'delete',
    params: id,
  })
}

// 根据部门id获取用户
export function getUserByDepartmentId(id) {
  return request({
    url: `${className}/getUserByDepartmentId`,
    method: 'get',
    params: id,
  })
}

// 根据分公司id获取用户
export function getAllUser(data) {
  return request({
    url: `${className}/getAllUser`,
    method: 'get',
    params: data,
  })
}

// 搜索用户
export function searchUser(data) {
  return request({
    url: `${className}/searchUser`,
    method: 'post',
    data,
  })
}

// 登录
export function login(data) {
  return request({
    url: `${className}/login`,
    method: 'post',
    data,
  })
}
