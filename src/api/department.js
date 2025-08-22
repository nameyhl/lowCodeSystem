import request from '@/utils/requset'

const className = 'manager/department'
export function addDepartment(data) {
  return request({
    url: `${className}/addDepartment`,
    method: 'post',
    data,
  })
}

export function getDepartmentList(params) {
  return request({
    url: `${className}/getDepartment`,
    method: 'get',
    params,
  })
}

export function updateDepartment(data) {
  return request({
    url: `${className}/updateDepartment`,
    method: 'post',
    data,
  })
}

export function deleteDepartment(id) {
  return request({
    url: `${className}/deleteDepartment`,
    method: 'delete',
    params: id,
  })
}
