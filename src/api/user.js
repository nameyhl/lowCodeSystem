import request from '@/utils/requset'

export function addUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data: data,
  })
}

export function getUser(params) {
  return request({
    url: '/user/getUser',
    method: 'get',
    params: params,
  })
}

export function updateUser(data) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data: data,
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/deleteUser',
    method: 'delete',
    params: id,
  })
}

export function getUserByDepartmentId(id) {
  return request({
    url: '/user/getUserByDepartmentId',
    method: 'get',
    params: id,
  })
}

export function getUserByFrimId(id) {
  return request({
    url: '/user/getUserByFrimId',
    method: 'get',
    params: id,
  })
}
