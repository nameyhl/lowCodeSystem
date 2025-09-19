import request from '@/utils/requset'

const className = 'business/takein'

export function takein(data) {
  return request({
    url: `/${className}/addTakein`,
    method: 'post',
    data,
  })
}

export function getTakeinList(data) {
  return request({
    url: `/${className}/getTakein`,
    method: 'get',
    params: data,
  })
}
