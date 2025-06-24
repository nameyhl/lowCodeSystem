import request from '@/utils/requset'

const className = '/position'
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
    method: 'post',
    data,
  })
}
