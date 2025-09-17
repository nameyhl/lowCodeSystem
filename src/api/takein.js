import request from '@/utils/requset'

const className = 'business/takein'

export function takein(data) {
  return request({
    url: `/${className}/addTakein`,
    method: 'post',
    data,
  })
}
