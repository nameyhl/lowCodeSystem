import request from '@/utils/requset'

const className = 'manager/position'
// 新增职位
export function addPosition(data) {
  return request({
    url: `${className}/addPosition`,
    method: 'post',
    data,
  })
}

// 查询职位列表
export function getPositionList(data) {
  return request({
    url: `${className}/getPositionList`,
    method: 'get',
    params: data,
  })
}

// 删除职位
export function deletePosition(id) {
  return request({
    url: `${className}/deletePosition`,
    method: 'delete',
    params: {
      id,
    },
  })
}

export function updatePosition(data) {
  return request({
    url: `${className}/updatePosition`,
    method: 'put',
    data,
  })
}
